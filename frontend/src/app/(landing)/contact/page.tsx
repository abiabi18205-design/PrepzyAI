"use client";

import { useState } from "react";

const faqs = [
  {
    q: "Is MockPilotAI free to use?",
    a: "We offer a free tier with 3 mock sessions per month. Paid plans unlock unlimited sessions, advanced analytics, and company-specific prep.",
  },
  {
    q: "What roles does MockPilotAI support?",
    a: "We cover 200+ roles across tech, finance, consulting, product, design, sales, and more — with tailored question banks for each.",
  },
  {
    q: "How does the AI feedback work?",
    a: "Our models analyze your spoken answers for structure (STAR, SOAR), confidence indicators, filler words, pacing, and content relevance — generating a detailed score report.",
  },
  {
    q: "Can I prep for a specific company?",
    a: "Yes. We have company-specific modules for 500+ employers including FAANG, consulting firms, investment banks, and startups.",
  },
];

const contactCards = [
  {
    icon: "📧",
    label: "Email",
    value: "hello@mockpilotai.com",
    sub: "We reply within 24 hours",
  },
  {
    icon: "💬",
    label: "Live Chat",
    value: "Available in-app",
    sub: "Mon–Fri, 9am–6pm UTC",
  },
  {
    icon: "🏢",
    label: "Office",
    value: "San Francisco, CA",
    sub: "Remote-first team",
  },
];

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError("");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setError("Please fill in your name, email, and message.");
      return;
    }
    setSubmitted(true);
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-surface border border-border text-light placeholder-[#4A4A5A] text-sm font-body outline-none focus:border-accent/40 transition-colors";

  return (
    <div className="min-h-screen pt-28">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="text-accent text-xs font-mono uppercase tracking-widest">
            Contact
          </span>
          <h1 className="font-heading text-6xl font-extrabold text-light mt-3 mb-4">
            Let&apos;s Talk
          </h1>
          <p className="text-muted text-lg font-body font-light max-w-xl mx-auto leading-relaxed">
            Have a question, feedback, or want early access? We reply to every
            message within 24 hours.
          </p>
        </div>
      </section>

      {/* ── Form + Sidebar ───────────────────────────────────────────────── */}
      <section className="py-8 px-6 pb-20">
        <div className="max-w-5xl mx-auto grid grid-cols-5 gap-10">

          {/* Form */}
          <div className="col-span-3">
            {submitted ? (
              <div className="min-h-[420px] flex flex-col items-center justify-center text-center p-12 rounded-2xl border border-accent/20 bg-accent/5">
                <div className="w-16 h-16 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center mb-6 text-accent text-2xl">
                  ✓
                </div>
                <h3 className="font-heading text-2xl font-extrabold text-light mb-2">
                  Message Sent!
                </h3>
                <p className="text-muted font-body max-w-xs leading-relaxed">
                  Thanks,{" "}
                  <span className="text-light">{form.name}</span>. We&apos;ll
                  get back to you at{" "}
                  <span className="text-light">{form.email}</span> within 24
                  hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="p-8 rounded-2xl border border-border bg-card space-y-5"
              >
                <h2 className="font-heading text-2xl font-bold text-light">
                  Send us a message
                </h2>

                {error && (
                  <p className="text-red-400 text-sm font-body bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3">
                    {error}
                  </p>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted font-mono uppercase tracking-wider block mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Jane Smith"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted font-mono uppercase tracking-wider block mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="jane@example.com"
                      className={inputClass}
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-muted font-mono uppercase tracking-wider block mb-2">
                    Subject
                  </label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    className={`${inputClass} cursor-pointer appearance-none`}
                  >
                    <option value="">Select a topic…</option>
                    <option value="early-access">Early Access Request</option>
                    <option value="enterprise">Enterprise / Team Plan</option>
                    <option value="support">Technical Support</option>
                    <option value="press">Press & Media</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs text-muted font-mono uppercase tracking-wider block mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={5}
                    placeholder="Tell us how we can help…"
                    className={`${inputClass} resize-none`}
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-accent text-ink font-heading font-bold hover:bg-accent/90 transition-all hover:scale-[1.01] duration-200"
                >
                  Send Message →
                </button>
              </form>
            )}
          </div>

          {/* Sidebar */}
          <div className="col-span-2 space-y-4">
            {contactCards.map((c) => (
              <div
                key={c.label}
                className="p-5 rounded-2xl border border-border bg-card flex items-start gap-4 hover:border-accent/20 transition-colors"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-lg flex-shrink-0">
                  {c.icon}
                </div>
                <div>
                  <p className="text-xs text-muted font-mono uppercase tracking-wider">
                    {c.label}
                  </p>
                  <p className="text-light text-sm font-body font-medium mt-0.5">
                    {c.value}
                  </p>
                  <p className="text-muted text-xs font-body mt-0.5">{c.sub}</p>
                </div>
              </div>
            ))}

            <div className="p-5 rounded-2xl border border-accent/20 bg-accent/5">
              <p className="text-accent text-xs font-mono uppercase tracking-wider mb-2">
                🚀 Early Access
              </p>
              <p className="text-light text-sm font-body leading-relaxed">
                Want priority access? Mention{" "}
                <span className="text-accent font-mono">&ldquo;EARLY2026&rdquo;</span>{" "}
                in your message and we&apos;ll bump you to the front of the queue.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-20 px-6 border-t border-border bg-card/20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-accent text-xs font-mono uppercase tracking-widest">
              FAQ
            </span>
            <h2 className="font-heading text-4xl font-extrabold text-light mt-3">
              Common Questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((f) => (
              <div
                key={f.q}
                className="p-6 rounded-2xl border border-border bg-card hover:border-accent/20 transition-colors"
              >
                <h3 className="font-heading font-bold text-light mb-2">{f.q}</h3>
                <p className="text-muted text-sm font-body leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}