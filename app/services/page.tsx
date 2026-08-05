import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Services | Summit Initiative Solutions",
  description: "Organizational, process, and systems optimization services from Summit Initiative Solutions.",
};

const SERVICES = [
  {
    title: "Organizational Optimization",
    body:
      "Assess how a team or organization is structured today, and redesign roles, reporting lines, and accountability to remove friction.",
  },
  {
    title: "Process Improvement",
    body:
      "Identify the workflows quietly costing time and money, and replace them with clear, repeatable processes your team can actually follow.",
  },
  {
    title: "Systems Alignment",
    body:
      "Make sure the tools and infrastructure an organization relies on support the strategy instead of working against it.",
  },
  {
    title: "Leadership Advisory",
    body:
      "One-on-one guidance for leaders navigating complex organizational change, drawing on direct experience leading large organizations.",
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
          Every engagement is built around one goal: improving productivity and effectiveness in
          a way you can measure.
        </p>

        <div className="grid md:grid-cols-2 gap-6 mb-14">
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
