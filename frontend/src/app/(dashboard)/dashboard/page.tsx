// app/(dashboard)/dashboard/page.tsx
"use client";

import { useEffect, useState } from "react";
import { getToken } from "@/lib/api";
import Link from "next/link";
import { 
  ChartBarIcon, 
  ClockIcon, 
  TrophyIcon, 
  ArrowTrendingUpIcon 
} from "@heroicons/react/24/outline";

interface DashboardStats {
  totalInterviews: number;
  averageScore: number;
  questionsAnswered: number;
  streak: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalInterviews: 0,
    averageScore: 0,
    questionsAnswered: 0,
    streak: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = getToken();
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/dashboard/stats`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error("Failed to fetch stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    {
      title: "Total Interviews",
      value: stats.totalInterviews,
      icon: ChartBarIcon,
      color: "text-[#FF6B6B]",
      bgColor: "bg-[#FF6B6B]/10",
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: TrophyIcon,
      color: "text-[#FFA07A]",
      bgColor: "bg-[#FFA07A]/10",
    },
    {
      title: "Questions Answered",
      value: stats.questionsAnswered,
      icon: ClockIcon,
      color: "text-[#6EE7B7]",
      bgColor: "bg-[#6EE7B7]/10",
    },
    {
      title: "Day Streak",
      value: `${stats.streak} days`,
      icon: ArrowTrendingUpIcon,
      color: "text-[#a78bfa]",
      bgColor: "bg-[#a78bfa]/10",
    },
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-[#FFF5F2] mb-2">
          Welcome back! 👋
        </h1>
        <p className="text-[#9aabb8] font-body">
          Ready to ace your next interview? Let's continue your preparation journey.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => (
          <div
            key={stat.title}
            className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838] hover:border-[#FF6B6B]/20 transition-all"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-2 rounded-xl ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <div className="font-heading text-2xl font-bold text-[#FFF5F2] mb-1">
              {loading ? "..." : stat.value}
            </div>
            <div className="text-[#9aabb8] text-sm font-body">{stat.title}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-gradient-to-br from-[#FF6B6B]/5 to-transparent">
          <h3 className="font-heading text-xl font-bold text-[#FFF5F2] mb-2">
            Start a Practice Session
          </h3>
          <p className="text-[#9aabb8] font-body mb-4">
            Simulate a real interview with our AI interviewer and get instant feedback.
          </p>
          <Link
            href="/dashboard/practice"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold text-sm hover:bg-[#FFA07A] transition-all"
          >
            Start Now →
          </Link>
        </div>

        <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-gradient-to-br from-[#6EE7B7]/5 to-transparent">
          <h3 className="font-heading text-xl font-bold text-[#FFF5F2] mb-2">
            Browse Questions
          </h3>
          <p className="text-[#9aabb8] font-body mb-4">
            Explore our extensive question bank with 10,000+ role-specific questions.
          </p>
          <Link
            href="/dashboard/questions"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#FF6B6B] text-[#FF6B6B] font-heading font-bold text-sm hover:bg-[#FF6B6B]/10 transition-all"
          >
            Browse →
          </Link>
        </div>
      </div>
    </div>
  );
}