"use client";

import Link from "next/link";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import PostBody from "@/components/PostBody";
import {
  BULLETS,
  HEADING2,
  HEADING3,
  NUMBERS,
  QUOTE,
  insertBlock,
  insertLink,
  toggleLinePrefix,
  wrapSelection,
  type Edit,
} from "@/lib/editor-text";
import {
  MAX_IMAGES_PER_POST,
  MAX_TOTAL_IMAGE_BYTES,
  PENDING_IMAGE_PATTERN,
} from "@/lib/image-limits";
import { htmlToMarkdown } from "@/lib/paste-to-markdown";
import { LIMITS, formatPostDate, readingMinutes, slugify, validatePost } from "@/lib/post-format";
import { newImageId, prepareImage } from "@/lib/prepare-image";
import { SITE_URL } from "@/lib/site";

type Props = { mode: "create" | "update"; slug?: string };
type Pending = { blob: Blob; url: string };
type Done = { url: string; slug: string; created: boolean; linkedinOnly: boolean };

const inputClass =
  "w-full bg-[#0a0e17] border border-white/[0.12] rounded-lg px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#C9713D]/60";
const labelClass = "block text-sm text-white/60 mb-2";
const helpClass = "text-white/40 text-xs mt-2 leading-relaxed";

function ToolbarButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      // Keep the cursor in the text box when a toolbar button is pressed.
      onMouseDown={(event) => event.preventDefault()}
      onClick={onClick}
      className="min-w-9 h-9 px-2 rounded-lg text-sm font-bold text-white/70 hover:text-white hover:bg-white/10 transition-colors"
    >
      {children}
    </button>
  );
}

export default function PostEditor({ mode, slug: initialSlug }: Props) {
  const draftKey = `summit-draft:${mode}:${initialSlug ?? "new"}`;

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState(initialSlug ?? "");
  const [slugEdited, setSlugEdited] = useState(mode === "update");
  const [date, setDate] = useState("");
  const [summary, setSummary] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [linkedinOnly, setLinkedinOnly] = useState(false);
  const [body, setBody] = useState("");
  const [sha, setSha] = useState("");

  const [loadState, setLoadState] = useState<"loading" | "ready" | "error">(
    mode === "update" ? "loading" : "ready"
  );
  const [loadError, setLoadError] = useState("");
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [images, setImages] = useState<Record<string, Pending>>({});
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [done, setDone] = useState<Done | null>(null);
  const [liveState, setLiveState] = useState<"waiting" | "live" | "slow">("waiting");
  const [restored, setRestored] = useState(false);
  const [copied, setCopied] = useState(false);

  // What the post looked like when it was loaded. Null until loading has finished.
  const [baseline, setBaseline] = useState<string | null>(null);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imagesRef = useRef(images);
  // Where the cursor should go once the text box has its new contents.
  const pendingSelection = useRef<{ start: number; end: number } | null>(null);

  const fields = { title, slug, date, summary, linkedinUrl, linkedinOnly, body };
  const snapshot = JSON.stringify(fields);
  const dirty = !done && baseline !== null && snapshot !== baseline;

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  // After the text changes, put the cursor (or selection) where the last action wanted it.
  useLayoutEffect(() => {
    const selection = pendingSelection.current;
    const element = textareaRef.current;
    if (!selection || !element) return;
    pendingSelection.current = null;
    element.focus();
    element.setSelectionRange(selection.start, selection.end);
  });

  // ---- Loading an existing post, or starting a new one -------------------------------------

  const restoreDraft = useCallback(
    (currentSha: string) => {
      try {
        const saved = JSON.parse(localStorage.getItem(draftKey) ?? "null");
        if (!saved || (mode === "update" && saved.baseSha !== currentSha)) return false;
        const f = saved.fields;
        setTitle(f.title ?? "");
        setSlug(f.slug ?? initialSlug ?? "");
        setSlugEdited(mode === "update" || Boolean(f.slug));
        setDate(f.date ?? "");
        setSummary(f.summary ?? "");
        setLinkedinUrl(f.linkedinUrl ?? "");
        setLinkedinOnly(Boolean(f.linkedinOnly));
        // Pictures can't be saved with a draft, so drop any markers that point at them.
        setBody(
          String(f.body ?? "").replace(/!\[[^\]]*\]\(pending:[a-z0-9]+\)\n*/g, "")
        );
        return true;
      } catch {
        return false;
      }
    },
    [draftKey, initialSlug, mode]
  );

  useEffect(() => {
    const today = new Date().toLocaleDateString("en-CA");

    if (mode === "create") {
      // Reading a saved draft from this browser is syncing with an outside system, which is
      // exactly what effects are for, so the "set state in effect" warning doesn't apply.
      /* eslint-disable react-hooks/set-state-in-effect */
      const wasRestored = restoreDraft("");
      setRestored(wasRestored);
      if (!wasRestored) setDate(today);
      setBaseline(
        wasRestored
          ? ""
          : JSON.stringify({
              title: "", slug: "", date: today, summary: "", linkedinUrl: "", linkedinOnly: false, body: "",
            })
      );
      /* eslint-enable react-hooks/set-state-in-effect */
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const response = await fetch(`/api/admin/posts/${initialSlug}`, { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (cancelled) return;
        if (!response.ok) {
          setLoadError(
            response.status === 401
              ? "Your session ended. Please sign in again."
              : data.error || "Couldn't open this post."
          );
          setLoadState("error");
          return;
        }
        const post = data.post;
        const loaded = {
          title: post.title,
          slug: post.slug,
          date: post.date.length === 7 ? `${post.date}-01` : post.date,
          summary: post.summary,
          linkedinUrl: post.linkedinUrl,
          linkedinOnly: post.linkedinOnly,
          body: post.body,
        };
        setBaseline(JSON.stringify(loaded));
        setTitle(loaded.title);
        setSlug(loaded.slug);
        setDate(loaded.date);
        setSummary(loaded.summary);
        setLinkedinUrl(loaded.linkedinUrl);
        setLinkedinOnly(loaded.linkedinOnly);
        setBody(loaded.body);
        setSha(data.sha);
        setRestored(restoreDraft(data.sha));
        setLoadState("ready");
      } catch {
        if (!cancelled) {
          setLoadError("We couldn't reach the server. Please check your connection.");
          setLoadState("error");
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mode, initialSlug, restoreDraft]);

  // ---- Keep unfinished writing safe ------------------------------------------------------------

  useEffect(() => {
    if (baseline === null || done) return;
    const timer = setTimeout(() => {
      try {
        if (snapshot === baseline) localStorage.removeItem(draftKey);
        else localStorage.setItem(draftKey, JSON.stringify({ baseSha: sha, fields: JSON.parse(snapshot) }));
      } catch {
        /* storage full or unavailable: nothing to do */
      }
    }, 800);
    return () => clearTimeout(timer);
  }, [snapshot, baseline, done, sha, draftKey]);

  useEffect(() => {
    if (!dirty || publishing) return;
    const warn = (event: BeforeUnloadEvent) => event.preventDefault();
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty, publishing]);

  useEffect(
    () => () => Object.values(imagesRef.current).forEach((image) => URL.revokeObjectURL(image.url)),
    []
  );

  // ---- After publishing: wait for the new page to appear --------------------------------------

  useEffect(() => {
    if (!done || !done.created || done.linkedinOnly) return;
    let cancelled = false;
    let tries = 0;
    let timer: ReturnType<typeof setTimeout>;

    const check = async () => {
      tries += 1;
      try {
        const response = await fetch(`/blog/${done.slug}?check=${Date.now()}`, { cache: "no-store" });
        if (response.ok) {
          if (!cancelled) setLiveState("live");
          return;
        }
      } catch {
        /* keep trying */
      }
      if (cancelled) return;
      if (tries >= 40) setLiveState("slow");
      else timer = setTimeout(check, 5000);
    };

    timer = setTimeout(check, 8000);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [done]);

  // ---- Writing tools --------------------------------------------------------------------------

  const apply = (compute: (value: string, start: number, end: number) => Edit) => {
    const element = textareaRef.current;
    if (!element) return;
    const edit = compute(element.value, element.selectionStart, element.selectionEnd);
    pendingSelection.current = { start: edit.start, end: edit.end };
    setBody(edit.value);
  };

  const onPaste = (event: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const html = event.clipboardData.getData("text/html");
    if (!html) return; // plain text pastes normally
    const { markdown, droppedImages } = htmlToMarkdown(html);
    if (!markdown) return;

    event.preventDefault();
    const element = event.currentTarget;
    element.focus();
    // insertText keeps the browser's undo working; fall back to setting the text directly.
    if (!document.execCommand("insertText", false, markdown)) {
      const start = element.selectionStart;
      const end = element.selectionEnd;
      pendingSelection.current = { start: start + markdown.length, end: start + markdown.length };
      setBody(element.value.slice(0, start) + markdown + element.value.slice(end));
    }
    setNotice(
      droppedImages > 0
        ? `Pasted, with headings, bold, links and lists kept. ${droppedImages === 1 ? "A picture" : `${droppedImages} pictures`} in what you pasted couldn't come along; use "Add image" to add ${droppedImages === 1 ? "it" : "them"}.`
        : "Pasted, with headings, bold, links and lists kept."
    );
  };

  const addImages = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const element = textareaRef.current;
    if (!element) return;
    setError("");
    setNotice("");

    let count = Object.keys(images).length;
    let total = Object.values(images).reduce((sum, image) => sum + image.blob.size, 0);
    let value = element.value;
    let position = element.selectionStart;
    const added: Record<string, Pending> = {};
    const problems: string[] = [];

    for (const file of Array.from(files)) {
      try {
        if (count >= MAX_IMAGES_PER_POST) {
          problems.push(`A post can have up to ${MAX_IMAGES_PER_POST} images.`);
          break;
        }
        const blob = await prepareImage(file);
        if (total + blob.size > MAX_TOTAL_IMAGE_BYTES) {
          problems.push("The images in this post add up to too much. Try fewer or smaller images.");
          break;
        }
        const id = newImageId();
        added[id] = { blob, url: URL.createObjectURL(blob) };
        count += 1;
        total += blob.size;
        const edit = insertBlock(value, position, position, `![Describe this image](pending:${id})`);
        value = edit.value;
        position = edit.end;
      } catch (caught) {
        problems.push(caught instanceof Error ? caught.message : "Couldn't add that image.");
      }
    }

    if (Object.keys(added).length > 0) {
      setImages((current) => ({ ...current, ...added }));
      pendingSelection.current = { start: position, end: position };
      setBody(value);
      setNotice(
        'Image added. Replace "Describe this image" with a short description; it helps readers who use screen readers.'
      );
    }
    if (problems.length > 0) setError(problems[0]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ---- Publishing -----------------------------------------------------------------------------

  const publish = async () => {
    setError("");
    const check = validatePost(fields);
    if (!check.ok) {
      setError(check.error);
      return;
    }

    const used = [...new Set([...check.value.body.matchAll(PENDING_IMAGE_PATTERN)].map((m) => m[1]))];
    if (used.some((id) => !images[id])) {
      setError("A picture in your post is missing. Add it again, or delete its line from the text.");
      return;
    }

    const form = new FormData();
    form.set("post", JSON.stringify(check.value));
    form.set("mode", mode);
    form.set("sha", sha);
    for (const id of used) form.set(`image:${id}`, images[id].blob, `${id}.jpg`);

    setPublishing(true);
    try {
      const response = await fetch("/api/admin/publish", { method: "POST", body: form });
      const data = await response.json().catch(() => ({}));
      if (response.status === 401) {
        setError("Your session ended. Please sign in again. What you've written is saved on this computer.");
      } else if (!response.ok) {
        setError(data.error || "Something went wrong. Please try again.");
      } else {
        try {
          localStorage.removeItem(draftKey);
        } catch {
          /* ignore */
        }
        setLiveState("waiting");
        setDone({ url: data.url, slug: data.slug, created: data.created, linkedinOnly: data.linkedinOnly });
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setError("We couldn't reach the server. Please check your connection and try again.");
    }
    setPublishing(false);
  };

  const copyLink = async () => {
    if (!done) return;
    try {
      await navigator.clipboard.writeText(done.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("Couldn't copy automatically. Select the link and copy it by hand.");
    }
  };

  const startOver = () => {
    try {
      localStorage.removeItem(draftKey);
    } catch {
      /* ignore */
    }
    window.location.reload();
  };

  // ---- Screens --------------------------------------------------------------------------------

  if (loadState === "loading") return <p className="text-white/50">Loading...</p>;

  if (loadState === "error") {
    return (
      <div>
        <p role="alert" className="text-[#E0966A] mb-6">{loadError}</p>
        <Link href="/admin" className="text-white/70 underline">Back to all posts</Link>
      </div>
    );
  }

  if (done) {
    const fullPostUrl = `${SITE_URL}/blog/${done.slug}`;
    const inspector = `https://www.linkedin.com/post-inspector/inspect/${encodeURIComponent(fullPostUrl)}`;
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-[#C9713D]/40 bg-[#141b2c] p-8" role="status">
          <h1 className="text-3xl font-black mb-3">
            {done.created ? "Published" : "Changes saved"}
          </h1>
          {done.linkedinOnly ? (
            <p className="text-white/70 leading-relaxed">
              The blog will show a card for this post that opens it on LinkedIn. It updates in about a minute.
            </p>
          ) : done.created ? (
            liveState === "live" ? (
              <p className="text-white/70 leading-relaxed">
                Your post is live.{" "}
                <a href={`/blog/${done.slug}`} target="_blank" rel="noopener noreferrer" className="text-[#E0966A] underline">
                  Open it
                </a>
                .
              </p>
            ) : liveState === "slow" ? (
              <p className="text-white/70 leading-relaxed">
                It&rsquo;s taking longer than usual to go live. Give it a few more minutes, then try the link below.
              </p>
            ) : (
              <p className="text-white/70 leading-relaxed">
                The site is rebuilding with your post. It usually goes live within a minute or two.
              </p>
            )
          ) : (
            <p className="text-white/70 leading-relaxed">
              Your changes appear on the site in about a minute.
            </p>
          )}
        </div>

        {!done.linkedinOnly && (
          <div className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8">
            <h2 className="text-lg font-bold mb-2">Send LinkedIn readers to this post</h2>
            <p className="text-white/55 text-sm mb-4">
              Paste this link into your LinkedIn post. LinkedIn shows it as a card with the title, so readers can tap it to read the full post here.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-5">
              <input
                readOnly
                value={fullPostUrl}
                aria-label="Link to the full post"
                onFocus={(event) => event.currentTarget.select()}
                className={inputClass}
              />
              <button
                type="button"
                onClick={copyLink}
                className="shrink-0 bg-[#C9713D] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors"
              >
                {copied ? "Copied" : "Copy link"}
              </button>
            </div>
            <ul className="text-white/50 text-sm space-y-2 list-disc pl-5 marker:text-[#C9713D]">
              <li>
                Many people put the link in the first comment instead of the post itself, because LinkedIn tends to show posts with outside links to fewer people.
              </li>
              <li>
                If the card shows an old title or no picture, ask LinkedIn to refresh it with its{" "}
                <a href={inspector} target="_blank" rel="noopener noreferrer" className="text-[#E0966A] underline">
                  Post Inspector
                </a>
                .
              </li>
            </ul>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Link href="/admin" className="bg-[#C9713D] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors">
            Back to all posts
          </Link>
          <a
            href={`/admin/edit/${done.slug}`}
            className="border border-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm hover:border-white/40 transition-colors"
          >
            Edit this post
          </a>
          <a
            href="/admin/new"
            className="border border-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm hover:border-white/40 transition-colors"
          >
            Write another
          </a>
        </div>
      </div>
    );
  }

  const readingTime = readingMinutes(body);

  return (
    <div className="space-y-8">
      <div>
        <Link href="/admin" className="text-white/50 hover:text-white text-sm font-bold transition-colors">
          &larr; All posts
        </Link>
        <h1 className="text-3xl md:text-4xl font-black mt-4">
          {mode === "create" ? "New post" : "Edit post"}
        </h1>
      </div>

      {restored && (
        <p role="status" className="rounded-xl border border-white/[0.1] bg-[#141b2c] text-white/70 p-4 text-sm flex flex-wrap items-center justify-between gap-3">
          <span>We restored what you were writing last time. Pictures aren&rsquo;t saved in a draft, so add them again.</span>
          <button type="button" onClick={startOver} className="underline text-[#E0966A] font-bold">
            Start over
          </button>
        </p>
      )}

      {/* Details */}
      <div className="space-y-6 rounded-2xl border border-white/[0.1] bg-[#141b2c] p-6 md:p-8">
        <div>
          <label htmlFor="title" className={labelClass}>Title</label>
          <input
            id="title"
            type="text"
            value={title}
            maxLength={LIMITS.title}
            onChange={(event) => {
              setTitle(event.target.value);
              if (mode === "create" && !slugEdited) setSlug(slugify(event.target.value));
            }}
            className={inputClass}
            placeholder="A clear, specific title"
          />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="slug" className={labelClass}>Web address</label>
            <div className="flex items-center rounded-lg border border-white/[0.12] bg-[#0a0e17] focus-within:border-[#C9713D]/60">
              <span className="pl-4 text-white/35 text-sm whitespace-nowrap hidden sm:inline">/blog/</span>
              <input
                id="slug"
                type="text"
                value={slug}
                readOnly={mode === "update"}
                maxLength={LIMITS.slug}
                onChange={(event) => {
                  setSlugEdited(true);
                  setSlug(event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, "-"));
                }}
                className="w-full bg-transparent px-4 py-3 text-white focus:outline-none read-only:text-white/50"
              />
            </div>
            <p className={helpClass}>
              {mode === "update"
                ? "The web address can't change after publishing, so existing links keep working."
                : "Made from the title. This is the link you'll share, so it can't be changed later."}
            </p>
          </div>
          <div>
            <label htmlFor="date" className={labelClass}>Date</label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(event) => setDate(event.target.value)}
              className={inputClass}
            />
            <p className={helpClass}>
              {date ? `Shows as ${formatPostDate(date)}.` : "Choose the date this post should show."}
            </p>
          </div>
        </div>

        <div>
          <label htmlFor="summary" className={labelClass}>Short summary</label>
          <textarea
            id="summary"
            value={summary}
            maxLength={LIMITS.summary}
            rows={3}
            onChange={(event) => setSummary(event.target.value)}
            className={inputClass}
            placeholder="One or two sentences that make someone want to read it."
          />
          <p className={helpClass}>
            Shown on the blog page and in the card LinkedIn displays when you share the link. {summary.length}/{LIMITS.summary}
          </p>
        </div>

        <div>
          <label htmlFor="linkedin" className={labelClass}>
            Link to the LinkedIn version {linkedinOnly ? "" : "(optional)"}
          </label>
          <input
            id="linkedin"
            type="url"
            value={linkedinUrl}
            onChange={(event) => setLinkedinUrl(event.target.value)}
            className={inputClass}
            placeholder="https://www.linkedin.com/posts/..."
          />
          <p className={helpClass}>
            {linkedinOnly
              ? "Where readers will be taken."
              : "Adds a \"View on LinkedIn\" button to the post. You can add it later."}
          </p>
        </div>

        <label className="flex items-start gap-3 text-sm text-white/70 cursor-pointer">
          <input
            type="checkbox"
            checked={linkedinOnly}
            onChange={(event) => setLinkedinOnly(event.target.checked)}
            className="mt-1 accent-[#C9713D]"
          />
          <span>
            This one lives only on LinkedIn. The blog will show a card that links straight to it, with no full text on this site.
          </span>
        </label>
      </div>

      {/* Writing */}
      {!linkedinOnly && (
        <div className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-6 md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div role="tablist" aria-label="Write or preview" className="flex rounded-lg bg-[#0a0e17] p-1">
              {(["write", "preview"] as const).map((name) => (
                <button
                  key={name}
                  type="button"
                  role="tab"
                  aria-selected={tab === name}
                  onClick={() => setTab(name)}
                  className={`px-4 py-2 rounded-md text-sm font-bold capitalize transition-colors ${
                    tab === name ? "bg-[#C9713D] text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {name}
                </button>
              ))}
            </div>
            {tab === "write" && (
              <div className="flex flex-wrap items-center gap-1" role="toolbar" aria-label="Formatting">
                <ToolbarButton label="Bold" onClick={() => apply((v, s, e) => wrapSelection(v, s, e, "**", "bold text"))}>B</ToolbarButton>
                <ToolbarButton label="Italic" onClick={() => apply((v, s, e) => wrapSelection(v, s, e, "*", "italic text"))}>
                  <span className="italic">I</span>
                </ToolbarButton>
                <ToolbarButton label="Heading" onClick={() => apply((v, s, e) => toggleLinePrefix(v, s, e, HEADING2))}>H2</ToolbarButton>
                <ToolbarButton label="Smaller heading" onClick={() => apply((v, s, e) => toggleLinePrefix(v, s, e, HEADING3))}>H3</ToolbarButton>
                <ToolbarButton label="Bulleted list" onClick={() => apply((v, s, e) => toggleLinePrefix(v, s, e, BULLETS))}>&bull; List</ToolbarButton>
                <ToolbarButton label="Numbered list" onClick={() => apply((v, s, e) => toggleLinePrefix(v, s, e, NUMBERS))}>1. List</ToolbarButton>
                <ToolbarButton label="Quote" onClick={() => apply((v, s, e) => toggleLinePrefix(v, s, e, QUOTE))}>&ldquo; Quote</ToolbarButton>
                <ToolbarButton label="Link" onClick={() => apply(insertLink)}>Link</ToolbarButton>
                <ToolbarButton label="Add image" onClick={() => fileInputRef.current?.click()}>Add image</ToolbarButton>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/gif,image/webp"
                  multiple
                  hidden
                  onChange={(event) => void addImages(event.target.files)}
                />
              </div>
            )}
          </div>

          {tab === "write" ? (
            <>
              <textarea
                ref={textareaRef}
                value={body}
                onChange={(event) => {
                  setBody(event.target.value);
                  setNotice(""); // a tip is stale once the author starts typing
                }}
                onPaste={onPaste}
                rows={24}
                aria-label="Post text"
                className={`${inputClass} text-[16px] leading-relaxed resize-y min-h-[420px]`}
                placeholder="Write your post here, or paste it from Word or Google Docs. Headings, bold, links and lists carry over."
              />
              {notice && (
                <p role="status" className="text-sm text-white/60 mt-3">{notice}</p>
              )}
              <p className={helpClass}>
                Press Enter once for a new line, twice for a new paragraph. Use the Preview tab to see exactly how it will look.
              </p>
            </>
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-[#0a0e17] p-6 md:p-8">
              <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-3">
                {date ? formatPostDate(date) : "Date"} &middot; {readingTime} min read
              </p>
              <h2 className="text-3xl md:text-4xl font-black mb-8 leading-tight">{title || "Your title"}</h2>
              {body.trim() ? (
                <PostBody
                  markdown={body}
                  resolvePendingImage={(url) => images[url.slice("pending:".length)]?.url}
                />
              ) : (
                <p className="text-white/40">Nothing to preview yet.</p>
              )}
            </div>
          )}
        </div>
      )}

      {/* Publish */}
      <div className="space-y-4">
        {error && (
          <p role="alert" className="rounded-xl border border-[#C9713D]/40 bg-[#C9713D]/10 text-white/85 p-4 leading-relaxed">
            {error}{" "}
            {error.includes("sign in again") && (
              <a href="/admin" className="underline font-bold">Sign in</a>
            )}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            onClick={publish}
            disabled={publishing}
            className="bg-[#C9713D] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {publishing ? "Publishing..." : mode === "create" ? "Publish" : "Save changes"}
          </button>
          <p className="text-white/40 text-sm">
            {mode === "create"
              ? "Publishing makes the post public on the site within about a minute."
              : "Saved changes appear on the site within about a minute."}
          </p>
        </div>
      </div>
    </div>
  );
}
