"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="#FF6B6B" strokeWidth="1.5" />
        <path d="M8 12c0-2.2 1.8-4 4-4s4 1.8 4 4-1.8 4-4 4" stroke="#FF6B6B" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="12" cy="12" r="1.5" fill="#FF6B6B" />
      </svg>
    ),
    title: "AI Voice Interviews",
    desc: "Practice with a conversational AI that adapts to your responses in real time, just like a real interviewer.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="3" width="18" height="18" rx="3" stroke="#FF6B6B" strokeWidth="1.5" />
        <path d="M7 17l3-4 3 3 2-3 2 4" stroke="#FF6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Instant Analytics",
    desc: "Get detailed breakdowns of your confidence, pacing, filler words, and content quality after every session.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" stroke="#FF6B6B" strokeWidth="1.5" />
        <path d="M12 6v6l4 2" stroke="#FF6B6B" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    title: "Smart Question Bank",
    desc: "10,000+ role-specific questions across tech, finance, product, design, and more.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M4 4h16v4H4zM4 10h10v4H4zM4 16h7v4H4z" stroke="#FF6B6B" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: "Answer Coaching",
    desc: "AI rewrites your answers using STAR and other proven frameworks so you learn structure, not just memorize.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="#FF6B6B" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    title: "Company-Specific Prep",
    desc: "Simulate interviews tailored to Google, Amazon, Meta, McKinsey, and hundreds more top employers.",
  },
  {
    icon: (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" stroke="#FF6B6B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    title: "Spaced Repetition",
    desc: "Our algorithm resurfaces your weak areas so you spend less time and make faster progress.",
  },
];

const stats = [
  { value: "94%", label: "Success Rate" },
  { value: "50K+", label: "Interviews Simulated" },
  { value: "200+", label: "Job Roles Covered" },
  { value: "4.9★", label: "User Rating" },
];

const steps = [
  {
    num: "01",
    title: "Choose Your Role",
    desc: "Select the job title, industry, and target company for a tailored session.",
  },
  {
    num: "02",
    title: "Start Your Session",
    desc: "Our AI interviewer asks realistic questions and listens to your answers.",
  },
  {
    num: "03",
    title: "Review Feedback",
    desc: "Get a full report with scores, suggestions, and improved sample answers.",
  },
  {
    num: "04",
    title: "Land the Job",
    desc: "Iterate until you're ready. Track your growth and walk in with confidence.",
  },
];

const testimonials = [
  {
    name: "Raj M.",
    role: "Software Engineer @ Amazon",
    initial: "R",
    text: "PrepzyAI felt like a real interview. The feedback was incredibly detailed — I knew exactly what to fix before my actual Amazon loop.",
  },
  {
    name: "Priya K.",
    role: "Product Manager @ Google",
    initial: "P",
    text: "I used it every day for 3 weeks. The STAR coaching alone is worth it. Landed my PM role with Google on the first try.",
  },
  {
    name: "Daniel O.",
    role: "Data Analyst @ McKinsey",
    initial: "D",
    text: "The company-specific questions for McKinsey were spot on. I walked in confident and walked out with an offer.",
  },
];

const feedbackMeters = [
  { label: "Confidence", value: 82, color: "#FF6B6B" },
  { label: "Structure", value: 67, color: "#FFA07A" },
  { label: "Clarity", value: 91, color: "#FF8C69" },
];

const trustBadges = [
  "No credit card required",
  "Cancel anytime",
  "GDPR compliant",
  "SOC 2 certified",
];

// ─── Animation Hook ────────────────────────────────────────────────────────────

function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);

  return { ref, inView };
}

// ─── Animated Counter ──────────────────────────────────────────────────────────

function AnimatedStat({ value, label }: { value: string; label: string }) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={`text-center transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      <div className="font-heading text-4xl font-extrabold text-gradient mb-1">{value}</div>
      <div className="text-muted text-sm font-mono">{label}</div>
    </div>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const heroRef = useInView(0.1);
  const featuresRef = useInView(0.05);
  const stepsRef = useInView(0.1);
  const testimonialsRef = useInView(0.1);

  return (
    <div className="min-h-screen overflow-x-hidden">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-28 px-6 overflow-hidden">

        {/* Animated grid bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,107,107,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,107,107,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 75%)",
          }}
        />

        {/* Glow orbs */}
        <div
          className="absolute top-16 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,107,107,0.07) 0%, transparent 65%)" }}
        />
        <div
          className="absolute top-40 left-1/4 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{ background: "radial-gradient(ellipse, rgba(255,160,122,0.04) 0%, transparent 70%)" }}
        />

        <div
          ref={heroRef.ref}
          className={`relative max-w-5xl mx-auto text-center transition-all duration-1000 ${mounted && heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Now in Early Access — Limited Spots Available
          </div>

          <h1 className="font-heading text-6xl md:text-7xl font-extrabold text-light leading-[1.05] mb-6">
            Ace Every Interview
            <br />
            <span className="text-gradient">with AI-Powered</span>
            <br />
            Mock Practice
          </h1>

          <p className="text-muted text-xl font-body font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            PrepzyAI simulates real job interviews with intelligent AI, gives you instant
            feedback, and coaches you until you&apos;re ready to say &ldquo;I got the job.&rdquo;
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/signup"
              className="px-8 py-4 rounded-2xl bg-accent text-ink font-heading font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,107,107,0.35)]"
            >
              Start Practicing Free →
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 rounded-2xl border border-border text-light font-body hover:border-accent/40 hover:bg-white/5 transition-all text-base"
            >
              How it works
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-10 flex items-center justify-center gap-6 flex-wrap">
            {trustBadges.map((t) => (
              <span key={t} className="flex items-center gap-1.5 text-xs text-muted font-mono">
                <span className="text-accent">✓</span> {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Mock UI Preview ── */}
        <div
          className={`relative max-w-4xl mx-auto mt-20 transition-all duration-1000 delay-300 ${mounted && heroRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-16"}`}
        >
          {/* Glow behind the card */}
          <div
            className="absolute -inset-4 rounded-3xl pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(255,107,107,0.08) 0%, transparent 70%)" }}
          />
          <div
            className="rounded-2xl border border-border bg-card p-1"
            style={{ boxShadow: "0 0 80px rgba(255,107,107,0.1), 0 40px 80px rgba(0,0,0,0.4)" }}
          >
            <div className="rounded-xl bg-surface overflow-hidden">
              {/* Chrome bar */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/60" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                  <div className="w-3 h-3 rounded-full bg-green-500/60" />
                </div>
                <div className="flex-1 mx-4">
                  <div className="h-5 rounded-md bg-border/60 flex items-center px-3">
                    <span className="text-muted text-xs font-mono">prepzyai.com/session/live</span>
                  </div>
                </div>
                {/* Live indicator */}
                <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-red-400 text-xs font-mono">LIVE</span>
                </div>
              </div>

              {/* Interview body */}
              <div className="p-6 grid grid-cols-5 gap-6">
                {/* Chat */}
                <div className="col-span-3 space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-accent text-xs font-mono">AI</span>
                    </div>
                    <div className="bg-accent/5 border border-accent/10 rounded-xl rounded-tl-none px-4 py-3 flex-1">
                      <p className="text-light text-sm font-body leading-relaxed">
                        Tell me about a time you had to lead a project through unexpected
                        technical challenges. How did you keep the team aligned and the
                        delivery on track?
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 flex-row-reverse">
                    <div className="w-8 h-8 rounded-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-[#FF6B6B] text-xs font-mono">You</span>
                    </div>
                    <div className="bg-white/5 border border-border rounded-xl rounded-tr-none px-4 py-3 flex-1 text-right">
                      <p className="text-muted text-sm font-body leading-relaxed">
                        During our Q3 migration to microservices, we hit unexpected latency
                        spikes…
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-11">
                    <div className="flex gap-1">
                      {[0, 150, 300].map((d) => (
                        <div
                          key={d}
                          className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce"
                          style={{ animationDelay: `${d}ms` }}
                        />
                      ))}
                    </div>
                    <span className="text-muted text-xs font-mono">AI is analyzing your response…</span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="col-span-2 space-y-3">
                  <p className="text-xs text-muted font-mono uppercase tracking-wider">Live Feedback</p>
                  {feedbackMeters.map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted font-mono">{m.label}</span>
                        <span className="text-light font-mono">{m.value}%</span>
                      </div>
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${m.value}%`, backgroundColor: m.color }}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="mt-4 p-3 rounded-xl bg-accent/5 border border-accent/10">
                    <p className="text-accent text-xs font-mono mb-1">💡 Tip</p>
                    <p className="text-muted text-xs font-body leading-relaxed">
                      Add a quantifiable outcome to strengthen your STAR response.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-y border-border" style={{ background: "rgba(27,40,56,0.3)" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <AnimatedStat key={s.label} value={s.value} label={s.label} />
          ))}
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            ref={featuresRef.ref}
            className={`text-center mb-16 transition-all duration-700 ${featuresRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-accent text-xs font-mono uppercase tracking-widest">Features</span>
            <h2 className="font-heading text-5xl font-extrabold text-light mt-3 mb-4">
              Everything you need to
              <br />
              <span className="text-gradient">land your dream job</span>
            </h2>
            <p className="text-muted font-body max-w-xl mx-auto">
              From your first practice session to your final round, PrepzyAI has the tools to get you there.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <FeatureCard key={f.title} feature={f} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section className="py-28 px-6 border-y border-border" style={{ background: "rgba(27,40,56,0.2)" }}>
        <div className="max-w-5xl mx-auto">
          <div
            ref={stepsRef.ref}
            className={`text-center mb-16 transition-all duration-700 ${stepsRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-accent text-xs font-mono uppercase tracking-widest">Process</span>
            <h2 className="font-heading text-5xl font-extrabold text-light mt-3">
              How PrepzyAI Works
            </h2>
          </div>

          <div className="relative grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Connector line (desktop) */}
            <div className="hidden md:block absolute top-7 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

            {steps.map((s, i) => (
              <StepCard key={s.num} step={s} index={i} inView={stepsRef.inView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-6xl mx-auto">
          <div
            ref={testimonialsRef.ref}
            className={`text-center mb-16 transition-all duration-700 ${testimonialsRef.inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          >
            <span className="text-accent text-xs font-mono uppercase tracking-widest">Testimonials</span>
            <h2 className="font-heading text-5xl font-extrabold text-light mt-3">
              Real results from{" "}
              <span className="text-gradient">real people</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <TestimonialCard key={t.name} testimonial={t} index={i} inView={testimonialsRef.inView} />
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-28 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="p-12 rounded-3xl border border-accent/20 relative overflow-hidden"
            style={{ background: "rgba(255,107,107,0.03)" }}
          >
            {/* Glow */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,107,107,0.08) 0%, transparent 60%)" }}
            />

            <div className="relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-mono mb-8">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                Join 50,000+ job seekers
              </div>

              <h2 className="font-heading text-5xl font-extrabold text-light mb-4">
                Ready to nail your
                <br />
                <span className="text-gradient">next interview?</span>
              </h2>
              <p className="text-muted font-body mb-10 max-w-md mx-auto leading-relaxed">
                Your next offer starts here. Practice smarter, get better feedback, and walk into every interview with confidence.
              </p>

              <div className="flex gap-4 justify-center flex-wrap">
                <Link
                  href="/signup"
                  className="px-10 py-4 rounded-2xl bg-accent text-ink font-heading font-bold text-base transition-all duration-300 hover:scale-105 hover:shadow-[0_0_40px_rgba(255,107,107,0.35)]"
                >
                  Get Early Access — It&apos;s Free
                </Link>
                <Link
                  href="/about"
                  className="px-8 py-4 rounded-2xl border border-border text-light font-body hover:border-accent/40 hover:bg-white/5 transition-all text-base"
                >
                  Learn more
                </Link>
              </div>

              <div className="mt-8 flex items-center justify-center gap-6 flex-wrap">
                {trustBadges.map((t) => (
                  <span key={t} className="flex items-center gap-1.5 text-xs text-muted font-mono">
                    <span className="text-accent">✓</span> {t}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const { ref, inView } = useInView(0.1);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="p-6 rounded-2xl border bg-card cursor-default transition-all duration-500"
      style={{
        borderColor: hovered ? "rgba(255,107,107,0.3)" : "#2a3a4a",
        background: hovered ? "rgba(255,107,107,0.04)" : "#1B2838",
        transform: `translateY(${inView ? 0 : 24}px)`,
        opacity: inView ? 1 : 0,
        transitionDelay: `${index * 80}ms`,
        boxShadow: hovered ? "0 0 30px rgba(255,107,107,0.06)" : "none",
      }}
    >
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-all duration-300"
        style={{ background: hovered ? "rgba(255,107,107,0.12)" : "rgba(255,107,107,0.06)", border: "1px solid rgba(255,107,107,0.15)" }}
      >
        {feature.icon}
      </div>
      <h3 className="font-heading font-bold text-light text-lg mb-2">{feature.title}</h3>
      <p className="text-muted text-sm font-body leading-relaxed">{feature.desc}</p>
    </div>
  );
}

function StepCard({ step, index, inView }: { step: typeof steps[0]; index: number; inView: boolean }) {
  return (
    <div
      className="transition-all duration-700 text-center md:text-left"
      style={{
        transform: `translateY(${inView ? 0 : 24}px)`,
        opacity: inView ? 1 : 0,
        transitionDelay: `${index * 120}ms`,
      }}
    >
      <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4 mx-auto md:mx-0 relative z-10">
        <span className="font-mono text-accent text-sm font-bold">{step.num}</span>
      </div>
      <h3 className="font-heading font-bold text-light mb-2">{step.title}</h3>
      <p className="text-muted text-sm font-body leading-relaxed">{step.desc}</p>
    </div>
  );
}

function TestimonialCard({ testimonial, index, inView }: { testimonial: typeof testimonials[0]; index: number; inView: boolean }) {
  return (
    <div
      className="p-6 rounded-2xl border border-border bg-card transition-all duration-700"
      style={{
        transform: `translateY(${inView ? 0 : 24}px)`,
        opacity: inView ? 1 : 0,
        transitionDelay: `${index * 120}ms`,
      }}
    >
      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} width="14" height="14" fill="#FF6B6B" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
          </svg>
        ))}
      </div>

      <p className="text-muted text-sm font-body leading-relaxed mb-6 italic">
        &ldquo;{testimonial.text}&rdquo;
      </p>

      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center font-heading font-bold text-accent text-sm flex-shrink-0">
          {testimonial.initial}
        </div>
        <div>
          <p className="text-light text-sm font-heading font-bold">{testimonial.name}</p>
          <p className="text-muted text-xs font-mono">{testimonial.role}</p>
        </div>
      </div>
    </div>
  );
}