import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Summit Initiative Solutions",
  description:
    "Summit Initiative Solutions is led by a proven track record of leading large and complex organizations.",
};

export default function About() {
  return (
    <div className="pt-40 pb-24 px-6">
      <div className="max-w-3xl mx-auto">
        <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">About</p>
        <h1 className="text-4xl md:text-5xl font-black mb-8 leading-tight">
          Optimization backed by real experience leading organizations.
        </h1>
        <div className="space-y-6 text-white/65 text-lg leading-relaxed">
          <p>
            Summit Initiative Solutions helps leaders optimize their people, processes, and
            systems to increase returns on investment. We work with businesses, government
            agencies, and non-profits looking to improve productivity and effectiveness.
          </p>
          <p>
            What sets Summit Initiative Solutions apart from a typical consulting agency is direct
            experience: a proven track record of leading large and complex organizations, not just
            advising them.
          </p>
          <p>
            The goal on every engagement is the same &mdash; make the organization work better,
            without adding unnecessary complexity along the way.
          </p>
        </div>
        <Link
          href="/contact"
          className="mt-12 inline-block bg-[#C9713D] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors"
        >
          Schedule a Call
        </Link>
      </div>
    </div>
  );
}
