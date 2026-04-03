"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerUser, saveToken } from "@/lib/api";

type FormState = {
  name: string;
  email: string;
  password: string;
  confirm: string;
  agreed: boolean;
};

export default function SignupPage() {
  const router = useRouter();
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    password: "",
    confirm: "",
    agreed: false,
  });
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password || !form.confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (form.password !== form.confirm) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (!form.agreed) {
      setError("Please agree to the Terms & Conditions.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const data = await registerUser(form.name, form.email, form.password);
      saveToken(data.data.token);
      localStorage.setItem("user", JSON.stringify(data.data.user));
      router.push("/onboarding");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignup = () => {
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  const inputClass =
    "w-full px-4 py-3 rounded-xl bg-[#1B2838] border border-[#2a3a4a] text-[#FFF5F2] placeholder-[#4a5a6a] text-sm outline-none focus:border-[#FF6B6B]/40 transition-colors";

  return (
    <div style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", background: "#0D1B2A" }}>

      {/* ── Left — Illustration ───────────────────────────────────────── */}
      <div style={{ background: "#1B2838", borderRight: "1px solid #2a3a4a", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "48px", position: "relative", overflow: "hidden" }}>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF6B6B]/20 bg-[#FF6B6B]/5 mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-pulse" />
          <span className="text-[#FF6B6B] text-xs font-mono">Live AI Interview Session</span>
        </div>

        <svg width="420" height="460" viewBox="0 0 300 340" fill="none" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid2" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,107,107,0.05)" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="300" height="340" fill="url(#grid2)" rx="16"/>
          <rect x="30" y="230" width="240" height="12" rx="4" fill="#2a3a4a"/>
          <rect x="60" y="242" width="8" height="50" rx="4" fill="#2a3a4a"/>
          <rect x="232" y="242" width="8" height="50" rx="4" fill="#2a3a4a"/>
          <rect x="70" y="200" width="160" height="34" rx="6" fill="#1B2838" stroke="#2a3a4a" strokeWidth="1"/>
          <rect x="80" y="206" width="140" height="22" rx="4" fill="#0D1B2A"/>
          <rect x="125" y="212" width="50" height="10" rx="3" fill="#2a3a4a"/>
          <rect x="75" y="80" width="150" height="125" rx="8" fill="#1B2838" stroke="#2a3a4a" strokeWidth="1"/>
          <rect x="82" y="87" width="136" height="111" rx="5" fill="#0D1B2A"/>
          <rect x="88" y="93" width="124" height="18" rx="4" fill="#1B2838"/>
          <circle cx="98" cy="102" r="6" fill="rgba(255,107,107,0.2)" stroke="rgba(255,107,107,0.4)" strokeWidth="1"/>
          <text x="96" y="105" fontFamily="monospace" fontSize="5" fill="#FF6B6B" textAnchor="middle">AI</text>
          <rect x="108" y="98" width="50" height="4" rx="2" fill="#2a3a4a"/>
          <rect x="108" y="105" width="35" height="3" rx="1.5" fill="#2a3a4a"/>
          <circle cx="200" cy="102" r="4" fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.5)" strokeWidth="1"/>
          <circle cx="200" cy="102" r="2" fill="#EF4444"/>
          <rect x="88" y="116" width="115" height="28" rx="6" fill="rgba(255,107,107,0.06)" stroke="rgba(255,107,107,0.15)" strokeWidth="0.5"/>
          <rect x="93" y="121" width="80" height="3" rx="1.5" fill="#FF6B6B" opacity="0.5"/>
          <rect x="93" y="127" width="95" height="3" rx="1.5" fill="#2a3a4a"/>
          <rect x="93" y="133" width="65" height="3" rx="1.5" fill="#2a3a4a"/>
          <rect x="97" y="150" width="105" height="20" rx="6" fill="rgba(255,255,255,0.04)" stroke="#2a3a4a" strokeWidth="0.5"/>
          <rect x="102" y="155" width="70" height="3" rx="1.5" fill="#9aabb8" opacity="0.5"/>
          <rect x="102" y="161" width="50" height="3" rx="1.5" fill="#2a3a4a"/>
          <rect x="88" y="175" width="124" height="18" rx="4" fill="#1B2838"/>
          <text x="91" y="182" fontFamily="monospace" fontSize="4" fill="#9aabb8">CONFIDENCE</text>
          <rect x="91" y="185" width="80" height="3" rx="1.5" fill="#2a3a4a"/>
          <rect x="91" y="185" width="68" height="3" rx="1.5" fill="#FF6B6B"/>
          <text x="174" y="188" fontFamily="monospace" fontSize="4" fill="#FF6B6B">85%</text>
          <rect x="75" y="198" width="150" height="4" rx="2" fill="#2a3a4a"/>
          <rect x="120" y="155" width="60" height="80" rx="8" fill="#1B2838" stroke="#2a3a4a" strokeWidth="1"/>
          <rect x="128" y="175" width="44" height="55" rx="8" fill="#1E293B"/>
          <path d="M150 175 L143 185 L150 182 L157 185 Z" fill="#2a3a4a"/>
          <path d="M128 185 Q108 195 100 215" stroke="#1E293B" strokeWidth="12" strokeLinecap="round" fill="none"/>
          <path d="M172 185 Q192 195 200 215" stroke="#1E293B" strokeWidth="12" strokeLinecap="round" fill="none"/>
          <ellipse cx="100" cy="218" rx="10" ry="7" fill="#F5CBA7"/>
          <ellipse cx="200" cy="218" rx="10" ry="7" fill="#F5CBA7"/>
          <ellipse cx="150" cy="150" rx="24" ry="25" fill="#F5CBA7"/>
          <ellipse cx="150" cy="133" rx="24" ry="13" fill="#2C1810"/>
          <rect x="126" y="133" width="48" height="10" fill="#2C1810"/>
          <ellipse cx="142" cy="150" rx="3.5" ry="4" fill="white"/>
          <ellipse cx="158" cy="150" rx="3.5" ry="4" fill="white"/>
          <ellipse cx="142" cy="153" rx="2" ry="2.5" fill="#1a1a2e"/>
          <ellipse cx="158" cy="153" rx="2" ry="2.5" fill="#1a1a2e"/>
          <circle cx="142.8" cy="152" r="0.8" fill="white"/>
          <circle cx="158.8" cy="152" r="0.8" fill="white"/>
          <path d="M138 144 Q142 143 146 144" stroke="#2C1810" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M154 144 Q158 143 162 144" stroke="#2C1810" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <path d="M149 155 Q147 160 150 161 Q153 160 151 155" stroke="#D4A57A" strokeWidth="1" fill="none"/>
          <path d="M144 165 Q150 168 156 165" stroke="#C8956A" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
          <ellipse cx="126" cy="152" rx="4" ry="6" fill="#F5CBA7"/>
          <ellipse cx="174" cy="152" rx="4" ry="6" fill="#F5CBA7"/>
          <path d="M127 137 Q150 120 173 137" stroke="#FF6B6B" strokeWidth="3" strokeLinecap="round" fill="none"/>
          <rect x="122" y="145" width="10" height="14" rx="5" fill="#FF6B6B" opacity="0.8"/>
          <rect x="168" y="145" width="10" height="14" rx="5" fill="#FF6B6B" opacity="0.8"/>
          <rect x="210" y="85" width="78" height="55" rx="8" fill="#1B2838" stroke="rgba(255,107,107,0.3)" strokeWidth="0.8"/>
          <text x="218" y="97" fontFamily="monospace" fontSize="5" fill="#FF6B6B">LIVE SCORE</text>
          <text x="218" y="114" fontFamily="'Syne',sans-serif" fontSize="20" fontWeight="800" fill="#FF6B6B">94%</text>
          <rect x="218" y="119" width="55" height="3" rx="1.5" fill="#2a3a4a"/>
          <rect x="218" y="119" width="52" height="3" rx="1.5" fill="#FF6B6B" opacity="0.6"/>
          <text x="218" y="133" fontFamily="monospace" fontSize="4" fill="#9aabb8">Top 8% of candidates</text>
          <rect x="12" y="155" width="72" height="46" rx="8" fill="#1B2838" stroke="rgba(255,160,122,0.3)" strokeWidth="0.8"/>
          <text x="20" y="167" fontFamily="monospace" fontSize="5" fill="#FFA07A">AI TIP</text>
          <rect x="20" y="172" width="55" height="3" rx="1.5" fill="#2a3a4a"/>
          <rect x="20" y="172" width="40" height="3" rx="1.5" fill="#FFA07A" opacity="0.5"/>
          <rect x="20" y="178" width="55" height="3" rx="1.5" fill="#2a3a4a"/>
          <rect x="20" y="178" width="50" height="3" rx="1.5" fill="#FFA07A" opacity="0.4"/>
          <text x="20" y="196" fontFamily="monospace" fontSize="4" fill="#9aabb8">Use STAR method</text>
          <rect x="88" y="276" width="4" height="8" rx="2" fill="#FF6B6B" opacity="0.4"/>
          <rect x="95" y="273" width="4" height="14" rx="2" fill="#FF6B6B" opacity="0.7"/>
          <rect x="102" y="270" width="4" height="20" rx="2" fill="#FF6B6B"/>
          <rect x="109" y="274" width="4" height="12" rx="2" fill="#FF6B6B" opacity="0.8"/>
          <rect x="116" y="277" width="4" height="6" rx="2" fill="#FF6B6B" opacity="0.5"/>
          <rect x="123" y="272" width="4" height="16" rx="2" fill="#FF6B6B" opacity="0.9"/>
          <rect x="130" y="275" width="4" height="10" rx="2" fill="#FF6B6B" opacity="0.6"/>
          <rect x="137" y="271" width="4" height="18" rx="2" fill="#FF6B6B"/>
          <rect x="144" y="276" width="4" height="8" rx="2" fill="#FF6B6B" opacity="0.4"/>
          <text x="153" y="283" fontFamily="monospace" fontSize="6" fill="#FF6B6B">Speaking...</text>
        </svg>

        <div className="mt-6 text-center max-w-sm">
          <p className="text-[#9aabb8] text-sm font-body leading-relaxed italic">
            &ldquo;MockPilotAI helped me land my dream job at Google. The AI feedback was incredibly detailed.&rdquo;
          </p>
          <p className="text-[#FF6B6B] text-xs font-mono mt-2">— Sarah K., Software Engineer</p>
        </div>
      </div>

      {/* ── Right — Form ─────────────────────────────────────────────── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", background: "#0D1B2A", padding: "48px" }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          <div className="flex justify-center mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h5v2H2zM2 8h8v2H2zM2 12h6v2H2z" fill="#FF6B6B" />
                  <circle cx="12" cy="5" r="3" fill="#FF6B6B" opacity="0.4" />
                  <circle cx="12" cy="5" r="1.5" fill="#FF6B6B" />
                </svg>
              </div>
              <span className="font-heading font-bold text-lg text-[#FFF5F2]">
                Mock<span className="text-[#FF6B6B]">Pilot</span>
                <span className="text-[#9aabb8] font-normal text-sm ml-0.5">AI</span>
              </span>
            </Link>
          </div>

          <div className="text-center mb-6">
            <h1 className="font-heading text-3xl font-extrabold text-[#FFF5F2] mb-2">
              Create your account
            </h1>
            <p className="text-[#9aabb8] font-body text-sm leading-relaxed">
              Start your interview preparation journey today. Free forever.
            </p>
          </div>

          {submitted ? (
            <div className="flex flex-col items-center justify-center text-center p-10 rounded-2xl border border-[#FF6B6B]/20 bg-[#FF6B6B]/5">
              <div className="w-16 h-16 rounded-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/30 flex items-center justify-center mb-4 text-[#FF6B6B] text-2xl">
                ✓
              </div>
              <h3 className="font-heading text-xl font-extrabold text-[#FFF5F2] mb-2">
                Account Created!
              </h3>
              <p className="text-[#9aabb8] font-body text-sm leading-relaxed max-w-xs">
                Welcome, <span className="text-[#FFF5F2]">{form.name}</span>! Your account has been created successfully.
              </p>
              <Link
                href="/login"
                className="mt-6 px-6 py-3 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold text-sm hover:bg-[#FFA07A] transition-all"
              >
                Go to Sign in
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">

              {error && (
                <p className="text-red-400 text-sm font-body bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-3 text-center">
                  {error}
                </p>
              )}

              <div>
                <label className="text-xs text-[#9aabb8] font-mono uppercase tracking-wider block mb-2">
                  Full Name
                </label>
                <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="Jane Smith" className={inputClass} />
              </div>

              <div>
                <label className="text-xs text-[#9aabb8] font-mono uppercase tracking-wider block mb-2">
                  Email Address
                </label>
                <input type="email" name="email" value={form.email} onChange={handleChange} placeholder="jane@example.com" className={inputClass} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-[#9aabb8] font-mono uppercase tracking-wider block mb-2">
                    Password
                  </label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} placeholder="••••••••" className={inputClass} />
                </div>
                <div>
                  <label className="text-xs text-[#9aabb8] font-mono uppercase tracking-wider block mb-2">
                    Confirm
                  </label>
                  <input type="password" name="confirm" value={form.confirm} onChange={handleChange} placeholder="••••••••" className={inputClass} />
                </div>
              </div>

              <p className="text-[#9aabb8] text-xs font-mono">Must be at least 6 characters</p>

              <div className="flex items-start gap-3">
                <input
                  type="checkbox"
                  name="agreed"
                  id="agreed"
                  checked={form.agreed}
                  onChange={handleChange}
                  className="mt-0.5 w-4 h-4 rounded border border-[#2a3a4a] bg-[#1B2838] accent-[#FF6B6B] cursor-pointer"
                />
                <label htmlFor="agreed" className="text-sm text-[#9aabb8] font-body cursor-pointer leading-relaxed">
                  I agree to the{" "}
                  <a href="#" className="text-[#FF6B6B] hover:text-[#FFA07A] transition-colors">Terms & Conditions</a>
                  {" "}and{" "}
                  <a href="#" className="text-[#FF6B6B] hover:text-[#FFA07A] transition-colors">Privacy Policy</a>
                </label>
              </div>

              <button type="submit" disabled={loading}
                className="w-full py-3.5 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold text-sm hover:bg-[#FFA07A] transition-all hover:scale-[1.01] duration-200 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100">
                {loading ? "Creating Account..." : "Create Account →"}
              </button>

              <div className="flex items-center gap-4">
                <div className="flex-1 h-px bg-[#2a3a4a]" />
                <span className="text-[#9aabb8] text-xs font-mono">or</span>
                <div className="flex-1 h-px bg-[#2a3a4a]" />
              </div>

              <button type="button" onClick={handleGoogleSignup}
                className="w-full py-3.5 rounded-xl border border-[#2a3a4a] bg-transparent text-[#FFF5F2] font-body text-sm hover:bg-white/5 hover:border-[#FF6B6B]/20 transition-all flex items-center justify-center gap-3">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                  <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                  <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
                  <path d="M3.964 10.707A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.039l3.007-2.332z" fill="#FBBC05"/>
                  <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.961L3.964 7.293C4.672 5.166 6.656 3.58 9 3.58z" fill="#EA4335"/>
                </svg>
                Continue with Google
              </button>

            </form>
          )}

          <p className="mt-6 text-center text-sm text-[#9aabb8] font-body">
            Already have an account?{" "}
            <Link href="/login" className="text-[#FF6B6B] hover:text-[#FFA07A] transition-colors font-medium">
              Sign in
            </Link>
          </p>

        </div>
      </div>

    </div>
  );
}