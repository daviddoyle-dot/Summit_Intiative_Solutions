import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { adminAuthConfigured, githubConfigured, isAdmin } from "@/lib/admin-auth";
import { isValidSlug } from "@/lib/post-format";

export const metadata: Metadata = {
  title: "Edit post | Summit Initiative Solutions",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!adminAuthConfigured() || !(await isAdmin()) || !githubConfigured()) redirect("/admin");
  if (!isValidSlug(slug)) notFound();

  return (
    <div className="pt-36 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <PostEditor mode="update" slug={slug} />
      </div>
    </div>
  );
}
