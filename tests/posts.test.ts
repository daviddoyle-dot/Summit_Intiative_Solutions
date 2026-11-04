import test from "node:test";
import assert from "node:assert/strict";
import { parsePostFile } from "../lib/posts";
import { serializePost } from "../lib/post-format";

const header = (extra = "") =>
  `title: "T"\ndate: "2026-01-02"\nsummary: "S"\nlinkedinUrl: "https://www.linkedin.com/posts/x"\n${extra}`;

test("a normal post file parses", () => {
  const post = parsePostFile("a-post", `---\n${header()}---\nHello world`);
  assert.equal(post?.title, "T");
  assert.equal(post?.body, "Hello world");
});

test("unquoted YAML dates are handled", () => {
  const post = parsePostFile("a-post", `---\ntitle: T\ndate: 2026-01-02\nsummary: S\n---\nBody`);
  assert.equal(post?.date, "2026-01-02");
});

test("a file opening with ---js cannot run code", () => {
  (globalThis as { pwned?: boolean }).pwned = false;
  const raw = `---js\n(function(){ globalThis.pwned = true; return {title:"x"}; })()\n---\nBody`;
  assert.equal(parsePostFile("evil", raw), null);
  assert.equal((globalThis as { pwned?: boolean }).pwned, false);
});

test("broken or incomplete files are skipped rather than crashing the build", () => {
  assert.equal(parsePostFile("a", "no header at all"), null);
  assert.equal(parsePostFile("a", `---\ntitle: [unclosed\n---\nBody`), null);
  assert.equal(parsePostFile("a", `---\ntitle: "T"\n---\nBody`), null);
});

test("what the editor writes is what the site reads", () => {
  const raw = serializePost({
    title: "Round trip",
    slug: "round-trip",
    date: "2026-10-22",
    summary: "Summary",
    linkedinUrl: "",
    linkedinOnly: false,
    body: "Para one\n\nPara two",
  });
  const post = parsePostFile("round-trip", raw);
  assert.equal(post?.title, "Round trip");
  assert.equal(post?.body, "Para one\n\nPara two");
  assert.equal(post?.linkedinUrl, "");
});

test("the real posts in the repository all parse", async () => {
  const { getAllPosts } = await import("../lib/posts");
  const posts = getAllPosts();
  assert.ok(posts.length >= 4);
  for (const post of posts) assert.ok(post.body.length > 100, post.slug);
});
