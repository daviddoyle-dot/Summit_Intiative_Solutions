import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { FEATURED_POSTS } from "@/lib/linkedin-posts";

export function generateStaticParams() {
  return FEATURED_POSTS.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = FEATURED_POSTS.find((p) => p.slug === slug);
  if (!post) return {};
  return {
    title: `${post.title} | Summit Initiative Solutions`,
    description: post.excerpt,
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = FEATURED_POSTS.find((p) => p.slug === slug);
  if (!post) notFound();

  return (
    <div className="pt-40 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/blog"
          className="text-white/50 hover:text-white text-sm font-bold inline-flex items-center gap-1.5 mb-8 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Blog
        </Link>

        <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">
          {post.date}
        </p>
        <h1 className="text-3xl md:text-5xl font-black mb-10 leading-tight">{post.title}</h1>

        <div className="space-y-5 text-white/70 text-lg leading-relaxed mb-12">
          {post.content.map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <a
            href={post.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 border border-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm hover:border-white/40 transition-colors"
          >
            View on LinkedIn
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
            </svg>
          </a>
          <Link
            href="/contact"
            className="inline-block bg-[#C9713D] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors"
          >
            Schedule a Call
          </Link>
        </div>
      </div>
    </div>
  );
}
