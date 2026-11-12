import Image from "next/image";
import Link from "next/link";
import CalendlyButton from "@/components/CalendlyButton";
import { getAllPosts } from "@/lib/posts";
import { SITE_NAME } from "@/lib/site";

// Refresh hourly so story links go live on the day their post is published.
export const revalidate = 3600;

// The homepage headline, kept in one place so it can be swapped in one line.
const HEADLINE = "Helping leaders build strong teams and make complex organizations work.";

const WHERE = [
  {
    title: "Strengthening leaders and leadership teams",
    body: "Helping executives develop their people, build trust, exercise sound judgment, and establish clear responsibilities. This includes coaching senior leaders and those serving as a CEO\u2019s or founder\u2019s second-in-command.",
  },
  {
    title: "Making organizations more effective",
    body: "Understanding how work actually gets done, how decisions are made, and where responsibilities or processes create unnecessary friction. Then helping leaders make practical improvements.",
  },
  {
    title: "Leading through growth and change",
    body: "Helping organizations adapt to new demands, emerging technology, changing priorities, and unexpected challenges while maintaining focus on their people and purpose.",
  },
  {
    title: "Speaking to your team",
    body: "Tailored, focused talks for training events, leader development sessions, board meetings, and team gatherings, on leadership, leading change, solving hard problems, and learning from failure.",
  },
];

// The stories to show first, in this order.
const FEATURED_STORIES = ["not-yet-your-problem", "accurate-but-incomplete", "the-barbecue"];

const eyebrow = "text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-3";
const outlineButton =
  "inline-block text-center border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:border-white/40 transition-colors";

export default function Home() {
  const posts = new Map(getAllPosts().map((post) => [post.slug, post]));
  const featured = FEATURED_STORIES.map((slug) => posts.get(slug)).filter((post) => post !== undefined);

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
            alt="The Summit Initiative"
            width={884}
            height={511}
            className="w-[180px] md:w-[230px] object-contain mb-8 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
            priority
          />
          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-8 max-w-4xl">
            {HEADLINE}
          </h1>
          <div className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed mb-10 space-y-4">
            <p>
              I&rsquo;m David Doyle. For 33 years, I served in the U.S. Army, leading organizations
              ranging from small teams to an 18,000-person Army Division and serving as Chief of
              Staff of U.S. Central Command.
            </p>
            <p>
              Along the way, I learned a great deal about people, leadership, and the challenges of
              turning good ideas into results. Some of those lessons came from success. Others came
              from mistakes, difficult decisions, and people who helped me see things differently.
            </p>
            <p>
              Today, I work with business owners, executives, and leadership teams who want to
              strengthen their organizations and accomplish important goals. I also speak to teams
              at training events, leader development sessions, and board meetings.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <CalendlyButton label="Let’s talk" />
            <Link href="/services" className={outlineButton}>
              How I can help
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#C9713D]/40 to-transparent" />
      </div>

      {/* WHERE I CAN HELP */}
      <section className="py-24 px-6 bg-[#0f1524]">
        <div className="max-w-6xl mx-auto">
          <p className={eyebrow}>Where I can help</p>
          <h2 className="text-3xl md:text-4xl font-black mb-12">Practical help with hard leadership work.</h2>
          <div className="grid md:grid-cols-2 gap-6 mb-10">
            {WHERE.map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8">
                <h3 className="text-xl font-bold text-[#E0966A] mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
          <Link href="/services" className={outlineButton}>
            Explore how I help
          </Link>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <p className={eyebrow}>Experience</p>
          <h2 className="text-3xl md:text-4xl font-black mb-8">Experience that shapes my perspective.</h2>
          <div className="space-y-5 text-white/65 text-lg leading-relaxed">
            <p>
              At the Joint Readiness Training Center, I led a team that coached 12 different
              organizations in 13 months. Each brought talented people and capable leaders. Our job
              was to help them see where their organization was working well, where it was
              struggling, and what they could do differently.
            </p>
            <p>
              As a Chief of Staff, I learned the importance of turning a senior leader&rsquo;s
              vision into an organization that could make decisions, coordinate its efforts, and
              execute.
            </p>
            <p>
              And as a commanding general, I learned that the most important responsibility of a
              leader is not simply to direct an organization, but to develop the people who will
              lead it next.
            </p>
            <p className="text-white font-bold">Those experiences shape how I work today.</p>
          </div>
        </div>
      </section>

      {/* APPROACH */}
      <section className="py-24 px-6 bg-[#0f1524]">
        <div className="max-w-3xl mx-auto">
          <p className={eyebrow}>How I approach the work</p>
          <h2 className="text-3xl md:text-4xl font-black mb-8">I start by listening.</h2>
          <div className="space-y-5 text-white/65 text-lg leading-relaxed">
            <p>
              Every organization has its own people, history, strengths, and challenges. Before
              offering recommendations, I want to understand what its leaders are trying to
              accomplish and how the organization really works.
            </p>
            <p>
              I bring an outside perspective, experience leading through demanding circumstances,
              and a willingness to ask questions that might otherwise go unasked.
            </p>
            <p>
              The objective is straightforward: help leaders make better decisions, strengthen
              their teams, and leave the organization better than we found it.
            </p>
          </div>
        </div>
      </section>

      {/* IDEAS AND EXPERIENCE */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className={eyebrow}>Ideas and experience you can use</p>
          <h2 className="text-3xl md:text-4xl font-black mb-12">Start here.</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8 flex flex-col">
              <h3 className="text-2xl font-black mb-3">The Three Rings of Organizational Effectiveness</h3>
              <p className="text-white/60 leading-relaxed mb-3">
                A practical approach to connecting an organization&rsquo;s purpose to its daily
                activities, decisions, and responsibilities.
              </p>
              <p className="text-white/45 leading-relaxed mb-8 flex-1">
                Developed through years of leading complex organizations and published in{" "}
                <em>Military Review</em>.
              </p>
              <Link href="/three-rings" className={`${outlineButton} self-start`}>
                Explore the Three Rings
              </Link>
            </div>
            <div className="rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8 flex flex-col">
              <h3 className="text-2xl font-black mb-3">Stories from 33 years of leading</h3>
              <p className="text-white/60 leading-relaxed mb-6">
                Some of my most useful leadership lessons came from unexpected places: a barbecue, a
                candy dispenser in the Pentagon, a dry-erase board, and the people willing to tell
                me things I needed to hear.
              </p>
              {featured.length > 0 && (
                <ul className="mb-8 flex-1 divide-y divide-white/10 border-y border-white/10">
                  {featured.map((post) => (
                    <li key={post.slug}>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="flex items-center justify-between gap-4 py-3 text-white hover:text-[#E0966A] transition-colors font-bold"
                      >
                        {post.title}
                        <span aria-hidden="true">&rarr;</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
              <Link href="/blog" className={`${outlineButton} self-start`}>
                Read the stories
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/*
        EXAMPLES FROM ORGANIZATIONS I'VE LED: hidden until David has verified each figure and
        how it should be attributed (team result, his direction, or his influence). The figures
        are in RESULTS in lib/brand.ts; render them here under that heading once cleared.
      */}

      {/* CLOSING */}
      <section className="py-24 px-6 bg-[#0f1524] text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black mb-6">Let&rsquo;s have a conversation.</h2>
          <p className="text-white/60 text-lg leading-relaxed mb-10">
            If you&rsquo;re working through a difficult leadership challenge, trying to make your
            organization more effective, or looking for a speaker for your next leadership event,
            I&rsquo;d welcome the conversation.
          </p>
          <CalendlyButton />
          <p className="text-white/40 italic mt-10">
            {SITE_NAME} &mdash; Leave it better than you found it.
          </p>
        </div>
      </section>
    </div>
  );
}
