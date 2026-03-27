// app/(dashboard)/dashboard/admin/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    UsersIcon,
    QuestionMarkCircleIcon,
    ShieldCheckIcon,
    CalendarDaysIcon,
    ArrowTrendingUpIcon,
    ClockIcon,
} from "@heroicons/react/24/outline";
import { getAdminUsers, getQuestions } from "@/lib/api";

interface AdminStats {
    totalUsers: number;
    adminUsers: number;
    totalQuestions: number;
    byDifficulty: { Easy: number; Medium: number; Hard: number };
    byCategory: Record<string, number>;
}

interface RecentUser {
    _id: string;
    name: string;
    email: string;
    role: string;
    createdAt: string;
}

export default function AdminOverviewPage() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [recentUsers, setRecentUsers] = useState<RecentUser[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [usersRes, questionsRes] = await Promise.all([
                    getAdminUsers(),
                    getQuestions({ limit: 1000 }),
                ]);

                const users: RecentUser[] = usersRes.data?.users ?? [];
                const questions = questionsRes.data?.questions ?? [];

                const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };
                const byCategory: Record<string, number> = {};
                questions.forEach((q: any) => {
                    if (q.difficulty in byDifficulty) {
                        byDifficulty[q.difficulty as keyof typeof byDifficulty]++;
                    }
                    byCategory[q.category] = (byCategory[q.category] ?? 0) + 1;
                });

                setStats({
                    totalUsers: users.length,
                    adminUsers: users.filter((u) => u.role === "admin").length,
                    totalQuestions: questions.length,
                    byDifficulty,
                    byCategory,
                });

                // Last 5 users by createdAt
                setRecentUsers(
                    [...users]
                        .sort(
                            (a, b) =>
                                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        )
                        .slice(0, 5)
                );
            } catch (err) {
                console.error("Failed to fetch admin stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const statCards = [
        {
            title: "Total Users",
            value: stats?.totalUsers ?? 0,
            sub: `${stats?.adminUsers ?? 0} admin(s)`,
            icon: UsersIcon,
            color: "text-[#FF6B6B]",
            bg: "bg-[#FF6B6B]/10",
            href: "/dashboard/admin/users",
        },
        {
            title: "Total Questions",
            value: stats?.totalQuestions ?? 0,
            sub: "in question bank",
            icon: QuestionMarkCircleIcon,
            color: "text-[#6EE7B7]",
            bg: "bg-[#6EE7B7]/10",
            href: "/dashboard/admin/questions",
        },
        {
            title: "Easy / Medium / Hard",
            value: stats
                ? `${stats.byDifficulty.Easy} / ${stats.byDifficulty.Medium} / ${stats.byDifficulty.Hard}`
                : "—",
            sub: "question difficulty split",
            icon: ArrowTrendingUpIcon,
            color: "text-[#a78bfa]",
            bg: "bg-[#a78bfa]/10",
            href: "/dashboard/admin/questions",
        },
        {
            title: "Sessions",
            value: "—",
            sub: "coming soon",
            icon: CalendarDaysIcon,
            color: "text-[#FFA07A]",
            bg: "bg-[#FFA07A]/10",
            href: "/dashboard/admin/sessions",
        },
    ];

    const difficultyColors: Record<string, string> = {
        Easy: "text-[#6EE7B7] bg-[#6EE7B7]/10 border-[#6EE7B7]/20",
        Medium: "text-[#FFA07A] bg-[#FFA07A]/10 border-[#FFA07A]/20",
        Hard: "text-[#FF6B6B] bg-[#FF6B6B]/10 border-[#FF6B6B]/20",
    };

    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20">
                    <ShieldCheckIcon className="h-6 w-6 text-[#FF6B6B]" />
                </div>
                <div>
                    <h1 className="font-heading text-3xl font-extrabold text-[#FFF5F2]">
                        Admin Overview
                    </h1>
                    <p className="text-[#9aabb8] text-sm font-body mt-0.5">
                        Platform-wide statistics and management
                    </p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {statCards.map((card) => (
                    <Link
                        key={card.title}
                        href={card.href}
                        className="p-5 rounded-2xl border border-[#2a3a4a] bg-[#1B2838] hover:border-[#FF6B6B]/30 hover:bg-[#1f2f40] transition-all group"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-2 rounded-xl ${card.bg}`}>
                                <card.icon className={`h-5 w-5 ${card.color}`} />
                            </div>
                            <span className="text-[#9aabb8] text-xs group-hover:text-[#FF6B6B] transition-colors">
                                →
                            </span>
                        </div>
                        <div className="font-heading text-2xl font-bold text-[#FFF5F2] mb-1">
                            {loading ? (
                                <div className="h-7 w-16 bg-[#2a3a4a] rounded animate-pulse" />
                            ) : (
                                card.value
                            )}
                        </div>
                        <div className="text-[#9aabb8] text-xs font-body">{card.title}</div>
                        <div className="text-[#9aabb8]/60 text-xs mt-0.5">{card.sub}</div>
                    </Link>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Users */}
                <div className="rounded-2xl border border-[#2a3a4a] bg-[#1B2838] overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a3a4a]">
                        <div className="flex items-center gap-2">
                            <UsersIcon className="h-4 w-4 text-[#FF6B6B]" />
                            <h2 className="font-heading font-bold text-[#FFF5F2] text-sm">
                                Recent Users
                            </h2>
                        </div>
                        <Link
                            href="/dashboard/admin/users"
                            className="text-xs text-[#FF6B6B] hover:text-[#FFA07A] transition-colors"
                        >
                            View all →
                        </Link>
                    </div>
                    <div className="divide-y divide-[#2a3a4a]">
                        {loading ? (
                            Array.from({ length: 4 }).map((_, i) => (
                                <div key={i} className="px-5 py-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#2a3a4a] animate-pulse flex-shrink-0" />
                                    <div className="flex-1 space-y-1.5">
                                        <div className="h-3 bg-[#2a3a4a] rounded animate-pulse w-32" />
                                        <div className="h-2.5 bg-[#2a3a4a] rounded animate-pulse w-44" />
                                    </div>
                                </div>
                            ))
                        ) : recentUsers.length === 0 ? (
                            <div className="px-5 py-8 text-center text-[#9aabb8] text-sm">
                                No users found
                            </div>
                        ) : (
                            recentUsers.map((u) => (
                                <div key={u._id} className="px-5 py-3 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/30 flex items-center justify-center flex-shrink-0">
                                        <span className="text-[#FF6B6B] text-xs font-mono font-bold">
                                            {u.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-[#FFF5F2] font-medium truncate">
                                            {u.name}
                                        </p>
                                        <p className="text-xs text-[#9aabb8] truncate">{u.email}</p>
                                    </div>
                                    <span
                                        className={`text-xs px-2 py-0.5 rounded-full border font-mono ${u.role === "admin"
                                                ? "text-[#FF6B6B] bg-[#FF6B6B]/10 border-[#FF6B6B]/20"
                                                : "text-[#9aabb8] bg-white/5 border-[#2a3a4a]"
                                            }`}
                                    >
                                        {u.role}
                                    </span>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Category Breakdown */}
                <div className="rounded-2xl border border-[#2a3a4a] bg-[#1B2838] overflow-hidden">
                    <div className="flex items-center justify-between px-5 py-4 border-b border-[#2a3a4a]">
                        <div className="flex items-center gap-2">
                            <QuestionMarkCircleIcon className="h-4 w-4 text-[#6EE7B7]" />
                            <h2 className="font-heading font-bold text-[#FFF5F2] text-sm">
                                Questions by Category
                            </h2>
                        </div>
                        <Link
                            href="/dashboard/admin/questions"
                            className="text-xs text-[#FF6B6B] hover:text-[#FFA07A] transition-colors"
                        >
                            Manage →
                        </Link>
                    </div>
                    <div className="px-5 py-4 space-y-3">
                        {loading ? (
                            Array.from({ length: 5 }).map((_, i) => (
                                <div key={i} className="flex items-center gap-3">
                                    <div className="h-3 bg-[#2a3a4a] rounded animate-pulse w-24" />
                                    <div className="flex-1 h-2 bg-[#2a3a4a] rounded animate-pulse" />
                                    <div className="h-3 bg-[#2a3a4a] rounded animate-pulse w-6" />
                                </div>
                            ))
                        ) : stats && Object.keys(stats.byCategory).length > 0 ? (
                            Object.entries(stats.byCategory)
                                .sort(([, a], [, b]) => b - a)
                                .map(([cat, count]) => {
                                    const pct =
                                        stats.totalQuestions > 0
                                            ? Math.round((count / stats.totalQuestions) * 100)
                                            : 0;
                                    return (
                                        <div key={cat}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className="text-xs text-[#9aabb8] font-mono">
                                                    {cat}
                                                </span>
                                                <span className="text-xs text-[#FFF5F2] font-mono">
                                                    {count}
                                                </span>
                                            </div>
                                            <div className="h-1.5 bg-[#2a3a4a] rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-gradient-to-r from-[#FF6B6B] to-[#FFA07A] rounded-full transition-all duration-700"
                                                    style={{ width: `${pct}%` }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                        ) : (
                            <div className="py-6 text-center text-[#9aabb8] text-sm">
                                No questions yet
                            </div>
                        )}

                        {/* Difficulty badges */}
                        {stats && stats.totalQuestions > 0 && (
                            <div className="flex gap-2 mt-4 pt-4 border-t border-[#2a3a4a]">
                                {(["Easy", "Medium", "Hard"] as const).map((d) => (
                                    <span
                                        key={d}
                                        className={`text-xs px-2.5 py-1 rounded-full border font-mono ${difficultyColors[d]}`}
                                    >
                                        {d}: {stats.byDifficulty[d]}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Links */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                    {
                        title: "Manage Users",
                        desc: "Update roles, remove accounts",
                        href: "/dashboard/admin/users",
                        icon: UsersIcon,
                        color: "from-[#FF6B6B]/10",
                    },
                    {
                        title: "Manage Questions",
                        desc: "Add, edit or delete questions",
                        href: "/dashboard/admin/questions",
                        icon: QuestionMarkCircleIcon,
                        color: "from-[#6EE7B7]/10",
                    },
                    {
                        title: "Sessions",
                        desc: "View mock interview sessions",
                        href: "/dashboard/admin/sessions",
                        icon: ClockIcon,
                        color: "from-[#a78bfa]/10",
                    },
                ].map((link) => (
                    <Link
                        key={link.title}
                        href={link.href}
                        className={`p-5 rounded-2xl border border-[#2a3a4a] bg-gradient-to-br ${link.color} to-transparent hover:border-[#FF6B6B]/30 transition-all group`}
                    >
                        <link.icon className="h-6 w-6 text-[#9aabb8] group-hover:text-[#FF6B6B] transition-colors mb-3" />
                        <h3 className="font-heading font-bold text-[#FFF5F2] text-sm mb-1">
                            {link.title}
                        </h3>
                        <p className="text-xs text-[#9aabb8]">{link.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
}
