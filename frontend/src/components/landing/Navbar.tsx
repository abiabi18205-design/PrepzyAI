// components/landing/Navbar.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { isLoggedIn, getToken, getUserFromCache, removeToken } from "@/lib/api";
import { UserCircleIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    // Check login status on mount and when route changes
    const checkAuth = () => {
      const isAuth = isLoggedIn();
      setLoggedIn(isAuth);

      if (isAuth) {
        const cachedUser = getUserFromCache();
        if (cachedUser) {
          setUser(cachedUser);
        } else {
          // Fetch user if not in cache
          const fetchUser = async () => {
            try {
              const token = getToken();
              const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              });
              const data = await response.json();
              if (data.success) {
                setUser(data.data.user);
                localStorage.setItem("user", JSON.stringify(data.data.user));
              }
            } catch (error) {
              console.error("Failed to fetch user:", error);
            }
          };
          fetchUser();
        }
      }
    };

    checkAuth();
  }, [pathname]);

  const handleLogout = async () => {
    try {
      const token = getToken();
      if (token) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      removeToken();
      localStorage.removeItem("user");
      setLoggedIn(false);
      setUser(null);
      setShowDropdown(false);
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      removeToken();
      localStorage.removeItem("user");
      router.push("/");
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-white/70 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center group-hover:bg-accent/20 transition-all duration-300">
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h5v2H2zM2 8h8v2H2zM2 12h6v2H2z" fill="#FF6B6B" />
              <circle cx="12" cy="5" r="3" fill="#FF6B6B" opacity="0.4" />
              <circle cx="12" cy="5" r="1.5" fill="#FF6B6B" />
            </svg>
          </div>
          <span className="font-heading font-extrabold text-xl tracking-tight text-light">
            Prepzy<span className="text-accent">AI</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-300
                ${pathname === link.href
                  ? "text-accent bg-accent/5"
                  : "text-muted hover:text-light hover:bg-black/5"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-4">
          {!loggedIn ? (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-block text-sm font-semibold text-muted hover:text-light transition-colors font-body"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2.5 rounded-xl bg-accent text-white text-sm font-heading font-bold shadow-lg shadow-accent/20 hover:bg-accent/90 hover:scale-[1.02] transition-all duration-300"
              >
                Get Early Access
              </Link>
            </>
          ) : (
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-2 py-2 rounded-xl hover:bg-black/5 transition-all duration-300"
              >
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center overflow-hidden">
                  <span className="text-accent text-sm font-mono font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <span className="hidden sm:inline-block text-sm font-semibold text-light font-body">
                  {user?.name?.split(" ")[0] || "User"}
                </span>
                <svg
                  className={`w-4 h-4 text-muted transition-transform duration-300 ${showDropdown ? "rotate-180" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {showDropdown && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowDropdown(false)}
                  />
                  <div className="absolute right-0 mt-3 w-52 rounded-2xl border border-border bg-white shadow-xl z-50 overflow-hidden py-2 animate-in fade-in slide-in-from-top-2 duration-300">
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-light hover:bg-accent/5 hover:text-accent transition-all duration-200"
                      onClick={() => setShowDropdown(false)}
                    >
                      <UserCircleIcon className="w-5 h-5 opacity-70" />
                      Dashboard
                    </Link>
                    <div className="h-px bg-border my-1 mx-2" />
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm font-medium text-red-500 hover:bg-red-50 transition-all duration-200"
                    >
                      <ArrowRightOnRectangleIcon className="w-5 h-5 opacity-70" />
                      Sign out
                    </button>
                  </div>
                </>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Mobile Menu Button - Optional */}
      <div className="md:hidden absolute right-4 top-4">
        {/* You can add a mobile menu button here if needed */}
      </div>
    </header>
  );
}