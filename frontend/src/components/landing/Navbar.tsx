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
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-surface/90 backdrop-blur-xl">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M2 4h5v2H2zM2 8h8v2H2zM2 12h6v2H2z" fill="#FF6B6B" />
              <circle cx="12" cy="5" r="3" fill="#FF6B6B" opacity="0.4" />
              <circle cx="12" cy="5" r="1.5" fill="#FF6B6B" />
            </svg>
          </div>
          <span className="font-heading font-bold text-lg text-light">
            Prepzy<span className="text-accent">AI</span>
          </span>
        </Link>

        {/* Nav Links */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border
                ${
                  pathname === link.href
                    ? "bg-accent/10 text-accent border-accent/20"
                    : "text-muted hover:text-light hover:bg-white/5 border-transparent"
                }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* CTA Buttons */}
        <div className="flex items-center gap-3">
          {!loggedIn ? (
            // Show login/signup for unauthenticated users
            <>
              <Link
                href="/login"
                className="hidden sm:inline-block px-4 py-2 text-sm text-muted hover:text-light transition-colors font-body"
              >
                Sign in
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-xl bg-accent text-ink text-sm font-heading font-bold hover:bg-accent/90 transition-colors"
              >
                Get Early Access
              </Link>
            </>
          ) : (
            // Show user menu for authenticated users
            <div className="relative">
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                  <span className="text-accent text-sm font-mono font-bold">
                    {user?.name?.charAt(0).toUpperCase() || "U"}
                  </span>
                </div>
                <span className="hidden sm:inline-block text-sm text-light font-body">
                  {user?.name?.split(" ")[0] || "User"}
                </span>
                <svg
                  className={`w-4 h-4 text-muted transition-transform ${showDropdown ? "rotate-180" : ""}`}
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
                  <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border bg-surface shadow-lg z-50 overflow-hidden">
                    <div className="py-2">
                      <Link
                        href="/dashboard"
                        className="flex items-center gap-2 px-4 py-2 text-sm text-light hover:bg-white/5 transition-colors"
                        onClick={() => setShowDropdown(false)}
                      >
                        <UserCircleIcon className="w-4 h-4" />
                        Dashboard
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-400 hover:bg-red-500/10 transition-colors"
                      >
                        <ArrowRightOnRectangleIcon className="w-4 h-4" />
                        Sign out
                      </button>
                    </div>
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