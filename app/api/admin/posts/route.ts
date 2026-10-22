import { NextResponse } from "next/server";
import { guardAdminApi } from "@/lib/admin-auth";
import { apiError } from "@/lib/admin-api";
import { listPostSlugs, readPost } from "@/lib/github";
import { parsePostFile } from "@/lib/posts";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const denied = await guardAdminApi(request);
  if (denied) return denied;

  try {
    const slugs = await listPostSlugs();
    const rows = await Promise.all(
      slugs.map(async (slug) => {
        const file = await readPost(slug);
        if (!file) return null;
        const post = parsePostFile(slug, file.raw);
        return post
          ? { slug, title: post.title, date: post.date, linkedinOnly: post.linkedinOnly, broken: false }
          : { slug, title: slug, date: "", linkedinOnly: false, broken: true };
      })
    );
    const posts = rows
      .filter((row): row is NonNullable<typeof row> => row !== null)
      .sort((a, b) => b.date.localeCompare(a.date) || a.title.localeCompare(b.title));
    return NextResponse.json({ posts });
  } catch (error) {
    return apiError(error);
  }
}
