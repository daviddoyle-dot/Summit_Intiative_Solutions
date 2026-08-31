import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services | Summit Initiative Solutions",
  description:
    "Strategy, organizational effectiveness, executive decision-making, leader development, operational and crisis leadership, and AI and analytics adoption — advised directly by Major General (Ret.) David S. Doyle.",
};

const SERVICES = [
  {
    title: "Strategy & Enterprise Transformation",
    body: "Clarify what is changing, identify the gap between current and desired conditions, and align purpose, governance, priorities, and measures around a clear path forward.",
  },
  {
    title: "Organizational Effectiveness",
    body: "Assess how a team or organization is structured today, and integrate people, process, resources, and decision rights so it can move with discipline and speed.",
  },
  {
    title: "Executive Decision-Making & Communication",
    body: "Combine data with ground truth, establish clear intent, align stakeholders, and enable decisions at the right level and tempo — including under uncertainty.",
  },
  {
    title: "Leader Development",
    body: "Build deep leadership benches, match talent to the work, and strengthen the trust and accountability that let leaders take on greater responsibility.",
  },
  {
    title: "Operational & Crisis Leadership",
    body: "Direct, hands-on guidance for navigating high-stakes operations and disruption, drawn from experience leading crisis response and complex operational environments.",
  },
  {
    title: "AI & Analytics Adoption",
    body: "Bring emerging technology and data into how a large organization actually decides and operates, without losing sight of the mission it supports.",
  },
];

const APPROACH = [
  {
    title: "Influence through trust",
    body: "Build relationships quickly, listen carefully, and create commitment without relying on positional authority.",
  },
  {
    title: "Learn continuously",
    body: "Enter new problems with curiosity, seek ground truth, and learn from the people closest to the work.",
  },
  {
    title: "Lead from purpose",
    body: "Use mission, values, and stewardship as decision anchors — the organization should be stronger when the work is done.",
  },
  {
    title: "Integrate complexity",
    body: "See how talent, process, technology, governance, resources, and stakeholders fit together, and arrange them for effect.",
  },
  {
    title: "Think strategically",
    body: "Recognize patterns, alternatives, and tradeoffs, then focus the organization on the few decisions that matter most.",
  },
];

export default function Services() {
  return (
    <div className="pt-40 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">Services</p>
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          Focused engagements, measurable results.
        </h1>
        <p className="text-white/60 text-lg leading-relaxed mb-14 max-w-2xl">
          Every engagement is led directly by David Doyle and built around one goal: improving
          productivity and effectiveness in a way you can measure.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8 hover:border-[#C9713D]/50 transition-colors"
            >
              <h3 className="text-xl font-bold text-[#E0966A] mb-3">{service.title}</h3>
              <p className="text-white/60 leading-relaxed">{service.body}</p>
            </div>
          ))}
        </div>

        {/* HOW I WORK */}
        <div className="mb-16">
          <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-3">
            How I Work
          </p>
          <h2 className="text-2xl md:text-3xl font-black mb-8 max-w-2xl">
            The same operating principles, applied to your organization.
          </h2>
          <div className="grid sm:grid-cols-2 gap-6">
            {APPROACH.map((item) => (
              <div key={item.title} className="border-l-2 border-[#C9713D]/50 pl-5 py-1">
                <h3 className="text-base font-bold text-white mb-1.5">{item.title}</h3>
                <p className="text-white/55 leading-relaxed text-[15px]">{item.body}</p>
              </div>
            ))}
          </div>
        </div>

        <Link
          href="/contact"
          className="inline-block bg-[#C9713D] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors"
        >
          Discuss Your Organization
        </Link>
      </div>
    </div>
  );
}
