import Image from "next/image";
import Link from "next/link";

const PILLARS = [
  {
    title: "People",
    body: "Align teams around clear roles, accountability, and communication so execution doesn't stall on friction.",
  },
  {
    title: "Process",
    body: "Remove the bottlenecks that quietly cost time and money, and replace them with repeatable, measurable workflows.",
  },
  {
    title: "Systems",
    body: "Make sure the tools and infrastructure an organization runs on actually support the strategy, not fight it.",
  },
];

export default function Home() {
  return (
    <div className="pt-20">
      {/* HERO */}
      <section className="pt-8 pb-28 px-6 flex flex-col items-center text-center relative overflow-hidden">
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src="/mount-princeton.mp4"
          poster="/mount-princeton-poster.jpg"
          autoPlay
          muted
          loop
          playsInline
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,14,23,0.55) 0%, rgba(10,14,23,0.75) 45%, #0a0e17 100%)",
          }}
        />
        <div
          className="absolute top-10 left-1/2 -translate-x-1/2 pointer-events-none"
          style={{
            width: 700,
            height: 700,
            background: "radial-gradient(ellipse at center, rgba(201,113,61,0.18) 0%, transparent 65%)",
          }}
        />

        <div className="relative z-10 flex flex-col items-center">
          <Image
            src="/logo-full.png"
            alt="Summit Initiative Solutions"
            width={884}
            height={511}
            className="w-[200px] md:w-[260px] object-contain mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
            priority
          />
          <h1 className="text-4xl md:text-6xl font-black leading-tight tracking-tight mb-8 max-w-3xl">
            Optimize your people, processes, and systems.
          </h1>
          <p className="text-white/65 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            We help businesses, government agencies, and non-profits improve productivity and
            effectiveness &mdash; backed by a proven track record of leading large and complex
            organizations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/contact"
              className="bg-[#C9713D] text-white px-7 py-3 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors"
            >
              Schedule a Call
            </Link>
            <Link
              href="/services"
              className="border border-white/20 text-white px-7 py-3 rounded-xl font-bold text-sm hover:border-white/40 transition-colors"
            >
              View Services
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#C9713D]/40 to-transparent" />
      </div>

      {/* PILLARS */}
      <section className="py-24 px-6 bg-[#0f1524]">
        <div className="max-w-6xl mx-auto">
          <div className="mb-14">
            <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-3">
              How We Help
            </p>
            <h2 className="text-3xl md:text-4xl font-black">
              Three levers for higher returns.
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8 hover:border-[#C9713D]/50 transition-colors"
              >
                <h3 className="text-xl font-bold text-[#E0966A] mb-3">{pillar.title}</h3>
                <p className="text-white/60 leading-relaxed">{pillar.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRACK RECORD / CTA */}
      <section className="py-24 px-6 bg-[#0a0e17]">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-4">
            Why Summit Initiative Solutions
          </p>
          <h2 className="text-3xl md:text-4xl font-black mb-6">
            A proven track record leading complex organizations.
          </h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            Unlike a typical consulting agency, engagements are led directly by Major General
            (Ret.) David S. Doyle, U.S. Army &mdash; who spent three decades leading organizations
            of up to 18,000 people, including as Chief of Staff of U.S. Central Command &mdash;
            not just studying them from the outside.
          </p>

          <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-12 max-w-2xl mx-auto">
            {[
              { value: "30+", label: "Years of leadership experience" },
              { value: "18,000", label: "Personnel led at peak" },
              { value: "3", label: "General officer commands" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-white/[0.1] bg-[#141b2c] p-5"
              >
                <p className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-white/50 text-xs leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/about"
              className="border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:border-white/40 transition-colors inline-block"
            >
              Meet David
            </Link>
            <Link
              href="/contact"
              className="bg-[#C9713D] text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:bg-[#b8632f] transition-colors inline-block"
            >
              Contact Me to Schedule a Call
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
