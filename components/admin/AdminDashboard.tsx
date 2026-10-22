"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { formatPostDate } from "@/lib/post-format";

type Row = { slug: string; title: string; date: string; linkedinOnly: boolean; broken: boolean };

export default function AdminDashboard({ publishingReady }: { publishingReady: boolean }) {
  const router = useRouter();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [confirming, setConfirming] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    if (!publishingReady) return;
    let cancelled = false;

    (async () => {
      try {
        const response = await fetch("/api/admin/posts", { cache: "no-store" });
        const data = await response.json().catch(() => ({}));
        if (cancelled) return;
        if (response.status === 401) {
          router.refresh(); // session ended: shows the sign-in form again
        } else if (!response.ok) {
          setError(data.error || "Couldn't load your posts.");
        } else {
          setRows(data.posts);
        }
      } catch {
        if (!cancelled) setError("We couldn't reach the server. Please check your connection.");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [publishingReady, router]);

  const signOut = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.refresh();
  };

  const remove = async (slug: string) => {
    setDeleting(slug);
    setNotice("");
    try {
      const response = await fetch(`/api/admin/posts/${slug}`, { method: "DELETE" });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        setError(data.error || "Couldn't delete that post.");
      } else {
        setNotice("Deleted. The site updates in about a minute.");
        setRows((current) => current?.filter((row) => row.slug !== slug) ?? null);
      }
    } catch {
      setError("We couldn't reach the server. Please check your connection.");
    }
    setConfirming(null);
    setDeleting(null);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-3">Editor</p>
          <h1 className="text-3xl md:text-4xl font-black">Your blog posts</h1>
        </div>
        <div className="flex items-center gap-3">
          {publishingReady && (
            <Link
              href="/admin/new"
              className="bg-[#C9713D] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors"
            >
              New post
            </Link>
          )}
          <button
            type="button"
            onClick={signOut}
            className="border border-white/20 text-white px-5 py-3 rounded-xl font-bold text-sm hover:border-white/40 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>

      {!publishingReady && (
        <p className="rounded-xl border border-[#C9713D]/40 bg-[#C9713D]/10 text-white/80 p-5 mb-8 leading-relaxed">
          Publishing isn&rsquo;t connected yet, so posts can&rsquo;t be saved from here. Once the
          site&rsquo;s publishing key is added, your posts will appear on this page.
        </p>
      )}

      {notice && (
        <p role="status" className="rounded-xl border border-white/[0.1] bg-[#141b2c] text-white/80 p-4 mb-6">
          {notice}
        </p>
      )}
      {error && (
        <p role="alert" className="rounded-xl border border-[#C9713D]/40 bg-[#C9713D]/10 text-white/80 p-4 mb-6">
          {error}
        </p>
      )}

      {publishingReady && rows === null && !error && <p className="text-white/50">Loading...</p>}

      {rows && rows.length === 0 && (
        <p className="text-white/50">No posts yet. Choose &ldquo;New post&rdquo; to write your first.</p>
      )}

      {rows && rows.length > 0 && (
        <ul className="space-y-3">
          {rows.map((row) => (
            <li
              key={row.slug}
              className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-5 flex flex-wrap items-center justify-between gap-4"
            >
              <div className="min-w-0">
                <p className="font-bold text-white break-words">{row.title}</p>
                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.15em] mt-1">
                  {row.broken
                    ? "Has a problem and can't be opened here"
                    : `${formatPostDate(row.date)} · ${row.linkedinOnly ? "LinkedIn link only" : "Full post"}`}
                </p>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold">
                {!row.broken && !row.linkedinOnly && (
                  <Link
                    href={`/blog/${row.slug}`}
                    target="_blank"
                    className="px-3 py-2 text-white/60 hover:text-white transition-colors"
                  >
                    View
                  </Link>
                )}
                {!row.broken && (
                  <Link
                    href={`/admin/edit/${row.slug}`}
                    className="px-3 py-2 text-[#E0966A] hover:text-white transition-colors"
                  >
                    Edit
                  </Link>
                )}
                {confirming === row.slug ? (
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => remove(row.slug)}
                      disabled={deleting === row.slug}
                      className="px-3 py-2 rounded-lg bg-[#C9713D] text-white hover:bg-[#b8632f] transition-colors disabled:opacity-60"
                    >
                      {deleting === row.slug ? "Deleting..." : "Yes, delete"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(null)}
                      className="px-3 py-2 text-white/60 hover:text-white transition-colors"
                    >
                      Cancel
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirming(row.slug)}
                    className="px-3 py-2 text-white/40 hover:text-white transition-colors"
                  >
                    Delete
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
