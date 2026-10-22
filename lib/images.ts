// Checks uploaded images by what the bytes actually are, not by what the browser claims.

export type ImageKind = { ext: "jpg" | "png" | "gif" | "webp" };

/** SVG is deliberately not allowed: it can carry scripts. */
export function detectImage(data: Buffer): ImageKind | null {
  if (data.length < 12) return null;
  if (data[0] === 0xff && data[1] === 0xd8 && data[2] === 0xff) return { ext: "jpg" };
  if (data.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { ext: "png" };
  }
  if (data.subarray(0, 4).toString("ascii") === "GIF8") return { ext: "gif" };
  if (data.subarray(0, 4).toString("ascii") === "RIFF" && data.subarray(8, 12).toString("ascii") === "WEBP") {
    return { ext: "webp" };
  }
  return null;
}

export type ImageSize = { width: number; height: number };

/** Reads an image's pixel size straight from its bytes, or null if it can't be determined. */
export function imageSize(data: Buffer, ext: ImageKind["ext"]): ImageSize | null {
  try {
    if (ext === "png") {
      return { width: data.readUInt32BE(16), height: data.readUInt32BE(20) };
    }
    if (ext === "gif") {
      return { width: data.readUInt16LE(6), height: data.readUInt16LE(8) };
    }
    if (ext === "jpg") {
      let i = 2;
      while (i + 9 < data.length) {
        if (data[i] !== 0xff) {
          i += 1;
          continue;
        }
        const marker = data[i + 1];
        // Start-of-frame markers hold the size (except 0xC4, 0xC8, and 0xCC).
        if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
          return { width: data.readUInt16BE(i + 7), height: data.readUInt16BE(i + 5) };
        }
        i += 2 + data.readUInt16BE(i + 2);
      }
      return null;
    }
    if (ext === "webp") {
      const kind = data.subarray(12, 16).toString("ascii");
      if (kind === "VP8X") {
        return { width: 1 + data.readUIntLE(24, 3), height: 1 + data.readUIntLE(27, 3) };
      }
      if (kind === "VP8 ") {
        return { width: data.readUInt16LE(26) & 0x3fff, height: data.readUInt16LE(28) & 0x3fff };
      }
      if (kind === "VP8L") {
        const bits = data.readUInt32LE(21);
        return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
      }
    }
  } catch {
    /* fall through */
  }
  return null;
}
