"use client";

import { useState } from "react";
import { motion, AnimatePresence, Variants } from "framer-motion";

const faqs = [
  {
    q: "Is PrepzyAI free to use?",
    a: "We offer a free trial that includes 3 full mock sessions. Our paid plans unlock unlimited interviews, advanced behavioral analytics, and company-specific modules.",
  },
  {
    q: "What roles does PrepzyAI support?",
    a: "We cover 200+ roles across tech, finance, consulting, product management, design, and more — each with tailored question banks.",
  },
  {
    q: "How does the AI feedback work?",
    a: "Our models analyze your responses for structure (STAR/SOAR), confidence markers, pacing, and technical accuracy, giving you a detailed breakdown and sample answers.",
  },
  {
    q: "Can I prep for a specific company?",
    a: "Yes. We have company-specific modules for 500+ employers including Google, Amazon, McKinsey, Goldman Sachs, and many others.",
  },
];

const contactCards = [
  {
    icon: "📧",
    label: "Email",
    value: "support@prepzyai.com",
    sub: "Response within 12-24 hours",
  },
  {
    icon: "💬",
    label: "Community",
    value: "Discord Server",
    sub: "Join our active community",
  },
  {
    icon: "🏢",
    label: "Office",
    value: "San Francisco, CA",
    sub: "Remote-first global team",
  },
];

type FormState = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

// ─── Variants ──────────────────────────────────────────────────────────────────

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" }
  }
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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
    // Simulate API call
    setSubmitted(true);
  };

  const inputClass =
    "w-full px-5 py-3.5 rounded-2xl bg-white border border-border text-light placeholder-muted text-base font-body outline-none focus:border-accent focus:ring-4 focus:ring-accent/5 transition-all duration-300";

  return (
    <div className="min-h-screen bg-white pt-32 overflow-hidden">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative py-20 px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] pointer-events-none opacity-[0.3]">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/10 text-accent text-xs font-bold mb-6 uppercase tracking-widest">
              Get in Touch
            </span>
            <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-light mb-6 tracking-tight">
              Let&apos;s Build Your
              <br />
              <span className="text-gradient">Future Together</span>
            </h1>
            <p className="text-muted text-lg md:text-xl font-body font-medium max-w-xl mx-auto leading-relaxed">
              Have a question, feedback, or want to discuss enterprise solutions?
              Our team is here to help you succeed.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── Form + Sidebar ───────────────────────────────────────────────── */}
      <section className="py-12 px-6 pb-32">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <AnimatePresence mode="wait">
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="min-h-[500px] flex flex-col items-center justify-center text-center p-12 rounded-[2.5rem] border border-green-100 bg-green-50/50"
                >
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-8 text-green-600 text-3xl shadow-inner">
                    ✓
                  </div>
                  <h3 className="font-heading text-3xl font-extrabold text-light mb-4">
                    Message Received!
                  </h3>
                  <p className="text-muted text-lg font-medium max-w-sm leading-relaxed">
                    Thanks, <span className="text-light font-bold">{form.name}</span>.
                    We&apos;ve received your message and will get back to you at
                    <span className="text-light font-bold ml-1">{form.email}</span> within 24 hours.
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="mt-10 text-accent font-bold text-sm hover:underline"
                  >
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-10 md:p-12 rounded-[2.5rem] border border-border bg-white shadow-2xl shadow-slate-100"
                >
                  <h2 className="font-heading text-3xl font-extrabold text-light mb-8">
                    Send us a message
                  </h2>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="text-red-500 text-sm font-bold bg-red-50 border border-red-100 rounded-2xl px-5 py-4"
                      >
                        {error}
                      </motion.div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-black text-muted uppercase tracking-[0.2em] ml-1">
                          Full Name
                        </label>
                        <input
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Alex Johnson"
                          className={inputClass}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-black text-muted uppercase tracking-[0.2em] ml-1">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="alex@example.com"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted uppercase tracking-[0.2em] ml-1">
                        Subject
                      </label>
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className={`${inputClass} cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2020%2020%22%20fill%3D%22none%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M5%207.5L10%2012.5L15%207.5%22%20stroke%3D%22%2394A3B8%22%20stroke-width%3D%221.5%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22/%3E%3C/svg%3E')] bg-[length:20px] bg-[right_1.25rem_center] bg-no-repeat`}
                      >
                        <option value="">Choose a topic</option>
                        <option value="early-access">Early Access</option>
                        <option value="enterprise">Enterprise Solutions</option>
                        <option value="support">Technical Support</option>
                        <option value="billing">Billing Inquiry</option>
                        <option value="other">General Question</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-black text-muted uppercase tracking-[0.2em] ml-1">
                        Your Message
                      </label>
                      <textarea
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        rows={5}
                        placeholder="Tell us about your goals…"
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      type="submit"
                      className="w-full py-5 rounded-2xl bg-accent text-white font-heading font-black text-lg shadow-xl shadow-accent/20 hover:bg-accent/90 transition-all duration-300"
                    >
                      Send Message →
                    </motion.button>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5 space-y-8"
          >
            <div className="space-y-4">
              {contactCards.map((c) => (
                <div
                  key={c.label}
                  className="p-8 rounded-3xl border border-border bg-white flex items-center gap-6 hover:border-accent/40 hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-accent/5 border border-accent/10 flex items-center justify-center text-2xl flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    {c.icon}
                  </div>
                  <div>
                    <p className="text-xs font-black text-muted uppercase tracking-[0.2em] mb-1">
                      {c.label}
                    </p>
                    <p className="text-light text-lg font-bold">
                      {c.value}
                    </p>
                    <p className="text-muted text-sm font-medium">{c.sub}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-8 rounded-[2rem] bg-light text-white relative overflow-hidden shadow-2xl shadow-light/20">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
              <p className="inline-block px-3 py-1 rounded-lg bg-white/10 text-[10px] font-black uppercase tracking-widest mb-4">
                Pro Tip
              </p>
              <h4 className="text-xl font-extrabold mb-3">Priority Support</h4>
              <p className="text-white/80 text-sm font-medium leading-relaxed">
                Mention your target company and interview date in your message.
                We'll prioritize your request to ensure you're ready in time.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="py-32 px-6 border-t border-border bg-surface">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-20"
          >
            <span className="text-accent text-xs font-black uppercase tracking-[0.3em] mb-4 block">Questions?</span>
            <h2 className="font-heading text-4xl md:text-5xl font-extrabold text-light tracking-tight">
              Common Questions
            </h2>
          </motion.div>

          <div className="space-y-4">
            {faqs.map((f, i) => (
              <motion.div
                key={f.q}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-3xl border border-border bg-white overflow-hidden shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-6 md:p-8 flex items-center justify-between text-left group"
                >
                  <h3 className="font-heading font-extrabold text-light text-lg md:text-xl pr-8">
                    {f.q}
                  </h3>
                  <div className={`w-8 h-8 rounded-full border border-border flex items-center justify-center flex-shrink-0 transition-all duration-300 ${openFaq === i ? 'bg-accent border-accent text-white rotate-45' : 'group-hover:border-accent text-muted'}`}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor">
                      <path d="M6 1V11M1 6H11" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="px-8 pb-8 text-muted text-base md:text-lg font-medium leading-relaxed border-t border-slate-50 pt-6 mx-2">
                        {f.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}