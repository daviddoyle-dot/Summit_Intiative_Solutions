import type { Metadata } from "next";
import Link from "next/link";
import { FEATURED_POSTS } from "@/lib/linkedin-posts";

export const metadata: Metadata = {
  title: "Blog | Summit Initiative Solutions",
  description: "Featured LinkedIn posts and insights from David Doyle.",
};

const PERSONAL_LINKEDIN = "https://www.linkedin.com/in/mg-david-doyle/";

export default function Blog() {
  return (
    <div className="pt-40 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">Blog</p>
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          Featured posts from LinkedIn.
        </h1>
        <p className="text-white/60 text-lg leading-relaxed mb-14 max-w-2xl">
          A curated selection of David&rsquo;s most-shared thinking on leadership, strategy, and
          organizational effectiveness &mdash; posted first on LinkedIn.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {FEATURED_POSTS.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8 flex flex-col hover:border-[#C9713D]/50 transition-colors"
            >
              <p className="text-white/35 text-xs font-bold uppercase tracking-[0.2em] mb-4">
                {post.date}
              </p>
              <h3 className="text-lg font-bold text-white mb-3 leading-snug">{post.title}</h3>
              <p className="text-white/55 leading-relaxed text-[15px] mb-6 flex-1">
                {post.excerpt}
              </p>
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
          ))}
        </div>

        <div className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <h2 className="text-lg font-bold text-white mb-1">Follow along on LinkedIn</h2>
            <p className="text-white/55 text-sm">
              New posts on leadership and organizational strategy, as they happen.
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

        <Link
          href="/contact"
          className="mt-14 inline-block bg-[#C9713D] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors"
        >
          Schedule a Call
        </Link>
      </div>
    </div>
  );
}
