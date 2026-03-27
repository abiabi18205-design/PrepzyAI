import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About",
  description: "Learn about MockPilotAI — our mission, team, and the story behind the platform.",
};

// ─── Data ────────────────────────────────────────────────────────────────────

const values = [
  {
    icon: "🎯",
    title: "Radical Honesty",
    desc: "We give you the unfiltered truth about your performance — because sugar-coating doesn't help you improve.",
  },
  {
    icon: "⚡",
    title: "Speed of Learning",
    desc: "Compressed, high-quality reps beat slow, passive learning every time. We're built for fast progress.",
  },
  {
    icon: "🌍",
    title: "Democratizing Access",
    desc: "Top interview coaching used to cost thousands. We believe everyone deserves great preparation.",
  },
  {
    icon: "🔬",
    title: "Evidence-Driven",
    desc: "Every feature is backed by cognitive science and real interview data — not guesswork.",
  },
];

const team = [
  {
    name: "Aria Chen",
    role: "CEO & Co-founder",
    initials: "AC",
    from: "rgba(110,231,183,0.2)",
    to: "rgba(20,100,80,0.2)",
  },
  {
    name: "Marcus Webb",
    role: "CTO & Co-founder",
    initials: "MW",
    from: "rgba(167,139,250,0.2)",
    to: "rgba(30,60,140,0.2)",
  },
  {
    name: "Priya Nair",
    role: "Head of AI Research",
    initials: "PN",
    from: "rgba(251,146,60,0.2)",
    to: "rgba(180,50,50,0.2)",
  },
  {
    name: "Liam Torres",
    role: "Head of Product",
    initials: "LT",
    from: "rgba(96,165,250,0.2)",
    to: "rgba(60,40,160,0.2)",
  },
];

const milestones = [
  {
    year: "2023",
    event:
      "MockPilotAI founded after two ex-Google engineers struggled to find quality mock interview tools.",
  },
  {
    year: "Early 2024",
    event:
      "Launched private beta with 500 users. Achieved 91% satisfaction score in first cohort.",
  },
  {
    year: "Mid 2024",
    event:
      "Raised $2.4M seed round. Expanded question bank to 10,000+ questions across 200 roles.",
  },
  {
    year: "2025",
    event:
      "Released voice interview feature and company-specific prep modules for 500+ employers.",
  },
  {
    year: "2026",
    event:
      "Now serving 50,000+ users worldwide. Expanding into enterprise hiring enablement.",
  },
];

const miniStats = [
  { value: "2023", label: "Founded" },
  { value: "24", label: "Team Size" },
  { value: "38", label: "Countries" },
  { value: "50K+", label: "Users Helped" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-28">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <span className="text-accent text-xs font-mono uppercase tracking-widest">
            About Us
          </span>
          <h1 className="font-heading text-6xl font-extrabold text-light mt-3 mb-6 leading-tight">
            We&apos;re on a mission to
            <br />
            <span className="text-gradient">level the playing field</span>
          </h1>
          <p className="text-muted text-xl font-body font-light leading-relaxed max-w-2xl">
            Hundreds of thousands of talented people miss out on their dream jobs every year
            — not because they lack ability, but because they didn&apos;t prepare the right
            way. MockPilotAI is changing that.
          </p>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-accent text-xs font-mono uppercase tracking-widest">
              Our Story
            </span>
            <h2 className="font-heading text-3xl font-extrabold text-light mt-3 mb-5">
              Born from frustration,
              <br />
              built with purpose
            </h2>
            <div className="space-y-4 text-muted font-body leading-relaxed">
              <p>
                In 2023, two engineers at Google noticed a pattern: smart, capable candidates
                were bombing interviews — not because they lacked skill, but because they
                hadn&apos;t practiced the right way.
              </p>
              <p>
                Traditional mock interviews were expensive, hard to schedule, and
                inconsistent. There was no tool that combined the realism of a live interview
                with data-driven coaching.
              </p>
              <p>
                So they built one. MockPilotAI uses large language models, speech analysis,
                and behavioral science to give every candidate access to elite-level
                preparation — on their own schedule.
              </p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {miniStats.map((s) => (
              <div
                key={s.label}
                className="p-6 rounded-2xl border border-border bg-card text-center"
              >
                <div className="font-heading text-3xl font-extrabold text-gradient mb-1">
                  {s.value}
                </div>
                <div className="text-muted text-xs font-mono">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-card/20 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-accent text-xs font-mono uppercase tracking-widest">
              What We Stand For
            </span>
            <h2 className="font-heading text-4xl font-extrabold text-light mt-3">
              Our Core Values
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {values.map((v) => (
              <div
                key={v.title}
                className="p-6 rounded-2xl border border-border bg-card card-hover"
              >
                <div className="text-3xl mb-4">{v.icon}</div>
                <h3 className="font-heading font-bold text-light mb-2">{v.title}</h3>
                <p className="text-muted text-sm font-body leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-accent text-xs font-mono uppercase tracking-widest">
              The People
            </span>
            <h2 className="font-heading text-4xl font-extrabold text-light mt-3">
              Meet the Team
            </h2>
            <p className="text-muted mt-3 font-body max-w-md mx-auto">
              A small, focused crew of engineers, researchers, and product obsessives.
            </p>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {team.map((m) => (
              <div
                key={m.name}
                className="p-6 rounded-2xl border border-border bg-card text-center hover:border-accent/20 transition-all"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10"
                  style={{
                    background: `linear-gradient(135deg, ${m.from}, ${m.to})`,
                  }}
                >
                  <span className="font-heading font-bold text-light text-sm">
                    {m.initials}
                  </span>
                </div>
                <h3 className="font-heading font-bold text-light text-sm">{m.name}</h3>
                <p className="text-muted text-xs font-mono mt-1">{m.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-card/20 border-y border-border">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-14">
            <span className="text-accent text-xs font-mono uppercase tracking-widest">
              Journey
            </span>
            <h2 className="font-heading text-4xl font-extrabold text-light mt-3">
              Our Milestones
            </h2>
          </div>
          <div className="relative pl-6 border-l border-border space-y-6">
            {milestones.map((m) => (
              <div key={m.year} className="relative">
                <div className="absolute -left-[25px] top-4 w-3 h-3 rounded-full bg-accent border-2 border-ink" />
                <div className="p-5 rounded-2xl border border-border bg-card">
                  <span className="text-accent text-xs font-mono">{m.year}</span>
                  <p className="text-light text-sm font-body mt-1 leading-relaxed">
                    {m.event}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="font-heading text-4xl font-extrabold text-light mb-4">
            Join us on the mission
          </h2>
          <p className="text-muted font-body mb-8">
            Whether you&apos;re a job seeker or a company wanting smarter hiring prep —
            we&apos;d love to hear from you.
          </p>
          <div className="flex gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-4 rounded-2xl bg-accent text-ink font-heading font-bold hover:bg-accent/90 transition-all"
              style={{ boxShadow: "0 0 32px rgba(110,231,183,0.15)" }}
            >
              Get in Touch
            </Link>
            <Link
              href="/"
              className="px-8 py-4 rounded-2xl border border-border text-light font-body hover:border-accent/30 transition-all"
            >
              Explore the Product
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}