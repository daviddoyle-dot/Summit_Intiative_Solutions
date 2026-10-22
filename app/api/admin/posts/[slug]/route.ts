import { NextResponse } from "next/server";
import { guardAdminApi } from "@/lib/admin-auth";
import { apiError } from "@/lib/admin-api";
import { deletePost, readPost } from "@/lib/github";
import { parsePostFile } from "@/lib/posts";
import { isValidSlug } from "@/lib/post-format";

export const dynamic = "force-dynamic";

type Context = { params: Promise<{ slug: string }> };

export async function GET(request: Request, { params }: Context) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;

  const { slug } = await params;
  if (!isValidSlug(slug)) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  try {
    const file = await readPost(slug);
    if (!file) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    const post = parsePostFile(slug, file.raw);
    if (!post) {
      return NextResponse.json(
        { error: "This post's file has a problem and can't be opened here." },
        { status: 422 }
      );
    }
    const { readingMinutes: _unused, ...fields } = post;
    void _unused;
    return NextResponse.json({ post: fields, sha: file.sha });
  } catch (error) {
    return apiError(error);
  }
}

export async function DELETE(request: Request, { params }: Context) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;

  const { slug } = await params;
  if (!isValidSlug(slug)) return NextResponse.json({ error: "Post not found." }, { status: 404 });

  try {
    const file = await readPost(slug);
    if (!file) return NextResponse.json({ error: "Post not found." }, { status: 404 });
    await deletePost(slug, file.sha, `Delete post: ${slug}`);
    return NextResponse.json({ ok: true });
  } catch (error) {
    return apiError(error);
  }
}
