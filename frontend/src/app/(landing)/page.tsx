"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, Variants } from "framer-motion";

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

// ─── Variants with proper typing ──────────────────────────────────────────────

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 24 },
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

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white overflow-x-hidden pt-20">

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative py-24 md:py-32 px-6 overflow-hidden">
        {/* Subtle decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none opacity-[0.4]">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-orange-200/20 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/10 bg-accent/5 text-accent text-xs font-bold mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Trusted by 50,000+ Job Seekers Worldwide
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-heading text-5xl md:text-7xl font-extrabold text-light leading-[1.1] mb-8 tracking-tight"
            >
              Ace Your Next Interview
              <br />
              <span className="text-gradient">With AI-Powered</span>
              <br />
              Mock Practice
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="text-muted text-lg md:text-xl font-body font-medium max-w-2xl mx-auto mb-12 leading-relaxed"
            >
              PrepzyAI simulates real job interviews with intelligent AI, gives you instant
              personalized feedback, and coaches you to land your dream job offer.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="flex gap-4 justify-center flex-wrap"
            >
              <Link
                href="/signup"
                className="px-8 py-4 rounded-2xl bg-accent text-white font-heading font-bold text-lg shadow-xl shadow-accent/20 hover:bg-accent/90 hover:scale-[1.02] transition-all duration-300"
              >
                Start Practicing Free →
              </Link>
              <Link
                href="/about"
                className="px-8 py-4 rounded-2xl border border-border bg-white text-light font-heading font-bold hover:border-accent/30 hover:bg-accent/5 transition-all text-lg"
              >
                Learn How it works
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="mt-12 flex items-center justify-center gap-8 flex-wrap"
            >
              {trustBadges.map((t) => (
                <span key={t} className="flex items-center gap-2 text-xs text-muted font-bold tracking-wide uppercase">
                  <svg className="w-4 h-4 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                  {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* ── Mock UI Preview ── */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="mt-20 max-w-5xl mx-auto relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-accent/20 to-orange-200/20 rounded-3xl blur-2xl opacity-50 group-hover:opacity-75 transition duration-1000 group-hover:duration-200" />
            <div className="relative rounded-3xl border border-border bg-white p-2 shadow-2xl overflow-hidden">
              <div className="rounded-2xl bg-slate-50 border border-slate-100 overflow-hidden shadow-inner font-body">
                {/* Window Controls */}
                <div className="flex items-center gap-2 px-6 py-4 bg-white border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>
                  <div className="flex-1 mx-6">
                    <div className="bg-slate-100/80 rounded-lg px-4 py-1.5 text-[11px] font-mono text-muted border border-slate-200 text-center select-none">
                      prepzyai.com/session/interview-simulation
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-[10px] font-bold text-accent bg-accent/5 px-3 py-1 rounded-full border border-accent/10">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent animate-ping" />
                    RECORDING SESSION
                  </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-12 gap-10">
                  {/* Chat Area */}
                  <div className="md:col-span-7 space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-accent font-bold text-xs">AI</span>
                      </div>
                      <div className="bg-white border border-border rounded-2xl rounded-tl-none p-5 shadow-sm max-w-[90%]">
                        <p className="text-light text-sm font-semibold leading-relaxed">
                          "Great. Now, tell me about a time you faced a difficult technical conflict
                          within your team. How did you resolve it while maintaining
                          positive collaboration?"
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 flex-row-reverse">
                      <div className="w-10 h-10 rounded-xl bg-slate-200 border border-slate-300 flex items-center justify-center flex-shrink-0">
                        <span className="text-slate-600 font-bold text-xs">YOU</span>
                      </div>
                      <div className="bg-accent/5 border border-accent/10 rounded-2xl rounded-tr-none p-5 shadow-sm max-w-[90%] italic">
                        <p className="text-muted text-sm font-medium leading-relaxed">
                          "During our core migration last year, there was a disagreement
                          about using Redis vs. Memcached for our caching layer..."
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pl-14">
                      <div className="flex gap-1.5">
                        {[0, 0.2, 0.4].map((delay) => (
                          <motion.div
                            key={delay}
                            animate={{ scale: [1, 1.3, 1] }}
                            transition={{ repeat: Infinity, duration: 1, delay }}
                            className="w-2 h-2 rounded-full bg-accent/40"
                          />
                        ))}
                      </div>
                      <span className="text-[11px] font-bold text-muted uppercase tracking-wider">Analyzing sentiment & structure...</span>
                    </div>
                  </div>

                  {/* Stats Area */}
                  <div className="md:col-span-5 space-y-6">
                    <h4 className="text-[11px] font-black text-light/40 uppercase tracking-[0.2em]">Real-time Metrics</h4>
                    <div className="space-y-4">
                      {feedbackMeters.map((m) => (
                        <div key={m.label} className="bg-white p-4 rounded-2xl border border-border shadow-sm">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-bold text-muted uppercase tracking-wide">{m.label}</span>
                            <span className="text-xs font-black text-light">{m.value}%</span>
                          </div>
                          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              whileInView={{ width: `${m.value}%` }}
                              transition={{ duration: 1.5, delay: 0.8 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: m.color }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="p-5 rounded-2xl bg-accent/[0.03] border border-accent/10">
                      <div className="flex items-center gap-2 mb-2 font-black text-xs text-accent uppercase tracking-tighter">
                        <span className="p-1 rounded bg-accent/10">💡</span>
                        Smart Coaching
                      </div>
                      <p className="text-[13px] text-muted font-medium leading-relaxed">
                        You're doing well! Try to emphasize the <b>impact</b> of your resolution more.
                        Quantifiable metrics would strengthen this answer.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Stats ─────────────────────────────────────────────────────────── */}
      <section className="py-20 border-y border-border bg-surface">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-12"
          >
            {stats.map((s) => (
              <motion.div key={s.label} variants={fadeInUp} className="text-center">
                <div className="text-4xl md:text-5xl font-black text-light mb-2 tracking-tighter">{s.value}</div>
                <div className="text-muted font-bold text-sm uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────────── */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-accent text-xs font-black uppercase tracking-[0.3em] mb-4 block">Powerhouse Features</span>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-light mt-4 mb-6 tracking-tight">
              Everything you need to
              <br />
              <span className="text-gradient">build unshakeable confidence</span>
            </h2>
            <p className="text-muted font-medium text-lg max-w-2xl mx-auto leading-relaxed">
              From adaptive AI models to industry-specific coaching, we provide
              the professional tools required to master the art of the interview.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeInUp}
                whileHover={{ y: -8 }}
                className="p-8 rounded-3xl border border-border bg-white hover:border-accent/20 hover:shadow-xl hover:shadow-accent/5 transition-all duration-300 group"
              >
                <div className="w-14 h-14 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center mb-6 group-hover:bg-accent/10 group-hover:scale-110 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="font-heading font-extrabold text-light text-xl mb-3 tracking-tight">{f.title}</h3>
                <p className="text-muted text-base font-medium leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ──────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-32 px-6 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-accent text-xs font-black uppercase tracking-[0.3em] mb-4 block">Proven Process</span>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-light mt-4 tracking-tight">
              How PrepzyAI Works
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {/* Step indicators (Desktop only) */}
            <div className="hidden lg:block absolute top-[2.75rem] left-[15%] right-[15%] h-0.5 bg-border -z-10" />

            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="relative text-center lg:text-left"
              >
                <div className="w-20 h-20 rounded-full bg-white border-2 border-border shadow-sm flex items-center justify-center font-heading font-black text-accent text-xl mx-auto lg:mx-0 mb-8 relative z-10 transition-transform hover:scale-110">
                  {s.num}
                </div>
                <h3 className="font-heading font-extrabold text-light text-xl mb-3 tracking-tight">{s.title}</h3>
                <p className="text-muted text-base font-medium leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ──────────────────────────────────────────────────── */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-24"
          >
            <span className="text-accent text-xs font-black uppercase tracking-[0.3em] mb-4 block">Success Stories</span>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-light mt-4 tracking-tight">
              Trusted by professionals at
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="p-8 rounded-3xl border border-border bg-white shadow-sm hover:shadow-xl transition-all duration-500 flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <svg key={i} className="w-4 h-4 text-[#FACC15]" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-light/90 text-lg font-medium leading-relaxed italic mb-8">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>

                <div className="flex items-center gap-4 pt-6 border-t border-border">
                  <div className="w-12 h-12 rounded-full bg-accent text-white flex items-center justify-center font-black text-lg">
                    {t.initial}
                  </div>
                  <div>
                    <p className="text-light font-black text-sm">{t.name}</p>
                    <p className="text-muted font-bold text-xs uppercase tracking-wider">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ───────────────────────────────────────────────────────────── */}
      <section className="py-24 md:py-32 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-5xl mx-auto rounded-[3rem] bg-light p-12 md:p-24 text-center relative overflow-hidden shadow-2xl"
        >
          {/* Decorative glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-white/10 to-transparent pointer-events-none" />

          <div className="relative z-10">
            <span className="inline-block px-5 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-black uppercase tracking-[0.2em] mb-8">
              Limited Access Available
            </span>
            <h2 className="font-heading text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
              Ready to nail your
              <br />
              <span className="underline decoration-accent/40 underline-offset-8">next interview?</span>
            </h2>
            <p className="text-white/80 font-medium text-lg md:text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Join 50,000+ top-tier candidates who used PrepzyAI to practice
              smarter and land high-paying roles at world-class companies.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/signup"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl bg-white text-light font-heading font-black text-xl shadow-2xl hover:bg-slate-100 hover:scale-[1.03] transition-all duration-300"
              >
                Get Free Early Access
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-10 py-5 rounded-2xl border-2 border-white/30 text-white font-heading font-black text-xl hover:bg-white/10 transition-all duration-300"
              >
                Contact Sales
              </Link>
            </div>

            <div className="mt-12 flex justify-center gap-8 flex-wrap opacity-60">
              {trustBadges.slice(0, 3).map(b => (
                <span key={b} className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                  {b}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

    </div>
  );
}