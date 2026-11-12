import type { Metadata } from "next";
import CalendlyButton from "@/components/CalendlyButton";
import PageLogo from "@/components/PageLogo";
import PaperDownload from "@/components/PaperDownload";
import { WRITING } from "@/lib/brand";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `The Three Rings | ${SITE_NAME}`,
  description:
    "The Three Rings of Organizational Effectiveness: a practical way to connect an organization's purpose to its processes, meetings, and decisions.",
  alternates: { canonical: "/three-rings" },
};

const ARTICLE_URL = WRITING[0].url;

const RINGS = [
  {
    label: "Ring One",
    name: "Process Map",
    tagline: "Understand how the work actually gets done.",
    paragraphs: [
      "Before improving an organization, leaders need to understand its real processes: what work is being performed, how it moves between teams, and whether it contributes to the organization’s purpose.",
      "The first question is not whether the organization is efficient. It’s whether the organization is effective.",
    ],
  },
  {
    label: "Ring Two",
    name: "Operating Cadence",
    tagline: "Make meetings and information serve decisions.",
    paragraphs: [
      "Once leaders understand the work, they can organize the meetings, reviews, and decision points necessary to keep it moving.",
      "The right operating cadence ensures information reaches the right people, decisions are made at the right time, and teams remain aligned.",
    ],
  },
  {
    label: "Ring Three",
    name: "Terms of Reference",
    tagline: "Make responsibilities and authorities clear.",
    paragraphs: [
      "Who makes the decision? Who needs to participate? Who executes it? Who is accountable for the result?",
      "Clear terms of reference allow organizations to coordinate effectively without requiring every decision to move to the top.",
    ],
  },
];

const eyebrow = "text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-3";

export default function ThreeRings() {
  return (
    <div className="relative pt-40 pb-24 px-6">
      <PageLogo />
      <div className="max-w-5xl mx-auto">
        <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">
          The Three Rings
        </p>
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight max-w-4xl">
          Connecting purpose to the work of an organization.
        </h1>
        <div className="text-white/60 text-lg leading-relaxed mb-16 max-w-2xl space-y-4">
          <p>
            Most organizations can explain what they&rsquo;re trying to accomplish. The greater
            challenge is ensuring that their people, decisions, meetings, and daily activities
            actually support that purpose.
          </p>
          <p>
            I encountered this challenge repeatedly during my Army career. Talented people were
            working hard, often producing excellent results, but not always on the things that
            mattered most.
          </p>
          <p>The Three Rings of Organizational Effectiveness grew out of that experience.</p>
        </div>

        {/* PURPOSE + THE THREE RINGS */}
        <ol className="max-w-3xl mb-20" aria-label="Purpose and the Three Rings">
          <li className="flex flex-col items-center">
            <div className="w-full rounded-2xl border border-[#C9713D] bg-[#C9713D]/15 p-7 md:p-8">
              <p className={eyebrow}>Start with purpose</p>
              <div className="space-y-3 text-white/70 leading-relaxed">
                <p>
                  An organization&rsquo;s purpose should provide direction for its strategy,
                  priorities, and allocation of resources.
                </p>
                <p>
                  But purpose alone is not enough. Leaders need a practical way to connect their
                  intentions with what the organization does every day.
                </p>
                <p className="text-white font-bold">That&rsquo;s where the Three Rings come in.</p>
              </div>
            </div>
            <div className="h-8 w-px bg-[#C9713D]/50" aria-hidden="true" />
          </li>
          {RINGS.map((ring, index) => (
            <li key={ring.name} className="flex flex-col items-center">
              <div className="w-full rounded-2xl border border-white/[0.12] bg-[#141b2c] p-7 md:p-8">
                <p className={eyebrow}>{ring.label}</p>
                <h2 className="text-2xl font-black text-white mb-1">{ring.name}</h2>
                <p className="text-[#E0966A] font-bold mb-4">{ring.tagline}</p>
                <div className="space-y-3 text-white/60 leading-relaxed">
                  {ring.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </div>
              {index < RINGS.length - 1 && (
                <div className="h-8 w-px bg-[#C9713D]/50" aria-hidden="true" />
              )}
            </li>
          ))}
        </ol>

        {/* PUTTING THE RINGS TOGETHER */}
        <div className="mb-16 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-black mb-6">Putting the rings together</h2>
          <blockquote className="border-l-4 border-[#C9713D] pl-6 md:pl-8 py-1 mb-8">
            <p className="text-xl md:text-2xl font-bold text-white leading-relaxed">
              The process map shows how work gets done. The operating cadence establishes how
              leaders coordinate and make decisions. The terms of reference clarify who is
              responsible and what authority they have.
            </p>
          </blockquote>
          <div className="space-y-4 text-white/60 text-lg leading-relaxed">
            <p>Together, they connect an organization&rsquo;s daily activities to its enduring purpose.</p>
            <p>
              The framework is not intended to replace an existing management system. It helps
              leaders understand whether their current processes, meetings, and decision
              structures support what they are trying to achieve.
            </p>
          </div>
          <p className="text-white/45 text-sm mt-8">
            Developed with MAJ Lam Nguyen and published in <em>Military Review</em>, April 2026.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-16">
          <a
            href={ARTICLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:border-white/40 transition-colors"
          >
            Read the published article
          </a>
          <CalendlyButton label="Discuss a Three Rings workshop" />
        </div>

        <PaperDownload />
      </div>
    </div>
  );
}
