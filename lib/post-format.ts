// Shared by the public site, the admin editor, and the admin API.
// No Node-only imports here so it can run in the browser too.

export type PostFields = {
  title: string;
  slug: string;
  /** YYYY-MM-DD, or YYYY-MM when only the month is known. */
  date: string;
  /** One or two sentences shown on the blog list and in link previews. */
  summary: string;
  /** Where the shorter version lives on LinkedIn (optional for full posts). */
  linkedinUrl: string;
  /** True when the full text lives only on LinkedIn and the card links out. */
  linkedinOnly: boolean;
  /** Markdown. Empty for LinkedIn-only entries. */
  body: string;
};

export const LIMITS = {
  title: 140,
  slug: 80,
  summary: 300,
  body: 100_000,
} as const;

const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const DATE_PATTERN = /^\d{4}-(0[1-9]|1[0-2])(-(0[1-9]|[12]\d|3[01]))?$/;
const LINKEDIN_HOSTS = new Set(["linkedin.com", "www.linkedin.com", "lnkd.in"]);

export function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= LIMITS.slug && SLUG_PATTERN.test(slug);
}

export function slugify(title: string): string {
  return title
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, LIMITS.slug)
    .replace(/-+$/g, "");
}

export function isValidLinkedInUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && LINKEDIN_HOSTS.has(url.hostname.toLowerCase());
  } catch {
    return false;
  }
}

export type ValidationResult =
  | { ok: true; value: PostFields }
  | { ok: false; error: string };

function asString(value: unknown): string {
  return typeof value === "string" ? value : "";
}

/** Normalizes untrusted input and returns a friendly message for the first problem found. */
export function validatePost(input: Partial<Record<keyof PostFields, unknown>>): ValidationResult {
  const title = asString(input.title).trim();
  const slug = asString(input.slug).trim();
  const date = asString(input.date).trim();
  const summary = asString(input.summary).trim();
  const linkedinUrl = asString(input.linkedinUrl).trim();
  const linkedinOnly = input.linkedinOnly === true;
  const body = asString(input.body).replace(/\r\n/g, "\n").trim();

  if (!title) return { ok: false, error: "Please add a title." };
  if (title.length > LIMITS.title) {
    return { ok: false, error: `Keep the title under ${LIMITS.title} characters.` };
  }
  if (!isValidSlug(slug)) {
    return {
      ok: false,
      error: "The web address can only use lowercase letters, numbers, and hyphens.",
    };
  }
  if (!DATE_PATTERN.test(date)) {
    return { ok: false, error: "Please choose a valid date." };
  }
  if (!summary) return { ok: false, error: "Please add a short summary." };
  if (summary.length > LIMITS.summary) {
    return { ok: false, error: `Keep the summary under ${LIMITS.summary} characters.` };
  }
  if (linkedinUrl && !isValidLinkedInUrl(linkedinUrl)) {
    return { ok: false, error: "The LinkedIn link should be a full https://www.linkedin.com/... address." };
  }
  if (linkedinOnly) {
    if (!linkedinUrl) {
      return { ok: false, error: "Add the LinkedIn link for a post that lives only on LinkedIn." };
    }
  } else if (!body) {
    return { ok: false, error: "Please write the post, or mark it as living only on LinkedIn." };
  }
  if (body.length > LIMITS.body) {
    return { ok: false, error: "That post is too long to save. Try splitting it in two." };
  }

  return {
    ok: true,
    value: { title, slug, date, summary, linkedinUrl, linkedinOnly, body: linkedinOnly ? "" : body },
  };
}

/** Writes a post as a Markdown file with a YAML header. JSON strings are valid YAML. */
export function serializePost(post: PostFields): string {
  const lines = [
    "---",
    `title: ${JSON.stringify(post.title)}`,
    `date: ${JSON.stringify(post.date)}`,
    `summary: ${JSON.stringify(post.summary)}`,
  ];
  if (post.linkedinUrl) lines.push(`linkedinUrl: ${JSON.stringify(post.linkedinUrl)}`);
  if (post.linkedinOnly) lines.push("linkedinOnly: true");
  lines.push("---", "");
  return lines.join("\n") + (post.body ? post.body + "\n" : "");
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-09-03" -> "Sep 3, 2026"; "2026-08" -> "Aug 2026". */
export function formatPostDate(date: string): string {
  const [year, month, day] = date.split("-");
  const monthName = MONTHS[Number(month) - 1];
  if (!monthName) return date;
  return day ? `${monthName} ${Number(day)}, ${year}` : `${monthName} ${year}`;
}

/** Rough reading time at ~220 words per minute, never less than one minute. */
export function readingMinutes(markdown: string): number {
  const words = markdown.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 220));
}
