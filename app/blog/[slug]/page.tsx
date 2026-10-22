import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import PageLogo from "@/components/PageLogo";
import PostBody from "@/components/PostBody";
import { getFullPosts, getPostBySlug } from "@/lib/posts";
import { formatPostDate } from "@/lib/post-format";
import { SITE_NAME, SITE_URL } from "@/lib/site";

// Only posts that exist at build time have a page; anything else is a 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getFullPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.linkedinOnly) return {};

  const url = `${SITE_URL}/blog/${post.slug}`;
  return {
    title: `${post.title} | ${SITE_NAME}`,
    description: post.summary,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.summary,
      siteName: SITE_NAME,
      publishedTime: post.date,
      authors: ["David S. Doyle"],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.summary },
  };
}

export default async function BlogPost({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post || post.linkedinOnly) notFound();

  const url = `${SITE_URL}/blog/${post.slug}`;
  const linkedInShare = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.summary,
    datePublished: post.date,
    mainEntityOfPage: url,
    url,
    author: { "@type": "Person", name: "David S. Doyle", url: `${SITE_URL}/about` },
    publisher: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
  };

  return (
    <div className="relative pt-40 pb-24 px-6">
      <PageLogo />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
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
          {formatPostDate(post.date)} &middot; {post.readingMinutes} min read
        </p>
        <h1 className="text-3xl md:text-5xl font-black mb-10 leading-tight">{post.title}</h1>

        <div className="mb-14">
          <PostBody markdown={post.body} />
        </div>

        <div className="border-t border-white/10 pt-8 mb-10">
          <p className="text-white/50 text-sm mb-4">
            Written by Major General (Ret.) David S. Doyle, Founder &amp; Principal of{" "}
            {SITE_NAME}.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            {post.linkedinUrl && (
              <a
                href={post.linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-1.5 border border-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm hover:border-white/40 transition-colors"
              >
                View on LinkedIn
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                </svg>
              </a>
            )}
            <a
              href={linkedInShare}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center border border-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm hover:border-white/40 transition-colors"
            >
              Share on LinkedIn
            </a>
            <Link
              href="/contact"
              className="inline-block text-center bg-[#C9713D] text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors"
            >
              Schedule a Call
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
