import Image from "next/image";
import Link from "next/link";
import CalendlyButton from "@/components/CalendlyButton";
import PaperDownload from "@/components/PaperDownload";
import { CLIENTS, RESULTS } from "@/lib/brand";
import { getAllPosts } from "@/lib/posts";
import { formatPostDate } from "@/lib/post-format";

// Refresh hourly so story links go live on the day their post is published.
export const revalidate = 3600;

// The homepage headline. Runner-up, if David prefers it:
// "You help leadership teams get traction. I've led them through change that didn't wait for anyone to be ready."
const HEADLINE =
  "You help leadership teams get traction. I’ve led them inside one of the most complex organizations on earth.";

const STORIES = [
  {
    slug: "the-barbecue",
    opening: "I learned my most important leadership lesson at a barbecue.",
  },
  {
    slug: "the-jelly-belly-dispenser",
    opening: "I spent $60 a week on Jelly Bellies in the Pentagon basement.",
  },
  {
    slug: "accurate-but-incomplete",
    opening: "The dashboard told me something was wrong. It couldn’t tell me why.",
  },
];

const WHY = [
  {
    title: "I coached the coaches.",
    body: "At the Joint Readiness Training Center I led a hand-picked team of coaches who took on a new organization every month: 12 in 13 months. Our job was helping leaders see the friction they had stopped noticing. Sound familiar?",
  },
  {
    title: "I’ve sat in the second chair.",
    body: "I was Chief of Staff twice, at 4,500 and 15,000 people: the leader who turns the boss’s vision into the daily work. Your clients’ second-in-command is in that seat right now.",
  },
  {
    title: "I speak business.",
    body: "When I left the Army, a sitting company CEO mentored me through the move. I work with entrepreneurs in their language, not mine.",
  },
];

const PROOF = [
  { value: "33", label: "Years of service" },
  { value: "12", label: "Leadership teams coached in 13 months" },
  { value: "18,000", label: "People led" },
  { value: "46", label: "Nations in one portfolio" },
];

const eyebrow = "text-[#C9713D] text-xs font-bold uppercase tracking-[0.25em] mb-3";

export default function Home() {
  const posts = new Map(getAllPosts().map((post) => [post.slug, post]));
  const barbecue = posts.get("the-barbecue");

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
            className="w-[180px] md:w-[230px] object-contain mb-6 drop-shadow-[0_4px_24px_rgba(0,0,0,0.6)]"
            priority
          />
          <p className="text-[#E0966A] text-xs font-bold uppercase tracking-[0.25em] mb-5">
            Major General (Ret.) David S. Doyle
          </p>
          <h1 className="text-3xl md:text-5xl font-black leading-tight tracking-tight mb-8 max-w-4xl">
            {HEADLINE}
          </h1>
          <p className="text-white/70 text-lg md:text-xl max-w-2xl leading-relaxed mb-10">
            I&rsquo;m David Doyle. For 33 years I led people through the kind of change most
            organizations only plan for: shifting priorities, competing bosses, budgets that moved
            overnight, and teams of up to 18,000. I learned the most from what I got wrong, and
            I&rsquo;m still learning. Now I help the coaches who help entrepreneurs get traction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <CalendlyButton />
            <Link
              href={barbecue ? "/blog/the-barbecue" : "/blog"}
              className="border border-white/20 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:border-white/40 transition-colors"
            >
              {barbecue ? "Read the barbecue story" : "Read the stories"}
            </Link>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6">
        <div className="h-px bg-gradient-to-r from-transparent via-[#C9713D]/40 to-transparent" />
      </div>

      {/* STORIES */}
      <section className="py-24 px-6 bg-[#0f1524]">
        <div className="max-w-6xl mx-auto">
          <p className={eyebrow}>Stories</p>
          <h2 className="text-3xl md:text-4xl font-black mb-12">The lessons that cost me the most.</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {STORIES.map((story) => {
              const post = posts.get(story.slug);
              const inner = (
                <>
                  <p className="text-xl md:text-2xl font-black text-white leading-snug mb-8 flex-1">
                    &ldquo;{story.opening}&rdquo;
                  </p>
                  <span className="text-[#E0966A] text-sm font-bold">
                    {post ? "Read what happened \u2192" : "Coming soon"}
                  </span>
                </>
              );
              const cardClass =
                "rounded-2xl border border-white/[0.1] bg-[#141b2c] p-8 flex flex-col transition-colors";
              return post ? (
                <Link
                  key={story.slug}
                  href={`/blog/${story.slug}`}
                  className={`${cardClass} hover:border-[#C9713D]/50`}
                  aria-label={`${post.title}, ${formatPostDate(post.date)}`}
                >
                  {inner}
                </Link>
              ) : (
                <div key={story.slug} className={cardClass}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WHY COACHES CALL ME */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className={eyebrow}>Why coaches call me</p>
          <h2 className="text-3xl md:text-4xl font-black mb-12">I&rsquo;ve done your job, and your client&rsquo;s.</h2>
          <div className="grid md:grid-cols-3 gap-10">
            {WHY.map((item) => (
              <div key={item.title} className="border-l-2 border-[#C9713D]/50 pl-6">
                <h3 className="text-xl font-bold text-[#E0966A] mb-3">{item.title}</h3>
                <p className="text-white/60 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROOF */}
      <section className="py-16 px-6 bg-[#0f1524]">
        <div className="max-w-5xl mx-auto text-center">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {PROOF.map((stat) => (
              <div key={stat.label} className="rounded-xl border border-white/[0.1] bg-[#141b2c] p-5">
                <p className="text-3xl md:text-4xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-white/50 text-xs leading-snug">{stat.label}</p>
              </div>
            ))}
          </div>
          <p className="text-white/50">Trusted by {CLIENTS.join(" and ")}.</p>
        </div>
      </section>

      {/* RESULTS */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <p className={eyebrow}>Results</p>
          <h2 className="text-3xl md:text-4xl font-black mb-12">What it looked like when it worked.</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESULTS.map((result) => (
              <div key={result} className="rounded-xl border border-white/[0.1] bg-[#141b2c] p-6 text-white/75 leading-relaxed">
                {result}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FREE PAPER */}
      <section className="pb-24 px-6">
        <div className="max-w-6xl mx-auto">
          <PaperDownload />
        </div>
      </section>

      {/* CLOSING */}
      <section className="py-24 px-6 bg-[#0f1524] text-center">
        <p className="text-3xl md:text-5xl font-black mb-10 max-w-3xl mx-auto leading-tight">
          Leave it better than you found it.
        </p>
        <CalendlyButton />
      </section>
    </div>
  );
}
