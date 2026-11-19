import test from "node:test";
import assert from "node:assert/strict";
import { jsonLdHtml } from "../lib/json-ld";

test("a title can't close the script tag it sits in", () => {
  const html = jsonLdHtml({ headline: "Hi </script><script>alert(1)</script>" });
  assert.ok(!html.includes("</script>"));
  assert.ok(!html.includes("<script>"));
  assert.equal(html, '{"headline":"Hi \\u003c/script>\\u003cscript>alert(1)\\u003c/script>"}');
});

test("an HTML comment opener can't start inside the script either", () => {
  assert.ok(!jsonLdHtml({ headline: "<!-- x" }).includes("<!--"));
});

test("the escaped text still reads back as the original data", () => {
  const data = {
    "@type": "BlogPosting",
    headline: "Tags like </script> & <b>, quotes \" and ' and a line\u2028break",
    author: { name: "David S. Doyle" },
  };
  assert.deepEqual(JSON.parse(jsonLdHtml(data)), data);
});

test("ordinary data comes out exactly as JSON.stringify writes it", () => {
  const data = { "@context": "https://schema.org", "@type": "Organization", name: "Summit Initiative Solutions" };
  assert.equal(jsonLdHtml(data), JSON.stringify(data));
});
