import type { Metadata } from "next";
import CalendlyButton from "@/components/CalendlyButton";
import PageLogo from "@/components/PageLogo";
import PaperDownload from "@/components/PaperDownload";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `The Three Rings | ${SITE_NAME}`,
  description:
    "Purpose, strategy, process, cadence and governance: the framework David Doyle used to connect purpose to daily work in organizations of up to 18,000 people.",
  alternates: { canonical: "/three-rings" },
};

const RINGS = [
  {
    name: "Purpose",
    tag: "the One Ring",
    body: "Why the organization exists. Everything is measured against it.",
    primary: true,
  },
  {
    name: "Strategy deployment",
    tag: "the forge",
    body: "A few breakthrough objectives, cascaded so every team sees its part.",
  },
  {
    name: "Process Map",
    tag: "the Ring of Knowledge",
    body: "How work actually flows. An X-ray of the organization.",
  },
  {
    name: "Operating Cadence",
    tag: "the Ring of Synchronization",
    body: "When leaders review, decide, and align.",
  },
  {
    name: "Terms of Reference",
    tag: "the Ring of Governance",
    body: "Who decides, who’s consulted, who executes, who’s accountable.",
  },
];

const CALLOUTS = [
  {
    line: "The product is excellent. The purpose is absent.",
    note: "On meetings that produce polished work nobody uses.",
  },
  {
    line: "Check who attends the meeting.",
    note: "The roster tells you whether it matters.",
  },
  {
    line: "Effectiveness before efficiency.",
    note: "Get the right work flowing before you make it faster.",
  },
];

const CONTROL = [
  { name: "Micromanage", note: "Too much control. Stifles initiative." },
  { name: "Closely supervise", note: "While trust is still developing." },
  { name: "Trust to operate", note: "Proven teams, still checked." },
  { name: "Neglect", note: "Not enough guidance. Risk climbs." },
];

export default function ThreeRings() {
  return (
    <div className="relative pt-40 pb-24 px-6">
      <PageLogo />
      <div className="max-w-5xl mx-auto">
        <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">
          The Three Rings
        </p>
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight max-w-4xl">
          Purpose is the One Ring. Here&rsquo;s how to forge the other three.
        </h1>
        <p className="text-white/60 text-lg leading-relaxed mb-14 max-w-2xl">
          Most companies have a purpose on the wall and a calendar full of meetings that have
          nothing to do with it. The Three Rings is how I connected the two, running
          organizations of up to 18,000 people. It works alongside whatever system your client
          already runs.
        </p>

        {/* DIAGRAM */}
        <ol className="max-w-2xl mb-20" aria-label="The Three Rings, from purpose down">
          {RINGS.map((ring, index) => (
            <li key={ring.name} className="flex flex-col items-center">
              <div
                className={`w-full rounded-2xl border p-6 md:p-7 text-center ${
                  ring.primary
                    ? "border-[#C9713D] bg-[#C9713D]/15"
                    : "border-white/[0.12] bg-[#141b2c]"
                }`}
              >
                <p className="text-xl md:text-2xl font-black text-white">
                  {ring.name}
                  <span className="text-[#E0966A] font-bold">: {ring.tag}</span>
                </p>
                <p className="text-white/60 leading-relaxed mt-2">{ring.body}</p>
              </div>
              {index < RINGS.length - 1 && (
                <div className="h-8 w-px bg-[#C9713D]/50" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>

        {/* PULL QUOTE */}
        <blockquote className="mb-20 border-l-4 border-[#C9713D] pl-6 md:pl-8 py-2 max-w-3xl">
          <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
            A process map without cadence is inert. A cadence without governance is motion without
            direction. Governance without purpose is control without meaning.
          </p>
        </blockquote>

        {/* CALLOUTS */}
        <div className="grid md:grid-cols-3 gap-6 mb-20">
          {CALLOUTS.map((callout) => (
            <div key={callout.line} className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-7">
              <p className="text-lg font-black text-[#E0966A] mb-2 leading-snug">{callout.line}</p>
              <p className="text-white/55 leading-relaxed text-[15px]">{callout.note}</p>
            </div>
          ))}
        </div>

        {/* RIGHT LEVEL OF CONTROL */}
        <div className="mb-20">
          <h2 className="text-2xl md:text-3xl font-black mb-8">The right level of control</h2>
          <div className="relative">
            <div
              className="hidden md:block absolute left-0 right-0 top-[11px] h-0.5 bg-gradient-to-r from-[#E0966A] via-white/30 to-[#E0966A]"
              aria-hidden="true"
            />
            <ol className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-4 relative">
              {CONTROL.map((point) => (
                <li key={point.name} className="flex md:flex-col items-start md:items-center gap-4 md:gap-3 md:text-center">
                  <span className="shrink-0 w-6 h-6 rounded-full border-2 border-[#C9713D] bg-[#0a0e17]" aria-hidden="true" />
                  <span>
                    <span className="block font-bold text-white">{point.name}</span>
                    <span className="block text-white/55 text-sm leading-snug mt-1">{point.note}</span>
                  </span>
                </li>
              ))}
            </ol>
          </div>
          <p className="text-white/60 leading-relaxed mt-8 max-w-2xl">
            The job is choosing the right level of control for the moment, and moving it as
            trust grows.
          </p>
        </div>

        <p className="text-white/45 text-sm mb-10">
          Published in{" "}
          <a
            href="https://www.armyupress.army.mil/Journals/Military-Review/Online-Exclusive/2026-OLE/Three-Rings/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-white transition-colors"
          >
            <em>Military Review</em> (2026)
          </a>{" "}
          with Maj. Lam Nguyen.
        </p>

        <div className="mb-10">
          <PaperDownload />
        </div>

        <CalendlyButton />
      </div>
    </div>
  );
}
