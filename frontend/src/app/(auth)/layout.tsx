// frontend/src/app/(auth)/layout.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";
  const isSignup = pathname === "/signup";

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      {/* Simple Navbar for Auth Pages */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0D1B2A]/95 backdrop-blur-xl border-b border-[#2a3a4a]">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Logo - links back to home */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h5v2H2zM2 8h8v2H2zM2 12h6v2H2z" fill="#FF6B6B" />
                <circle cx="12" cy="5" r="3" fill="#FF6B6B" opacity="0.4" />
              </svg>
            </div>
            <span className="font-heading font-extrabold text-xl text-[#FFF5F2]">
              Mock<span className="text-[#FF6B6B]">Pilot</span>AI
            </span>
          </Link>

          {/* Switch between Login and Signup */}
          <div className="flex items-center gap-4">
            {isLogin ? (
              <Link
                href="/signup"
                className="px-5 py-2 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold text-sm hover:bg-[#FFA07A] transition-all"
              >
                Create Account
              </Link>
            ) : isSignup ? (
              <Link
                href="/login"
                className="px-5 py-2 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold text-sm hover:bg-[#FFA07A] transition-all"
              >
                Sign In
              </Link>
            ) : null}
          </div>
        </div>
      </nav>

      {/* Main Content - pt-20 prevents content from hiding under navbar */}
      <main className="pt-20">
        {children}
      </main>
    </div>
  );
}