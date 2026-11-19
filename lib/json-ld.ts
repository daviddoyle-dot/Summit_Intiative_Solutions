// Structured data goes into <script type="application/ld+json"> through
// dangerouslySetInnerHTML. JSON.stringify leaves "<" alone, so a post title
// containing "</script>" would end the tag early. The JSON escape "\u003c" is
// the same character to a JSON parser but can't start a tag.
export function jsonLdHtml(data: Record<string, unknown>): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
