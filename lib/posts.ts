// Server-side post loading. Posts are Markdown files in content/posts, read at build time.
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { validatePost, readingMinutes, type PostFields } from "./post-format";

export type Post = PostFields & { readingMinutes: number };

const POSTS_DIR = path.join(process.cwd(), "content", "posts");

const refuseToRun = {
  parse: () => {
    throw new Error("Executable front matter is not allowed.");
  },
};

/** Parses a post file's header as plain YAML only. gray-matter can run JavaScript if a file
 *  opens with "---js", so those engines are switched off. */
function readFrontMatter(raw: string): { data: Record<string, unknown>; content: string } | null {
  try {
    const { data, content } = matter(raw, {
      engines: { js: refuseToRun, javascript: refuseToRun },
    });
    return { data, content };
  } catch {
    return null;
  }
}

/** Parses one post file. Exported so the admin API can reuse the exact same rules. */
export function parsePostFile(slug: string, raw: string): Post | null {
  const parsed = readFrontMatter(raw);
  if (!parsed) {
    console.warn(`Skipping post "${slug}": the header couldn't be read.`);
    return null;
  }
  const { data, content } = parsed;
  // Unquoted YAML dates (2026-09-03) arrive as Date objects.
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : data.date;

  const result = validatePost({
    title: data.title,
    slug,
    date,
    summary: data.summary,
    linkedinUrl: data.linkedinUrl,
    linkedinOnly: data.linkedinOnly === true,
    body: content,
  });
  if (!result.ok) {
    console.warn(`Skipping post "${slug}": ${result.error}`);
    return null;
  }
  return { ...result.value, readingMinutes: readingMinutes(result.value.body) };
}

function byNewest(a: Post, b: Post): number {
  return b.date.localeCompare(a.date) || a.title.localeCompare(b.title);
}

export function getAllPosts(): Post[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      return parsePostFile(slug, fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
    })
    .filter((post): post is Post => post !== null)
    .sort(byNewest);
}

export function getPostBySlug(slug: string): Post | undefined {
  return getAllPosts().find((post) => post.slug === slug);
}

/** Posts that have a full page on this site (LinkedIn-only entries just link out). */
export function getFullPosts(): Post[] {
  return getAllPosts().filter((post) => !post.linkedinOnly);
}
