import test from "node:test";
import assert from "node:assert/strict";
import matter from "gray-matter";
import {
  formatPostDate,
  isValidLinkedInUrl,
  isValidSlug,
  readingMinutes,
  serializePost,
  slugify,
  validatePost,
  type PostFields,
} from "../lib/post-format";

const good: PostFields = {
  title: "Why Goals Fail",
  slug: "why-goals-fail",
  date: "2026-10-22",
  summary: "A short summary.",
  linkedinUrl: "https://www.linkedin.com/posts/example",
  linkedinOnly: false,
  body: "Hello\n\nWorld",
};

test("slugify makes clean web addresses", () => {
  assert.equal(slugify("Why Goals Fail"), "why-goals-fail");
  assert.equal(slugify("  Don't Panic! It's \u201cFine\u201d  "), "dont-panic-its-fine");
  assert.equal(slugify("Caf\u00e9 \u2014 Au Lait"), "cafe-au-lait");
  assert.equal(slugify("---"), "");
  assert.ok(slugify("x".repeat(200)).length <= 80);
});

test("slugs reject anything that could escape the posts folder", () => {
  for (const bad of ["../etc/passwd", "a/b", "A", "a b", "", "-a", "a-", "a--b", "a.md"]) {
    assert.equal(isValidSlug(bad), false, bad);
  }
  assert.equal(isValidSlug("a-b-2"), true);
});

test("only https LinkedIn links are accepted", () => {
  assert.equal(isValidLinkedInUrl("https://www.linkedin.com/posts/x"), true);
  assert.equal(isValidLinkedInUrl("https://lnkd.in/abc"), true);
  assert.equal(isValidLinkedInUrl("http://www.linkedin.com/posts/x"), false);
  assert.equal(isValidLinkedInUrl("https://linkedin.com.evil.test/x"), false);
  assert.equal(isValidLinkedInUrl("javascript:alert(1)"), false);
  assert.equal(isValidLinkedInUrl("not a url"), false);
});

test("validatePost accepts a good post and normalizes line endings", () => {
  const result = validatePost({ ...good, body: "a\r\nb" });
  assert.ok(result.ok);
  if (result.ok) assert.equal(result.value.body, "a\nb");
});

test("validatePost explains what is wrong, in plain words", () => {
  const cases: Array<[Partial<PostFields>, RegExp]> = [
    [{ title: " " }, /title/i],
    [{ slug: "Bad Slug" }, /web address/i],
    [{ date: "10/22/2026" }, /date/i],
    [{ summary: "" }, /summary/i],
    [{ summary: "x".repeat(301) }, /summary/i],
    [{ linkedinUrl: "http://example.com" }, /LinkedIn/],
    [{ body: "  " }, /write the post/i],
    [{ linkedinOnly: true, linkedinUrl: "" }, /LinkedIn link/],
  ];
  for (const [override, pattern] of cases) {
    const result = validatePost({ ...good, ...override });
    assert.equal(result.ok, false, JSON.stringify(override));
    if (!result.ok) assert.match(result.error, pattern);
  }
});

test("a LinkedIn-only post needs no body and drops any it has", () => {
  const result = validatePost({ ...good, linkedinOnly: true, body: "ignored" });
  assert.ok(result.ok);
  if (result.ok) assert.equal(result.value.body, "");
});

test("a month-only date is allowed", () => {
  assert.ok(validatePost({ ...good, date: "2026-08" }).ok);
  assert.equal(validatePost({ ...good, date: "2026-13" }).ok, false);
  assert.equal(validatePost({ ...good, date: "2026-02-32" }).ok, false);
});

test("serialize then parse gives the same post back, even with tricky characters", () => {
  const tricky: PostFields = {
    ...good,
    title: 'He said: "Stop" \u2014 then left: #1 & <b>bold</b>',
    summary: "Line one's `code` \\ backslash and: colon",
    body: "# Heading\n\n- item\n\n> quote with \"quotes\"\n\n---\nlast line",
  };
  const parsed = matter(serializePost(tricky));
  assert.equal(parsed.data.title, tricky.title);
  assert.equal(parsed.data.summary, tricky.summary);
  assert.equal(parsed.data.date, tricky.date);
  assert.equal(parsed.data.linkedinUrl, tricky.linkedinUrl);
  assert.equal(parsed.content.trim(), tricky.body);
});

test("a body that itself contains a --- line cannot break the header", () => {
  const post = { ...good, body: "before\n\n---\ntitle: injected\n---\n\nafter" };
  const parsed = matter(serializePost(post));
  assert.equal(parsed.data.title, good.title);
  assert.ok(parsed.content.includes("title: injected"));
});

test("dates display the way people write them", () => {
  assert.equal(formatPostDate("2026-09-03"), "Sep 3, 2026");
  assert.equal(formatPostDate("2026-08"), "Aug 2026");
});

test("reading time is never zero", () => {
  assert.equal(readingMinutes(""), 1);
  assert.equal(readingMinutes("word ".repeat(1100)), 5);
});
