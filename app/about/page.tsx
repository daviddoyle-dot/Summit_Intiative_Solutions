import type { Metadata } from "next";
import Image from "next/image";
import Beliefs from "@/components/Beliefs";
import CalendlyButton from "@/components/CalendlyButton";
import PageLogo from "@/components/PageLogo";
import { WRITING } from "@/lib/brand";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: `About | ${SITE_NAME}`,
  description:
    "David S. Doyle: 33 years of leading people through hard problems, from small teams to an 18,000-person division. Founder of The Summit Initiative.",
};

const STATS = [
  { value: "33", label: "Years of service" },
  { value: "88", label: "Months in combat" },
  { value: "18,000", label: "People led" },
];

const PERSON_JSON_LD = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "David S. Doyle",
  honorificPrefix: "Major General (Ret.)",
  jobTitle: "Founder",
  worksFor: {
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
  },
  url: `${SITE_URL}/about`,
  image: `${SITE_URL}/david-doyle.jpg`,
  sameAs: ["https://www.linkedin.com/in/mg-david-doyle/"],
  alumniOf: [
    { "@type": "CollegeOrUniversity", name: "United States Military Academy" },
    { "@type": "CollegeOrUniversity", name: "School of Advanced Military Studies" },
    { "@type": "CollegeOrUniversity", name: "National War College" },
  ],
};

export default function About() {
  return (
    <div className="relative pt-40 pb-24 px-6">
      <PageLogo />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(PERSON_JSON_LD) }}
      />
      <div className="max-w-5xl mx-auto">
        <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">About</p>
        <h1 className="text-4xl md:text-5xl font-black mb-14 leading-tight max-w-3xl">
          Thirty-three years of walking into hard problems.
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
            <p className="text-[#E0966A] font-bold mb-6">Founder, {SITE_NAME}</p>
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

        {/* BIO + WHAT I BELIEVE, divided */}
        <div className="grid md:grid-cols-2 gap-12 md:gap-0 relative mb-16">
          <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-px bg-white/10" />

          <div className="space-y-6 text-white/65 text-lg leading-relaxed md:pr-12">
            <p>
              I spent 33 years as an Army officer. I led Rangers in Afghanistan and Iraq. I took a
              paratrooper battalion into Haiti days after the 2010 earthquake. I coached a new
              organization every month at the Joint Readiness Training Center, served as Chief of
              Staff of U.S. Central Command, and commanded the 18,000 soldiers of the 4th Infantry
              Division, including U.S. and NATO forces across six countries.
            </p>
            <p>
              Along the way I learned that most organizations don&rsquo;t fail for lack of talent
              or strategy. They fail because the leader can&rsquo;t see what&rsquo;s really
              happening, and the goal never becomes real to the people who have to hit it.
            </p>
            <p>
              I also got things wrong. The worst one involved a barbecue. Every mistake taught me
              the same thing: go see for yourself, and build more than one path to the truth.
            </p>
            <p>
              When I retired, a sitting company CEO mentored me through the move into business.
              Today, through {SITE_NAME}, I work with business owners, executives, and leadership
              teams who want to strengthen their organizations, and I speak to teams at training
              events, leader development sessions, and board meetings.
            </p>
            <p>
              I&rsquo;m a graduate of West Point (B.S., Military History) and hold master&rsquo;s
              degrees from the School of Advanced Military Studies and the National War College,
              where I was a Distinguished Graduate.
            </p>
          </div>

          <div className="md:pl-12">
            <Beliefs />
          </div>
        </div>

        {/* WRITING */}
        <div className="mb-16">
          <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-6">Writing</p>
          <ul className="divide-y divide-white/10 border-y border-white/10">
            {WRITING.map((piece) => (
              <li key={piece.url} className="py-5 flex flex-col sm:flex-row gap-1 sm:gap-6">
                <span className="text-white/40 font-bold shrink-0 w-14">{piece.year}</span>
                <span className="text-white/75 leading-relaxed">
                  <a
                    href={piece.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white font-bold hover:text-[#E0966A] transition-colors"
                  >
                    &ldquo;{piece.title}&rdquo;
                  </a>
                  , <em>Military Review</em>
                  {piece.note && ` (${piece.note})`}
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/*
          TESTIMONIAL (waiting on Joe McCormack's quote). Uncomment and fill in once it arrives;
          never use placeholder words here.

        <figure className="mb-16 rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8 md:p-10">
          <blockquote className="text-xl md:text-2xl text-white leading-relaxed">
            &ldquo;QUOTE&rdquo;
          </blockquote>
          <figcaption className="mt-5 text-white/50">Joe McCormack, author</figcaption>
        </figure>
        */}

        <CalendlyButton />
      </div>
    </div>
  );
}
