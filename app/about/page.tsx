import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Summit Initiative Solutions",
  description:
    "Major General (Ret.) David S. Doyle, U.S. Army — Founder & Principal of Summit Initiative Solutions, bringing three decades of experience leading large, complex organizations.",
};

const STATS = [
  { value: "30+", label: "Years leading mission-critical organizations" },
  { value: "18,000", label: "Personnel led, 4th Infantry Division" },
  { value: "3", label: "General officer commands held" },
];

// Permission to name a client publicly must be confirmed before this list
// goes live. Do not merge/deploy to production until every entry below is
// cleared — as of this writing, "The Brooks Group" and "Leidos" are still
// pending permission.
const CLIENTS = ["Flowserve", "Veriten", "The Brooks Group", "Helix Earth", "Leidos"];

const PILLARS = [
  {
    title: "Invest in People",
    body: "Build deep talent benches and performance cultures that advance leaders into greater responsibility.",
  },
  {
    title: "Accomplish the Mission",
    body: "Translate strategy into disciplined execution, aligning diverse stakeholders around a shared purpose.",
  },
  {
    title: "Responsible Stewardship",
    body: "Treat the people, resources, and trust entrusted to an organization as things to be strengthened, not spent.",
  },
  {
    title: "Learning & Innovation",
    body: "Create organizations where initiative, creativity, and continuous learning are allowed to flourish.",
  },
];

export default function About() {
  return (
    <div className="pt-40 pb-24 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">About</p>
        <h1 className="text-4xl md:text-5xl font-black mb-14 leading-tight max-w-3xl">
          Optimization backed by three decades of leading complex organizations.
        </h1>

        {/* PROFILE HEADER */}
        <div className="grid md:grid-cols-[280px_1fr] gap-10 md:gap-14 mb-14 items-start">
          <div className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-3 shadow-[0_0_40px_rgba(0,0,0,0.35)]">
            <div className="rounded-xl overflow-hidden bg-white">
              <Image
                src="/david-doyle.jpg"
                alt="Major General (Ret.) David S. Doyle"
                width={960}
                height={1200}
                className="w-full h-auto object-cover"
                priority
              />
            </div>
          </div>

          <div>
            <h2 className="text-2xl md:text-3xl font-black mb-1">
              Major General (Ret.) David S. Doyle
            </h2>
            <p className="text-[#E0966A] font-bold mb-6">
              Founder &amp; Principal, Summit Initiative Solutions
            </p>
            <div className="grid grid-cols-3 gap-4 mb-2">
              {STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl border border-white/[0.1] bg-[#141b2c] p-4"
                >
                  <p className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</p>
                  <p className="text-white/50 text-xs leading-snug">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* BIO + LEADERSHIP PHILOSOPHY, divided */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-0 relative mb-16">
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/10" />

          {/* BIO */}
          <div className="space-y-6 text-white/65 text-lg leading-relaxed md:pr-12">
            <p>
              David S. Doyle is the Founder and Principal of Summit Initiative Solutions. A
              retired U.S. Army Major General, he brings more than three decades of experience
              leading people and organizations through complex change, high-stakes operations,
              and periods of significant uncertainty.
            </p>
            <p>
              During his Army career, David led organizations ranging from small combat teams to
              the Army&rsquo;s 18,000-person 4th Infantry Division at Fort Carson, Colorado, and
              served as Chief of Staff of U.S. Central Command, one of the Department of
              Defense&rsquo;s most complex strategic headquarters. His experience spans
              conventional and special operations, multinational and interagency coordination,
              crisis response, organizational transformation, executive decision-making, and the
              integration of emerging technology and data into large organizations.
            </p>
            <p>
              David previously served as Commanding General of the Joint Readiness Training
              Center and Fort Polk, Deputy Commanding General of the 82nd Airborne Division, and
              Director of Operations for Combined Joint Task Force&ndash;Operation Inherent
              Resolve. His career included extensive service in Europe, the Middle East, and
              Central Asia, as well as humanitarian and disaster-response operations, including
              the 2010 Haiti earthquake response.
            </p>
            <p>
              Across these assignments, David developed a reputation for making sense of complex
              environments, building strong teams, aligning diverse stakeholders, and translating
              strategy into disciplined execution. He is particularly effective at bringing
              people together around a shared purpose and organizing talent, processes,
              information, and resources to solve difficult problems.
            </p>
            <p>
              David is a graduate of the United States Military Academy and holds master&rsquo;s
              degrees from the School of Advanced Military Studies and the National War College,
              where he was a Distinguished Graduate.
            </p>
            <p>
              Through Summit Initiative Solutions, David advises senior leaders and organizations
              on strategy, organizational effectiveness, executive leadership, decision-making,
              transformation, and leader development.
            </p>
          </div>

          {/* LEADERSHIP PHILOSOPHY */}
          <div className="md:pl-12">
            <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-3">
              Leadership Philosophy
            </p>
            <h3 className="text-2xl md:text-3xl font-black mb-8">
              Four principles that anchor every engagement.
            </h3>
            <div className="space-y-6 mb-12">
              {PILLARS.map((pillar) => (
                <div key={pillar.title} className="border-l-2 border-[#C9713D]/50 pl-5 py-1">
                  <h4 className="text-base font-bold text-white mb-1.5">{pillar.title}</h4>
                  <p className="text-white/55 leading-relaxed text-[15px]">{pillar.body}</p>
                </div>
              ))}
            </div>

            {/* SELECTED CLIENTS */}
            <div>
              <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">
                Selected Clients
              </p>
              <div className="flex flex-wrap gap-3">
                {CLIENTS.map((client) => (
                  <span
                    key={client}
                    className="rounded-xl border border-white/[0.1] bg-[#141b2c] px-4 py-2.5 text-white/70 font-bold text-sm"
                  >
                    {client}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <Link
          href="/contact"
          className="inline-block bg-[#C9713D] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors"
        >
          Schedule a Call
        </Link>
      </div>
    </div>
  );
}
