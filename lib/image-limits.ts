// Image rules shared by the editor (browser) and the publish API (server).

export const MAX_IMAGE_BYTES = 1_500_000;
export const MAX_IMAGES_PER_POST = 12;
export const MAX_TOTAL_IMAGE_BYTES = 3_800_000; // stays under Vercel's ~4.5 MB request limit

/** Matches the markers the editor puts in the text for images that haven't been uploaded yet. */
export const PENDING_IMAGE_PATTERN = /\]\(pending:([a-z0-9]{6,24})\)/g;

/** Picture file names carry their size ("abc123-1600x1067.jpg") so pages can hold the space. */
export const SIZED_IMAGE_NAME = /-(\d{1,5})x(\d{1,5})\.(?:jpg|png|gif|webp)$/;
