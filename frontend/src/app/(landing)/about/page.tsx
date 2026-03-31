"use client";

import Link from "next/link";
import { motion, Variants } from "framer-motion";

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
    color: "bg-blue-100 text-blue-600",
  },
  {
    name: "Marcus Webb",
    role: "CTO & Co-founder",
    initials: "MW",
    color: "bg-purple-100 text-purple-600",
  },
  {
    name: "Priya Nair",
    role: "Head of AI Research",
    initials: "PN",
    color: "bg-orange-100 text-orange-600",
  },
  {
    name: "Liam Torres",
    role: "Head of Product",
    initials: "LT",
    color: "bg-emerald-100 text-emerald-600",
  },
];

const milestones = [
  {
    year: "2023",
    event: "PrepzyAI founded by ex-Google engineers to simplify complex interview prep.",
  },
  {
    year: "Early 2024",
    event: "Launched private beta. Successfully helped 500+ candidates land roles at FAANG.",
  },
  {
    year: "Mid 2024",
    event: "Raised seed funding to expand our AI models to more technical and non-technical roles.",
  },
  {
    year: "2025",
    event: "Released conversational voice AI, bringing real-time adaptability to prep sessions.",
  },
  {
    year: "2026",
    event: "Now serving 50,000+ users worldwide and expanding our enterprise solutions.",
  },
];

const miniStats = [
  { value: "2023", label: "Founded" },
  { value: "24", label: "Team Size" },
  { value: "38", label: "Countries" },
  { value: "50K+", label: "Users Helped" },
];

// ─── Variants ──────────────────────────────────────────────────────────────────

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-32 overflow-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative py-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] pointer-events-none opacity-[0.3]">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold mb-6 uppercase tracking-widest">
              Our Mission
            </span>
            <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-light mb-8 leading-[1.1] tracking-tight">
              We&apos;re leveling the
              <br />
              <span className="text-gradient">interview playing field</span>
            </h1>
            <p className="text-muted text-lg md:text-xl font-body font-medium max-w-2xl mx-auto leading-relaxed">
              Talent is distributed equally, but opportunity is not. We believe that
              everyone should have access to world-class coaching to land their dream job,
              regardless of their background.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Story ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <span className="text-accent text-xs font-black uppercase tracking-[0.3em] mb-4 block">Our Origin</span>
            <h2 className="font-heading text-4xl font-extrabold text-light mb-6 tracking-tight">
              Born from frustration,
              <br />
              built with purpose
            </h2>
            <div className="space-y-6 text-muted font-medium text-base leading-relaxed">
              <p>
                PrepzyAI was founded in 2023 by two engineers who noticed a persistent problem
                at top tech firms: high-quality candidates were failing interviews not because they lacked skill,
                but because they hadn&apos;t mastered the art of the interview itself.
              </p>
              <p>
                Elite coaching was hidden behind expensive paywalls or difficult-to-book live agents.
                There was no way for an average job seeker to get high-fidelity, data-driven practice
                on their own terms.
              </p>
              <p>
                So we built one. We combined advanced conversational AI with behavioral
                science to create a platform that feels like talking to a real human,
                while providing insights no human could catch.
              </p>
            </div>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-6"
          >
            {miniStats.map((s) => (
              <motion.div
                key={s.label}
                variants={fadeInUp}
                className="p-8 rounded-3xl border border-border bg-white text-center shadow-sm hover:shadow-xl transition-all duration-300"
              >
                <div className="font-heading text-4xl font-black text-light mb-2 tracking-tighter">
                  {s.value}
                </div>
                <div className="text-muted text-xs font-bold uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Values ───────────────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-accent text-xs font-black uppercase tracking-[0.3em] mb-4 block">Core Principles</span>
            <h2 className="font-heading text-4xl font-extrabold text-light tracking-tight">
              What We Stand For
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {values.map((v) => (
              <motion.div
                key={v.title}
                variants={fadeInUp}
                className="p-8 rounded-3xl border border-border bg-white hover:border-accent/20 hover:shadow-xl transition-all duration-300 group"
              >
                <div className="text-4xl mb-6 group-hover:scale-125 transition-transform duration-300">{v.icon}</div>
                <h3 className="font-heading font-extrabold text-light text-xl mb-3 tracking-tight">{v.title}</h3>
                <p className="text-muted text-base font-medium leading-relaxed">{v.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Team ─────────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-accent text-xs font-black uppercase tracking-[0.3em] mb-4 block">The Crew</span>
            <h2 className="font-heading text-4xl font-extrabold text-light tracking-tight">
              Meet the Team
            </h2>
            <p className="text-muted mt-4 font-medium text-lg max-w-md mx-auto leading-relaxed">
              A diverse team of engineers, designers, and AI researchers obsessed with excellence.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {team.map((m) => (
              <motion.div
                key={m.name}
                variants={fadeInUp}
                className="p-8 rounded-3xl border border-border bg-white text-center hover:border-accent/20 hover:shadow-xl transition-all duration-300"
              >
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner ${m.color}`}>
                  <span className="font-heading font-black text-2xl">
                    {m.initials}
                  </span>
                </div>
                <h3 className="font-heading font-extrabold text-light text-lg mb-1">{m.name}</h3>
                <p className="text-muted text-xs font-bold uppercase tracking-widest">{m.role}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Timeline ─────────────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-accent text-xs font-black uppercase tracking-[0.3em] mb-4 block">The Journey</span>
            <h2 className="font-heading text-4xl font-extrabold text-light tracking-tight">
              Our Milestones
            </h2>
          </motion.div>

          <div className="relative pl-8 border-l-2 border-border space-y-12 ml-4">
            {milestones.map((m, i) => (
              <motion.div
                key={m.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative"
              >
                <div className="absolute -left-[45px] top-4 w-4 h-4 rounded-full bg-accent border-4 border-white shadow-sm shadow-accent/50" />
                <div className="p-8 rounded-3xl border border-border bg-white hover:border-accent/30 hover:shadow-lg transition-all duration-300">
                  <span className="text-accent text-sm font-black uppercase tracking-widest">{m.year}</span>
                  <p className="text-light text-lg font-medium mt-3 leading-relaxed">
                    {m.event}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-light rounded-[3rem] p-16 md:p-24 relative overflow-hidden shadow-2xl shadow-light/20"
        >
          <div className="relative z-10">
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              Join us on the mission
            </h2>
            <p className="text-white/80 font-medium text-lg md:text-xl mb-12 max-w-xl mx-auto leading-relaxed">
              Help us democratize access to elite interview preparation. Whether you&apos;re
              a candidate or a company, we want to hear from you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-10 py-5 rounded-2xl bg-white text-light font-heading font-black text-lg shadow-xl hover:bg-slate-100 hover:scale-105 transition-all duration-300"
              >
                Get in Touch
              </Link>
              <Link
                href="/signup"
                className="px-10 py-5 rounded-2xl border-2 border-white/20 text-white font-heading font-black text-lg hover:bg-white/10 transition-all duration-300"
              >
                Start Practicing Free
              </Link>
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}