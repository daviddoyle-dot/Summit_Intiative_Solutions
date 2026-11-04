import test from "node:test";
import assert from "node:assert/strict";
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
} from "../lib/editor-text";

const sel = (e: { value: string; start: number; end: number }) => e.value.slice(e.start, e.end);

test("bold wraps the selection, and applying it again unwraps", () => {
  const once = wrapSelection("say hello now", 4, 9, "**", "bold text");
  assert.equal(once.value, "say **hello** now");
  assert.equal(sel(once), "hello");
  const twice = wrapSelection(once.value, once.start, once.end, "**", "bold text");
  assert.equal(twice.value, "say hello now");
  assert.equal(sel(twice), "hello");
});

test("bold with nothing selected inserts a placeholder that is selected", () => {
  const e = wrapSelection("ab", 1, 1, "**", "bold text");
  assert.equal(e.value, "a**bold text**b");
  assert.equal(sel(e), "bold text");
});

test("headings toggle and switch levels", () => {
  const h2 = toggleLinePrefix("Title\nbody", 0, 0, HEADING2);
  assert.equal(h2.value, "## Title\nbody");
  assert.equal(toggleLinePrefix(h2.value, 0, 0, HEADING2).value, "Title\nbody");
  assert.equal(toggleLinePrefix(h2.value, 0, 0, HEADING3).value, "### Title\nbody");
});

test("bullets and numbers apply to every selected line, skip blank lines, and toggle off", () => {
  const text = "one\ntwo\n\nthree";
  const bullets = toggleLinePrefix(text, 0, text.length, BULLETS);
  assert.equal(bullets.value, "- one\n- two\n\n- three");
  assert.equal(toggleLinePrefix(bullets.value, 0, bullets.value.length, BULLETS).value, text);
  const numbers = toggleLinePrefix(text, 0, text.length, NUMBERS);
  assert.equal(numbers.value, "1. one\n2. two\n\n3. three");
});

test("switching a bulleted list to numbers replaces the bullets", () => {
  const e = toggleLinePrefix("- a\n- b", 0, 7, NUMBERS);
  assert.equal(e.value, "1. a\n2. b");
});

test("only the lines touched by the selection change", () => {
  const e = toggleLinePrefix("a\nb\nc", 2, 3, QUOTE);
  assert.equal(e.value, "a\n> b\nc");
});

test("a selection ending at the start of the next line does not include that line", () => {
  const e = toggleLinePrefix("a\nb\nc", 0, 2, QUOTE); // "a\n"
  assert.equal(e.value, "> a\nb\nc");
});

test("links: selected text becomes the link text and the address is selected", () => {
  const e = insertLink("see our site", 8, 12);
  assert.equal(e.value, "see our [site](https://)");
  assert.equal(sel(e), "https://");
});

test("links: a selected web address becomes the target", () => {
  const e = insertLink("go https://example.com now", 3, 22);
  assert.equal(e.value, "go [link text](https://example.com) now");
  assert.equal(sel(e), "link text");
});

test("links: nothing selected inserts a template", () => {
  const e = insertLink("", 0, 0);
  assert.equal(e.value, "[link text](https://)");
  assert.equal(sel(e), "https://");
});

test("blocks (like images) go on their own paragraph", () => {
  assert.equal(insertBlock("one\n\ntwo", 3, 3, "![x](y)").value, "one\n\n![x](y)\n\ntwo");
  assert.equal(insertBlock("", 0, 0, "![x](y)").value, "![x](y)");
  assert.equal(insertBlock("end", 3, 3, "![x](y)").value, "end\n\n![x](y)");
});
