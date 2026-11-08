import type { Metadata } from "next";
import Link from "next/link";
import PageLogo from "@/components/PageLogo";
import { getAllPosts } from "@/lib/posts";
import { formatPostDate } from "@/lib/post-format";
import CalendlyButton from "@/components/CalendlyButton";
import { SITE_NAME } from "@/lib/site";
import { isPublished } from "@/lib/posts";

// Refresh hourly so scheduled posts appear on their date.
export const revalidate = 3600;

export const metadata: Metadata = {
  title: `Stories | ${SITE_NAME}`,
  description:
    "Stories from 33 years of leading, from Major General (Ret.) David S. Doyle: what he learned the hard way, one story at a time.",
  alternates: { canonical: "/blog" },
};

const PERSONAL_LINKEDIN = "https://www.linkedin.com/in/mg-david-doyle/";

const cardClass =
  "group rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8 flex flex-col hover:border-[#C9713D]/50 transition-colors";

export default function Blog() {
  const posts = getAllPosts();

  return (
    <div className="relative pt-40 pb-24 px-6">
      <PageLogo />
      <div className="max-w-5xl mx-auto">
        <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">Stories</p>
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          Stories from 33 years of leading.
        </h1>
        <p className="text-white/60 text-lg leading-relaxed mb-14 max-w-2xl">
          What I learned the hard way, one story at a time. Shorter versions run on LinkedIn.
        </p>

        {posts.length === 0 ? (
          <p className="text-white/50 mb-16">New posts are on the way.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            {posts.map((post) => {
              const meta = (
                <p className="text-white/35 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                  {!isPublished(post) && <span className="text-[#E0966A]">Scheduled &middot; </span>}
                  {formatPostDate(post.date)}
                  {!post.linkedinOnly && ` · ${post.readingMinutes} min read`}
                </p>
              );
              const body = (
                <>
                  <h3 className="text-lg font-bold text-white mb-3 leading-snug">{post.title}</h3>
                  <p className="text-white/55 leading-relaxed text-[15px] mb-6 flex-1">
                    {post.summary}
                  </p>
                </>
              );

              // Posts that live only on LinkedIn send the reader straight there.
              if (post.linkedinOnly) {
                return (
                  <a
                    key={post.slug}
                    href={post.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={cardClass}
                  >
                    {meta}
                    {body}
                    <span className="text-[#E0966A] text-sm font-bold inline-flex items-center gap-1.5">
                      Read on LinkedIn
                      <svg
                        className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 17L17 7M7 7h10v10" />
                      </svg>
                    </span>
                  </a>
                );
              }

              return (
                <Link key={post.slug} href={`/blog/${post.slug}`} className={cardClass}>
                  {meta}
                  {body}
                  <span className="text-[#E0966A] text-sm font-bold inline-flex items-center gap-1.5">
                    Read more
                    <svg
                      className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2.5}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Follow along on LinkedIn</h2>
            <p className="text-white/55 text-sm">
              A new story most weeks.
            </p>
          </div>
          <a
            href={PERSONAL_LINKEDIN}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 border border-white/20 text-white px-6 py-3 rounded-xl font-bold text-sm hover:border-white/40 transition-colors"
          >
            Follow David
          </a>
        </div>

        <CalendlyButton className="mt-14" />
      </div>
    </div>
  );
}
