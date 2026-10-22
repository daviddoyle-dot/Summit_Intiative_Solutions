// Runs in the browser: shrinks a photo before upload so posts stay light and fit in one request.
import { MAX_IMAGE_BYTES } from "./image-limits";

const MAX_SIDE = 1600;
const QUALITIES = [0.85, 0.75, 0.65, 0.5];

export async function prepareImage(file: File): Promise<Blob> {
  if (file.type === "image/gif") {
    if (file.size > MAX_IMAGE_BYTES) throw new Error("That GIF is too large. Keep GIFs under 1.5 MB.");
    return file;
  }
  if (!/^image\/(jpeg|png|webp)$/.test(file.type)) {
    throw new Error("Please choose a JPG, PNG, GIF, or WebP image.");
  }

  let bitmap: ImageBitmap;
  try {
    bitmap = await createImageBitmap(file, { imageOrientation: "from-image" });
  } catch {
    throw new Error("Couldn't read that image. Try saving it as a JPG or PNG first.");
  }

  let scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  for (let shrink = 0; shrink < 3; shrink++) {
    const canvas = document.createElement("canvas");
    canvas.width = Math.max(1, Math.round(bitmap.width * scale));
    canvas.height = Math.max(1, Math.round(bitmap.height * scale));
    const context = canvas.getContext("2d");
    if (!context) throw new Error("Couldn't process that image in this browser.");
    context.fillStyle = "#ffffff"; // JPEG has no transparency
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

    for (const quality of QUALITIES) {
      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/jpeg", quality)
      );
      if (blob && blob.size <= MAX_IMAGE_BYTES) {
        bitmap.close();
        return blob;
      }
    }
    scale *= 0.75;
  }
  bitmap.close();
  throw new Error("That image is too large to use. Try a smaller one.");
}

export function newImageId(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (b) => (b % 36).toString(36)).join("");
}
