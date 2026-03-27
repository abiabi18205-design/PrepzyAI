// app/(dashboard)/layout.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  HomeIcon,
  BookOpenIcon,
  MicrophoneIcon,
  ChartBarIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
  ShieldCheckIcon,
  UsersIcon,
  QuestionMarkCircleIcon,
  CalendarDaysIcon
} from "@heroicons/react/24/outline";
import { getToken, removeToken } from "@/lib/api";

const navigation = [
  { name: "Overview", href: "/dashboard", icon: HomeIcon },
  { name: "Practice", href: "/dashboard/practice", icon: MicrophoneIcon },
  { name: "Question Bank", href: "/dashboard/questions", icon: BookOpenIcon },
  { name: "Results", href: "/dashboard/results", icon: ChartBarIcon },
  { name: "Profile", href: "/dashboard/profile", icon: UserCircleIcon },
  { name: "Settings", href: "/dashboard/settings", icon: Cog6ToothIcon },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = getToken();

      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (data.success) {
          setUser(data.data.user);
        } else {
          // Token invalid or expired
          removeToken();
          router.push("/login");
        }
      } catch (error) {
        console.error("Auth verification failed:", error);
        removeToken();
        router.push("/login");
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      const token = getToken();
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      removeToken();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
      removeToken();
      router.push("/login");
    }
  };

  // Show loading state while verifying auth
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B] mx-auto mb-4"></div>
          <p className="text-[#9aabb8] text-sm">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // If no user after loading, don't render dashboard
  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A]">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform bg-[#1B2838] border-r border-[#2a3a4a] transition-transform duration-200 ease-in-out lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between px-6 border-b border-[#2a3a4a]">
          <Link href="/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 flex items-center justify-center group-hover:bg-[#FF6B6B]/20 transition-colors">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h5v2H2zM2 8h8v2H2zM2 12h6v2H2z" fill="#FF6B6B" />
                <circle cx="12" cy="5" r="3" fill="#FF6B6B" opacity="0.4" />
                <circle cx="12" cy="5" r="1.5" fill="#FF6B6B" />
              </svg>
            </div>
            <span className="font-heading font-bold text-lg text-[#FFF5F2]">
              Prepzy<span className="text-[#FF6B6B]">AI</span>
            </span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-[#9aabb8] hover:text-[#FFF5F2] transition-colors"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="mt-6 px-3">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ${isActive
                    ? "bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/20"
                    : "text-[#9aabb8] hover:text-[#FFF5F2] hover:bg-white/5"
                  }`}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            );
          })}

          {/* Admin Section */}
          {user?.role === "admin" && (
            <div className="mt-6">
              <div className="flex items-center gap-2 px-3 mb-2">
                <ShieldCheckIcon className="h-3.5 w-3.5 text-[#FF6B6B]/60" />
                <p className="text-xs font-mono font-semibold uppercase tracking-widest text-[#FF6B6B]/60">
                  Admin
                </p>
              </div>
              {[
                { name: "Overview", href: "/dashboard/admin", icon: ShieldCheckIcon },
                { name: "Users", href: "/dashboard/admin/users", icon: UsersIcon },
                { name: "Questions", href: "/dashboard/admin/questions", icon: QuestionMarkCircleIcon },
                { name: "Sessions", href: "/dashboard/admin/sessions", icon: CalendarDaysIcon },
              ].map((item) => {
                const isActive = pathname === item.href || (item.href !== "/dashboard/admin" && pathname.startsWith(item.href));
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 mb-1 ${isActive
                        ? "bg-[#FF6B6B]/10 text-[#FF6B6B] border border-[#FF6B6B]/20"
                        : "text-[#9aabb8] hover:text-[#FFF5F2] hover:bg-white/5"
                      }`}
                  >
                    <item.icon className="h-5 w-5" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#2a3a4a] bg-[#1B2838]">
          <div className="flex items-center gap-3 px-2 py-2">
            <div className="w-8 h-8 rounded-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/30 flex items-center justify-center flex-shrink-0">
              <span className="text-[#FF6B6B] text-sm font-mono font-bold">
                {user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[#FFF5F2] truncate">
                {user.name}
              </p>
              <p className="text-xs text-[#9aabb8] truncate font-mono">
                {user.role === "admin" ? "Administrator" : "Premium User"}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 rounded-lg hover:bg-white/5 text-[#9aabb8] hover:text-[#FF6B6B] transition-colors"
              title="Logout"
            >
              <ArrowRightOnRectangleIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Mobile header */}
        <div className="lg:hidden fixed top-0 left-0 right-0 z-30 bg-[#1B2838]/90 backdrop-blur-xl border-b border-[#2a3a4a] px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-lg hover:bg-white/5 text-[#9aabb8] transition-colors"
            >
              <Bars3Icon className="h-6 w-6" />
            </button>
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 16 16" fill="none">
                  <path d="M2 4h5v2H2zM2 8h8v2H2zM2 12h6v2H2z" fill="#FF6B6B" />
                  <circle cx="12" cy="5" r="3" fill="#FF6B6B" opacity="0.4" />
                  <circle cx="12" cy="5" r="1.5" fill="#FF6B6B" />
                </svg>
              </div>
              <span className="font-heading font-bold text-sm text-[#FFF5F2]">
                Prepzy<span className="text-[#FF6B6B]">AI</span>
              </span>
            </Link>
            <div className="w-8" /> {/* Spacer for alignment */}
          </div>
        </div>

        {/* Content with padding for mobile header */}
        <main className="pt-16 lg:pt-0 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}