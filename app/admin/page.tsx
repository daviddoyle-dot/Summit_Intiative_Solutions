import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/AdminDashboard";
import LoginForm from "@/components/admin/LoginForm";
import { adminAuthConfigured, githubConfigured, isAdmin } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "Editor | Summit Initiative Solutions",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const configured = adminAuthConfigured();
  const signedIn = configured && (await isAdmin());

  return (
    <div className="pt-36 pb-24 px-6">
      <div className="max-w-4xl mx-auto">
        {!configured ? (
          <>
            <h1 className="text-3xl font-black mb-4">Editor</h1>
            <p className="text-white/60 leading-relaxed">The editor isn&rsquo;t switched on yet.</p>
          </>
        ) : signedIn ? (
          <AdminDashboard publishingReady={githubConfigured()} />
        ) : (
          <>
            <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-3">Editor</p>
            <h1 className="text-3xl md:text-4xl font-black mb-8">Sign in</h1>
            <LoginForm />
          </>
        )}
      </div>
    </div>
  );
}
