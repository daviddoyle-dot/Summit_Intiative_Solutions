import { NextResponse } from "next/server";
import { guardAdminApi } from "@/lib/admin-auth";
import { apiError } from "@/lib/admin-api";
import { commitFiles, readPost, type FileToCommit } from "@/lib/github";
import { detectImage, imageSize } from "@/lib/images";
import {
  MAX_IMAGES_PER_POST,
  MAX_IMAGE_BYTES,
  MAX_TOTAL_IMAGE_BYTES,
  PENDING_IMAGE_PATTERN,
} from "@/lib/image-limits";
import { serializePost, validatePost } from "@/lib/post-format";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";
export const maxDuration = 30; // seconds; saving a post with several pictures makes a few GitHub calls

const bad = (error: string, status = 400) => NextResponse.json({ error }, { status });

export async function POST(request: Request) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return bad("That upload was too large or couldn't be read. Try fewer or smaller images.");
  }

  // 1. The post itself.
  let fields: Record<string, unknown>;
  try {
    const raw = form.get("post");
    fields = JSON.parse(typeof raw === "string" ? raw : "");
  } catch {
    return bad("Invalid request.");
  }
  const mode = form.get("mode") === "update" ? "update" : "create";
  const expectedSha = typeof form.get("sha") === "string" ? (form.get("sha") as string) : "";

  const result = validatePost(fields);
  if (!result.ok) return bad(result.error);
  const post = result.value;

  // 2. Images the editor held back until now. Each is checked by its actual bytes.
  const uploads = new Map<string, File>();
  for (const [name, value] of form.entries()) {
    if (name.startsWith("image:") && value instanceof File) uploads.set(name.slice(6), value);
  }

  const referenced = [...new Set([...post.body.matchAll(PENDING_IMAGE_PATTERN)].map((m) => m[1]))];
  if (referenced.length > MAX_IMAGES_PER_POST) {
    return bad(`A post can have up to ${MAX_IMAGES_PER_POST} images.`);
  }

  const year = new Date().getFullYear();
  const filesToCommit: FileToCommit[] = [];
  const finalUrls = new Map<string, string>();
  let totalBytes = 0;

  for (const id of referenced) {
    const upload = uploads.get(id);
    if (!upload) return bad("One of the images didn't upload. Please add it again.");
    const data = Buffer.from(await upload.arrayBuffer());
    if (data.length > MAX_IMAGE_BYTES) return bad("One of the images is too large.");
    totalBytes += data.length;
    if (totalBytes > MAX_TOTAL_IMAGE_BYTES) {
      return bad("The images in this post add up to too much. Try fewer or smaller images.");
    }
    const kind = detectImage(data);
    if (!kind) return bad("Images must be JPG, PNG, GIF, or WebP.");

    const size = imageSize(data, kind.ext);
    const sizeTag = size && size.width > 0 && size.height > 0 ? `-${size.width}x${size.height}` : "";
    const url = `/uploads/blog/${year}/${id}${sizeTag}.${kind.ext}`;
    finalUrls.set(id, url);
    filesToCommit.push({ path: `public${url}`, data });
  }

  post.body = post.body.replace(PENDING_IMAGE_PATTERN, (_match, id: string) => `](${finalUrls.get(id)})`);
  if (post.body.includes("pending:")) return bad("An image wasn't added correctly. Please add it again.");

  // 3. Create or update, without overwriting someone else's change.
  try {
    const existing = await readPost(post.slug);
    if (mode === "create" && existing) {
      return bad("A post with this web address already exists. Choose a different address.", 409);
    }
    if (mode === "update") {
      if (!existing) return bad("That post no longer exists.", 404);
      if (expectedSha && existing.sha !== expectedSha) {
        return bad("This post was changed somewhere else. Reload the page and try again.", 409);
      }
    }

    const title = post.title.replace(/\s+/g, " ");
    filesToCommit.unshift({ path: `content/posts/${post.slug}.md`, text: serializePost(post) });
    await commitFiles(filesToCommit, `${mode === "create" ? "Publish" : "Update"} post: ${title}`);

    return NextResponse.json({
      ok: true,
      slug: post.slug,
      created: mode === "create",
      linkedinOnly: post.linkedinOnly,
      url: post.linkedinOnly ? post.linkedinUrl : `${SITE_URL}/blog/${post.slug}`,
    });
  } catch (error) {
    return apiError(error);
  }
}
