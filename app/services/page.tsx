import type { Metadata } from "next";
import Link from "next/link";
import Beliefs from "@/components/Beliefs";
import CalendlyButton from "@/components/CalendlyButton";
import PageLogo from "@/components/PageLogo";
import { SITE_NAME } from "@/lib/site";

export const metadata: Metadata = {
  title: `How I Help | ${SITE_NAME}`,
  description:
    "Executive coaching, organizational effectiveness, leader and team development, leading through change, and tailored keynote talks from David S. Doyle.",
};

const SERVICES: { title: string; paragraphs: string[]; link?: { href: string; label: string } }[] = [
  {
    title: "Executive Leadership and Coaching",
    paragraphs: [
      "I work with senior executives, Chiefs of Staff, COOs, and other leaders responsible for turning vision into action.",
      "This can include individual coaching, strengthening the working relationship between a CEO and second-in-command, or helping a leader prepare for a significant new responsibility.",
      "I’ve spent years in both seats: supporting senior leaders as a Chief of Staff and serving as the leader ultimately accountable for the organization.",
    ],
  },
  {
    title: "Organizational Effectiveness",
    paragraphs: [
      "Strong organizations need more than talented people and a clear strategy.",
      "I help leaders examine how work moves through their organization, whether their meetings support decisions, and whether responsibilities and authorities are clear.",
      "My Three Rings framework provides a practical way to connect organizational purpose with daily execution. It can complement the operating system or management approach a business already uses.",
    ],
    link: { href: "/three-rings", label: "See the Three Rings" },
  },
  {
    title: "Leader and Team Development",
    paragraphs: [
      "I design and facilitate leadership discussions, working sessions, and development experiences grounded in actual leadership challenges.",
      "These can include executive team workshops, practical case studies, and shadow programs that allow developing leaders to observe how senior leaders think, communicate, and make decisions.",
    ],
  },
  {
    title: "Leading Through Change and Complexity",
    paragraphs: [
      "Growth, transitions, crises, and new technologies can place unexpected demands on an organization.",
      "I work with leaders to assess those demands, establish priorities, organize their teams, and adapt their approach as circumstances change.",
    ],
  },
  {
    title: "Keynotes and Speaking",
    paragraphs: [
      "I speak at training events, leader development programs, board meetings, and team gatherings. Each talk is tailored to the audience and focused on what the team needs to hear.",
      "Topics include leadership, leading change, solving hard problems, and learning and leading through failure, told through the stories behind the lessons.",
    ],
  },
];

const ENGAGEMENTS = [
  {
    title: "The first 90 days",
    body: "An outside read for a new senior leader: what’s strong, what’s at risk, what to do first.",
  },
  {
    title: "A 48-hour shadow program",
    body: "So the next layer of leaders sees how decisions really get made.",
  },
  {
    title: "A 60–90 minute session",
    body: "A story-driven segment inside a leadership offsite, quarterly planning meeting, or annual retreat.",
  },
  {
    title: "A Three Rings workshop",
    body: "Mapping how work flows, when leaders decide, and who holds the authority to act.",
  },
];

export default function Services() {
  return (
    <div className="relative pt-40 pb-24 px-6">
      <PageLogo />
      <div className="max-w-5xl mx-auto">
        <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">How I help</p>
        <h1 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
          Experienced perspective. Practical help.
        </h1>
        <div className="text-white/60 text-lg leading-relaxed mb-14 max-w-2xl space-y-4">
          <p>
            I&rsquo;ve worked with organizations of very different sizes, missions, and
            capabilities. I&rsquo;ve learned that no two leadership challenges are exactly alike.
          </p>
          <p>
            I don&rsquo;t begin with a predetermined solution. I begin by understanding the people,
            the organization, and what its leaders need to accomplish.
          </p>
          <p>Here are several ways we might work together.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-20">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8 hover:border-[#C9713D]/50 transition-colors"
            >
              <h2 className="text-xl font-bold text-[#E0966A] mb-3">{service.title}</h2>
              <div className="space-y-3 text-white/60 leading-relaxed">
                {service.paragraphs.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
              {service.link && (
                <Link
                  href={service.link.href}
                  className="inline-block mt-4 text-[#E0966A] text-sm font-bold hover:text-white transition-colors"
                >
                  {service.link.label} &rarr;
                </Link>
              )}
            </div>
          ))}
        </div>

        {/* EXAMPLES OF ENGAGEMENTS */}
        <div className="mb-20">
          <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-3">
            Examples of engagements
          </p>
          <h2 className="text-2xl md:text-3xl font-black mb-8">A few specific ways to start.</h2>
          <ul className="grid sm:grid-cols-2 gap-x-10 gap-y-6">
            {ENGAGEMENTS.map((item) => (
              <li key={item.title} className="border-l-2 border-[#C9713D]/50 pl-5 py-1">
                <h3 className="text-base font-bold text-white mb-1">{item.title}</h3>
                <p className="text-white/55 leading-relaxed text-[15px]">{item.body}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* HOW WE BEGIN */}
        <div className="mb-16 max-w-2xl">
          <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-3">
            How we begin
          </p>
          <h2 className="text-2xl md:text-3xl font-black mb-6">A conversation.</h2>
          <div className="space-y-4 text-white/60 text-lg leading-relaxed mb-10">
            <p>
              We discuss what you&rsquo;re trying to accomplish, what challenges you&rsquo;re
              facing, and whether my experience might be useful.
            </p>
            <p>
              If there&rsquo;s a good fit, we agree on a practical scope of work, the outcomes you
              want, and how we&rsquo;ll know whether we&rsquo;re making progress.
            </p>
          </div>
          <CalendlyButton label="Let’s talk" />
        </div>

        <div className="max-w-2xl">
          <Beliefs />
        </div>
      </div>
    </div>
  );
}
