import Link from "next/link";

// ─── Data ────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: "🎙️",
    title: "AI Voice Interviews",
    desc: "Practice with a conversational AI that adapts to your responses in real time, just like a real interviewer.",
  },
  {
    icon: "📊",
    title: "Instant Analytics",
    desc: "Get detailed breakdowns of your confidence, pacing, filler words, and content quality after every session.",
  },
  {
    icon: "🧠",
    title: "Smart Question Bank",
    desc: "10,000+ role-specific questions across tech, finance, product, design, and more.",
  },
  {
    icon: "🔁",
    title: "Spaced Repetition",
    desc: "Our algorithm resurfaces your weak areas so you spend less time and make faster progress.",
  },
  {
    icon: "📝",
    title: "Answer Coaching",
    desc: "AI rewrites your answers using STAR and other proven frameworks so you learn structure, not just memorize.",
  },
  {
    icon: "🏆",
    title: "Company-Specific Prep",
    desc: "Simulate interviews tailored to Google, Amazon, Meta, McKinsey, and hundreds more top employers.",
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

const trustBadges = [
  "No credit card required",
  "Cancel anytime",
  "GDPR compliant",
  "SOC 2 certified",
];

const feedbackMeters = [
  { label: "Confidence", value: 82, color: "#6EE7B7" },
  { label: "Structure", value: 67, color: "#a78bfa" },
  { label: "Clarity", value: 91, color: "#60a5fa" },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        {/* Grid bg */}
        <div
          className="absolute inset-0 opacity-50 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(110,231,183,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(110,231,183,0.04) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />
        {/* Glow */}
        <div
          className="absolute top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse, rgba(110,231,183,0.06) 0%, transparent 70%)",
          }}
        />

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-accent/20 bg-accent/5 text-accent text-xs font-mono mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
            Now in Early Access — Limited Spots Available
          </div>

          <h1 className="font-heading text-6xl font-extrabold text-light leading-[1.05] mb-6">
            Ace Every Interview
            <br />
            <span className="text-gradient">with AI-Powered</span>
            <br />
            Mock Practice
          </h1>

          <p className="text-muted text-xl font-body font-light max-w-2xl mx-auto mb-10 leading-relaxed">
            MockPilotAI simulates real job interviews with intelligent AI, gives you instant
            feedback, and coaches you until you&apos;re ready to say &ldquo;I got the job.&rdquo;
          </p>

          <div className="flex gap-4 justify-center">
            {/* ✅ changed from /contact to /signup */}
            <Link
              href="/signup"
              className="px-8 py-4 rounded-2xl bg-accent text-ink font-heading font-bold text-base hover:bg-accent/90 transition-all hover:scale-105 duration-200"
              style={{ boxShadow: "0 0 32px rgba(110,231,183,0.2)" }}
            >
              Start Practicing Free →
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 rounded-2xl border border-border text-light font-body hover:border-accent/30 hover:bg-white/5 transition-all text-base"
            >
              How it works
            </Link>
          </div>

          {/* Trust badges */}
          <div className="mt-12 flex items-center justify-center gap-8">
            {trustBadges.map((t) => (
              <span
                key={t}
                className="flex items-center gap-1.5 text-xs text-muted font-mono"
              >
                <span className="text-accent">✓</span> {t}
              </span>
            ))}
          </div>
        </div>

        {/* ── Mock UI Preview ── */}
        <div className="relative max-w-4xl mx-auto mt-20">
          <div
            className="rounded-2xl border border-border bg-card p-1"
            style={{ boxShadow: "0 0 60px rgba(110,231,183,0.08)" }}
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
                    <span className="text-muted text-xs font-mono">
                      mockpilotai.com/session/live
                    </span>
                  </div>
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
                    <div className="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-500/30 flex items-center justify-center flex-shrink-0">
                      <span className="text-purple-300 text-xs font-mono">You</span>
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
                    <span className="text-muted text-xs font-mono">
                      AI is analyzing your response…
                    </span>
                  </div>
                </div>

                {/* Feedback */}
                <div className="col-span-2 space-y-3">
                  <p className="text-xs text-muted font-mono uppercase tracking-wider">
                    Live Feedback
                  </p>
                  {feedbackMeters.map((m) => (
                    <div key={m.label}>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-muted font-mono">{m.label}</span>
                        <span className="text-light font-mono">{m.value}%</span>
                      </div>
                      <div className="h-1.5 bg-border rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${m.value}%`,
                            backgroundColor: m.color,
                          }}
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

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-y border-border bg-card/30">
        <div className="max-w-5xl mx-auto grid grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-heading text-4xl font-extrabold text-gradient mb-1">
                {s.value}
              </div>
              <div className="text-muted text-sm font-mono">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ─────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent text-xs font-mono uppercase tracking-widest">
              Features
            </span>
            <h2 className="font-heading text-5xl font-extrabold text-light mt-3 mb-4">
              Everything you need to
              <br />
              <span className="text-gradient">land your dream job</span>
            </h2>
            <p className="text-muted font-body max-w-xl mx-auto">
              From your first practice session to your final round, MockPilotAI has the tools
              to get you there.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {features.map((f) => (
              <div
                key={f.title}
                className="p-6 rounded-2xl border border-border bg-card card-hover"
              >
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-heading font-bold text-light text-lg mb-2">{f.title}</h3>
                <p className="text-muted text-sm font-body leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6 bg-card/20 border-y border-border">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-accent text-xs font-mono uppercase tracking-widest">
              Process
            </span>
            <h2 className="font-heading text-5xl font-extrabold text-light mt-3">
              How MockPilotAI Works
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-6">
            {steps.map((s) => (
              <div key={s.num}>
                <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center mb-4">
                  <span className="font-mono text-accent text-sm">{s.num}</span>
                </div>
                <h3 className="font-heading font-bold text-light mb-2">{s.title}</h3>
                <p className="text-muted text-sm font-body leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <div
            className="p-12 rounded-3xl border border-accent/20"
            style={{ background: "rgba(110,231,183,0.04)" }}
          >
            <h2 className="font-heading text-5xl font-extrabold text-light mb-4">
              Ready to nail your
              <br />
              <span className="text-gradient">next interview?</span>
            </h2>
            <p className="text-muted font-body mb-8 max-w-md mx-auto">
              Join thousands of job seekers who prep smarter with MockPilotAI. Your next offer
              starts here.
            </p>
            {/* ✅ changed from /contact to /signup */}
            <Link
              href="/signup"
              className="inline-flex px-10 py-4 rounded-2xl bg-accent text-ink font-heading font-bold text-base hover:bg-accent/90 transition-all hover:scale-105 duration-200"
              style={{ boxShadow: "0 0 32px rgba(110,231,183,0.2)" }}
            >
              Get Early Access — It&apos;s Free
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
