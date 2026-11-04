import type { Metadata } from "next";
import { redirect } from "next/navigation";
import PostEditor from "@/components/admin/PostEditor";
import { adminAuthConfigured, githubConfigured, isAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "New post | Summit Initiative Solutions",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function NewPostPage() {
  if (!adminAuthConfigured() || !(await isAdmin()) || !githubConfigured()) redirect("/admin");

  return (
    <div className="pt-36 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        <PostEditor mode="create" />
      </div>
    </div>
  );
}
