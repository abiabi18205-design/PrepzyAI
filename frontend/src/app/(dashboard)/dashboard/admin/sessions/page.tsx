// app/(dashboard)/dashboard/admin/sessions/page.tsx
"use client";

import { CalendarDaysIcon, ClockIcon, SparklesIcon } from "@heroicons/react/24/outline";

export default function AdminSessionsPage() {
    return (
        <div className="p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8 flex items-center gap-3">
                <div className="p-2.5 rounded-xl bg-[#a78bfa]/10 border border-[#a78bfa]/20">
                    <CalendarDaysIcon className="h-6 w-6 text-[#a78bfa]" />
                </div>
                <div>
                    <h1 className="font-heading text-3xl font-extrabold text-[#FFF5F2]">
                        Sessions
                    </h1>
                    <p className="text-[#9aabb8] text-sm mt-0.5">
                        Mock interview session management
                    </p>
                </div>
            </div>

            {/* Coming Soon Card */}
            <div className="rounded-2xl border border-[#2a3a4a] bg-[#1B2838] overflow-hidden">
                <div className="px-6 py-16 flex flex-col items-center text-center">
                    <div className="relative mb-6">
                        <div className="w-20 h-20 rounded-2xl bg-[#a78bfa]/10 border border-[#a78bfa]/20 flex items-center justify-center">
                            <CalendarDaysIcon className="h-10 w-10 text-[#a78bfa]" />
                        </div>
                        <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-[#FF6B6B]/10 border border-[#FF6B6B]/30 flex items-center justify-center">
                            <SparklesIcon className="h-3 w-3 text-[#FF6B6B]" />
                        </div>
                    </div>

                    <h2 className="font-heading text-2xl font-extrabold text-[#FFF5F2] mb-2">
                        Sessions Coming Soon
                    </h2>
                    <p className="text-[#9aabb8] text-sm max-w-md leading-relaxed mb-8">
                        We&apos;re building a powerful sessions management panel where you can view,
                        monitor, and analyze all mock interview sessions run by users on the platform.
                    </p>

                    {/* Feature Preview */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-lg">
                        {[
                            {
                                icon: CalendarDaysIcon,
                                title: "Session History",
                                desc: "Browse all past mock interview sessions",
                                color: "text-[#a78bfa]",
                                bg: "bg-[#a78bfa]/10",
                                border: "border-[#a78bfa]/20",
                            },
                            {
                                icon: ClockIcon,
                                title: "Duration & Scores",
                                desc: "Track time spent and performance scores",
                                color: "text-[#6EE7B7]",
                                bg: "bg-[#6EE7B7]/10",
                                border: "border-[#6EE7B7]/20",
                            },
                            {
                                icon: SparklesIcon,
                                title: "AI Feedback",
                                desc: "View AI-generated feedback summaries",
                                color: "text-[#FFA07A]",
                                bg: "bg-[#FFA07A]/10",
                                border: "border-[#FFA07A]/20",
                            },
                        ].map((feat) => (
                            <div
                                key={feat.title}
                                className={`p-4 rounded-xl border ${feat.border} ${feat.bg} bg-opacity-50 text-left`}
                            >
                                <div className={`p-1.5 rounded-lg w-fit mb-2 ${feat.bg}`}>
                                    <feat.icon className={`h-4 w-4 ${feat.color}`} />
                                </div>
                                <p className={`text-xs font-mono font-bold mb-0.5 ${feat.color}`}>
                                    {feat.title}
                                </p>
                                <p className="text-xs text-[#9aabb8] leading-relaxed">{feat.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-8 flex items-center gap-2 text-xs text-[#9aabb8]/60 font-mono">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#FF6B6B] animate-pulse" />
                        In development
                    </div>
                </div>
            </div>
        </div>
    );
}
