import test from "node:test";
import assert from "node:assert/strict";
import { detectImage } from "../lib/images";
import { PENDING_IMAGE_PATTERN } from "../lib/image-limits";

const pad = Buffer.alloc(16);

test("images are identified by their bytes", () => {
  assert.equal(detectImage(Buffer.concat([Buffer.from([0xff, 0xd8, 0xff, 0xe0]), pad]))?.ext, "jpg");
  assert.equal(detectImage(Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), pad]))?.ext, "png");
  assert.equal(detectImage(Buffer.concat([Buffer.from("GIF89a"), pad]))?.ext, "gif");
  assert.equal(detectImage(Buffer.concat([Buffer.from("RIFF"), Buffer.from([1, 2, 3, 4]), Buffer.from("WEBP"), pad]))?.ext, "webp");
});

test("SVG, scripts, HTML, and tiny files are rejected", () => {
  assert.equal(detectImage(Buffer.from('<svg xmlns="http://www.w3.org/2000/svg"><script>alert(1)</script></svg>')), null);
  assert.equal(detectImage(Buffer.from("<html><body>hi</body></html>")), null);
  assert.equal(detectImage(Buffer.from("MZ" + "x".repeat(40))), null);
  assert.equal(detectImage(Buffer.from([0xff, 0xd8])), null);
});

test("pending-image markers are found in Markdown", () => {
  const found = [..."![a](pending:abc123xyz) and ![b](pending:q1w2e3r4t5)".matchAll(PENDING_IMAGE_PATTERN)].map((m) => m[1]);
  assert.deepEqual(found, ["abc123xyz", "q1w2e3r4t5"]);
  assert.equal([..."![a](https://x.test/p.png)".matchAll(PENDING_IMAGE_PATTERN)].length, 0);
});

// ---- picture sizes ----

import { imageSize } from "../lib/images";
import { SIZED_IMAGE_NAME } from "../lib/image-limits";

const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==",
  "base64"
);

test("PNG size is read from the header", () => {
  assert.deepEqual(imageSize(PNG_1X1, "png"), { width: 1, height: 1 });
});

test("GIF size is read from the header", () => {
  const gif = Buffer.alloc(20);
  gif.write("GIF89a", 0, "ascii");
  gif.writeUInt16LE(320, 6);
  gif.writeUInt16LE(200, 8);
  assert.deepEqual(imageSize(gif, "gif"), { width: 320, height: 200 });
});

test("JPEG size is found even after other segments (like EXIF) come first", () => {
  const exif = Buffer.concat([Buffer.from([0xff, 0xe1, 0x00, 0x0a]), Buffer.alloc(8)]); // 10-byte segment
  const sof = Buffer.from([0xff, 0xc0, 0x00, 0x11, 0x08, 0x04, 0x2b, 0x06, 0x40, 0x03, 1, 0x22, 0, 2, 0x11, 1, 3, 0x11, 1]);
  const jpg = Buffer.concat([Buffer.from([0xff, 0xd8]), exif, sof, Buffer.alloc(8)]);
  assert.deepEqual(imageSize(jpg, "jpg"), { width: 1600, height: 1067 });
});

test("WebP sizes are read for the extended and lossless formats", () => {
  const extended = Buffer.alloc(40);
  extended.write("RIFF", 0, "ascii");
  extended.write("WEBP", 8, "ascii");
  extended.write("VP8X", 12, "ascii");
  extended.writeUIntLE(1199, 24, 3);
  extended.writeUIntLE(629, 27, 3);
  assert.deepEqual(imageSize(extended, "webp"), { width: 1200, height: 630 });

  const lossless = Buffer.alloc(40);
  lossless.write("RIFF", 0, "ascii");
  lossless.write("WEBP", 8, "ascii");
  lossless.write("VP8L", 12, "ascii");
  lossless.writeUInt32LE((799 | (449 << 14)) >>> 0, 21);
  assert.deepEqual(imageSize(lossless, "webp"), { width: 800, height: 450 });
});

test("a truncated or odd file gives no size instead of crashing", () => {
  assert.equal(imageSize(Buffer.from([0xff, 0xd8, 0xff, 0xe0, 0, 2]), "jpg"), null);
  assert.equal(imageSize(Buffer.alloc(8), "png"), null);
});

test("sizes in file names are recognised", () => {
  assert.deepEqual("/uploads/blog/2026/abc123-1600x1067.jpg".match(SIZED_IMAGE_NAME)?.slice(1, 3), ["1600", "1067"]);
  assert.equal("/uploads/blog/2026/abc123.jpg".match(SIZED_IMAGE_NAME), null);
  assert.equal("https://example.com/photo-10x10.svg".match(SIZED_IMAGE_NAME), null);
});
