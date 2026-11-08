import type { Metadata } from "next";
import Link from "next/link";
import Beliefs from "@/components/Beliefs";
import CalendlyButton from "@/components/CalendlyButton";
import PageLogo from "@/components/PageLogo";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `How I Help | ${SITE_NAME}`,
  description:
    "Coaching for your client's second-in-command, story-driven guest segments, coaching the coach, and the Three Rings workshop, from Major General (Ret.) David S. Doyle.",
};

const OFFERS: { title: string; body: string; href?: string }[] = [
  {
    title: "Coaching your client’s second-in-command",
    body: "One-on-one coaching for the leader who runs the business day to day, from someone who held that seat at 4,500 and 15,000 people.",
  },
  {
    title: "Founder and #2 tune-up",
    body: "For when the founder and the operator stop trusting each other, or the founder keeps overriding the plan.",
  },
  {
    title: "A guest in your session",
    body: "A 60–90 minute, story-driven segment inside your client’s quarterly or annual. The barbecue, the dry-erase board, the Apache fuelers.",
  },
  {
    title: "Coaching the coach",
    body: "Reading a hard room and delivering hard truths, from the playbook I used coaching 12 organizations in 13 months.",
  },
  {
    title: "The Three Rings workshop",
    body: "How I connected purpose to daily work at 18,000 people. It complements the system your client already runs; it doesn’t replace it.",
    href: "/three-rings",
  },
  {
    title: "The first 90 days",
    body: "An outside read for a client’s new senior leader: what’s strong, what’s at risk, what to do first.",
  },
  {
    title: "A shadow program",
    body: "Design a 48-hour shadow program so the next layer of leaders sees how decisions really get made.",
  },
  {
    title: "When it breaks",
    body: "Scale-up and crisis support when a client outgrows its structure or something goes badly wrong.",
  },
];

export default function Services() {
  return (
    <div className="relative pt-40 pb-24 px-6">
      <PageLogo />
      <div className="max-w-5xl mx-auto">
        <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">How I help</p>
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">Bring a general into the room.</h1>
        <p className="text-white/60 text-lg leading-relaxed mb-14 max-w-2xl">
          Every one of these starts with a conversation. Tell me about your practice and the
          clients keeping you up at night.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {OFFERS.map((offer) => (
            <div
              key={offer.title}
              className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8 hover:border-[#C9713D]/50 transition-colors"
            >
              <h2 className="text-xl font-bold text-[#E0966A] mb-3">{offer.title}</h2>
              <p className="text-white/60 leading-relaxed">{offer.body}</p>
              {offer.href && (
                <Link href={offer.href} className="inline-block mt-4 text-[#E0966A] text-sm font-bold hover:text-white transition-colors">
                  See the Three Rings &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>

        <div className="mb-16 max-w-2xl">
          <Beliefs />
        </div>

        <CalendlyButton />
      </div>
    </div>
  );
}
