// app/(dashboard)/dashboard/practice/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  MicrophoneIcon,
  ComputerDesktopIcon,
  AcademicCapIcon,
  BuildingOfficeIcon,
  ChartBarIcon,
  ClockIcon,
  ArrowPathIcon,
  PlayIcon,
  BookOpenIcon,
  SparklesIcon,
} from "@heroicons/react/24/outline";

interface PracticeSession {
  id: string;
  title: string;
  description: string;
  duration: number;
  questions: number;
  difficulty: "Easy" | "Medium" | "Hard" | "Mixed";
  category: string;
  icon: any;
}

interface Category {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
}

const SESSION_TEMPLATES: PracticeSession[] = [
  {
    id: "technical__Medium__5",
    title: "Frontend Developer Interview",
    description: "Practice with React, JavaScript, CSS, and frontend architecture questions",
    duration: 45,
    questions: 5,
    difficulty: "Medium",
    category: "technical",
    icon: ComputerDesktopIcon,
  },
  {
    id: "behavioral__Easy__5",
    title: "Behavioral Interview",
    description: "Common behavioral questions using the STAR method",
    duration: 30,
    questions: 5,
    difficulty: "Easy",
    category: "behavioral",
    icon: MicrophoneIcon,
  },
  {
    id: "system-design__Hard__3",
    title: "System Design Interview",
    description: "Design scalable systems like URL shortener, Twitter, etc.",
    duration: 60,
    questions: 3,
    difficulty: "Hard",
    category: "system-design",
    icon: ChartBarIcon,
  },
  {
    id: "hr__Easy__5",
    title: "HR & Culture Fit",
    description: "Questions about company culture, career goals, and work style",
    duration: 25,
    questions: 5,
    difficulty: "Easy",
    category: "hr",
    icon: BuildingOfficeIcon,
  },
  {
    id: "dsa__Hard__4",
    title: "Data Structures & Algorithms",
    description: "Practice with arrays, trees, graphs, and dynamic programming",
    duration: 60,
    questions: 4,
    difficulty: "Hard",
    category: "dsa",
    icon: AcademicCapIcon,
  },
  {
    id: "technical__Medium__7",
    title: "Backend Developer Interview",
    description: "Database design, API architecture, and backend patterns",
    duration: 50,
    questions: 7,
    difficulty: "Medium",
    category: "technical",
    icon: ComputerDesktopIcon,
  },
];

// Map onboarding type → category id
const TYPE_TO_CATEGORY: Record<string, string> = {
  technical: "technical",
  hr: "hr",
  behavioral: "behavioral",
  dsa: "dsa",
  "system design": "system-design",
};

// Map onboarding level → difficulty
const LEVEL_TO_DIFFICULTY: Record<string, string> = {
  beginner: "Easy",
  intermediate: "Medium",
  advanced: "Hard",
};

export default function PracticePage() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [loadingSessionId, setLoadingSessionId] = useState<string | null>(null);
  const [filteredSessions, setFilteredSessions] = useState<PracticeSession[]>(SESSION_TEMPLATES);
  const [error, setError] = useState("");
  const [onboardingBanner, setOnboardingBanner] = useState<string | null>(null);

  const categories: Category[] = [
    {
      id: "technical",
      name: "Technical",
      icon: ComputerDesktopIcon,
      description: "Programming, algorithms, system design, and tech stack questions",
      color: "from-blue-500/20 to-blue-600/5",
    },
    {
      id: "behavioral",
      name: "Behavioral",
      icon: MicrophoneIcon,
      description: "STAR method, leadership, teamwork, and conflict resolution",
      color: "from-green-500/20 to-green-600/5",
    },
    {
      id: "hr",
      name: "HR",
      icon: BuildingOfficeIcon,
      description: "Culture fit, career goals, and company-specific questions",
      color: "from-purple-500/20 to-purple-600/5",
    },
    {
      id: "dsa",
      name: "DSA",
      icon: AcademicCapIcon,
      description: "Data structures, algorithms, and problem-solving",
      color: "from-yellow-500/20 to-yellow-600/5",
    },
    {
      id: "system-design",
      name: "System Design",
      icon: ChartBarIcon,
      description: "Scalability, architecture, and distributed systems",
      color: "from-red-500/20 to-red-600/5",
    },
  ];

  const difficulties = [
    { level: "Easy", color: "text-green-400", bgColor: "bg-green-400/10", borderColor: "border-green-400/20" },
    { level: "Medium", color: "text-yellow-400", bgColor: "bg-yellow-400/10", borderColor: "border-yellow-400/20" },
    { level: "Hard", color: "text-red-400", bgColor: "bg-red-400/10", borderColor: "border-red-400/20" },
  ];

  // ✅ Read onboarding preferences on mount and apply filters
  useEffect(() => {
    try {
      const saved = localStorage.getItem("onboarding");
      if (saved) {
        const prefs = JSON.parse(saved);
        const parts: string[] = [];

        // Apply difficulty from level
        if (prefs.level) {
          const difficulty = LEVEL_TO_DIFFICULTY[prefs.level.toLowerCase()];
          if (difficulty) {
            setSelectedDifficulty(difficulty);
            parts.push(difficulty);
          }
        }

        // Apply category from type (skip if Mixed)
        if (prefs.type && prefs.type.toLowerCase() !== "mixed") {
          const categoryId = TYPE_TO_CATEGORY[prefs.type.toLowerCase()];
          if (categoryId) {
            setSelectedCategory(categoryId);
            const categoryName = categories.find((c) => c.id === categoryId)?.name || prefs.type;
            parts.unshift(categoryName);
          }
        }

        if (parts.length > 0) {
          setOnboardingBanner(`Filtered by your preferences: ${parts.join(" · ")}`);
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Filter sessions whenever category or difficulty changes
  useEffect(() => {
    let filtered = SESSION_TEMPLATES;
    if (selectedCategory) {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }
    if (selectedDifficulty) {
      filtered = filtered.filter((s) => s.difficulty === selectedDifficulty);
    }
    setFilteredSessions(filtered);
  }, [selectedCategory, selectedDifficulty]);

  const startSession = async (templateId: string) => {
    setError("");
    setLoadingSessionId(templateId);

    const [category, difficulty, countStr] = templateId.split("__");
    const questionCount = parseInt(countStr) || 5;

    try {
      const res = await api.post("/api/practice/session", {
        category,
        difficulty,
        questionCount,
      });

      if (res.data.success) {
        const sessionId = res.data.data.session.id;
        router.push(`/dashboard/practice/${sessionId}`);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to start session. Make sure questions exist for this category."
      );
      setLoadingSessionId(null);
    }
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedDifficulty(null);
    setOnboardingBanner(null);
    localStorage.removeItem("onboarding");
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "text-green-400";
      case "Medium": return "text-yellow-400";
      case "Hard": return "text-red-400";
      default: return "text-gray-400";
    }
  };

  const getDifficultyBgColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-400/10";
      case "Medium": return "bg-yellow-400/10";
      case "Hard": return "bg-red-400/10";
      default: return "bg-gray-400/10";
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-[#FFF5F2] mb-2">
          Practice Sessions
        </h1>
        <p className="text-[#9aabb8] font-body">
          Choose a practice session and start your interview preparation journey
        </p>
      </div>

      {/* Onboarding Banner */}
      {onboardingBanner && (
        <div className="mb-6 p-4 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] text-sm flex items-center justify-between">
          <span className="flex items-center gap-2">
            <SparklesIcon className="h-4 w-4 flex-shrink-0" />
            {onboardingBanner}
          </span>
          <button
            onClick={clearFilters}
            className="ml-4 text-[#FF6B6B] hover:text-[#FFA07A] text-xs underline flex-shrink-0"
          >
            Reset filters
          </button>
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-4 text-red-400 hover:text-red-300">✕</button>
        </div>
      )}

      {/* Categories Grid */}
      <div className="mb-8">
        <h2 className="font-heading text-xl font-bold text-[#FFF5F2] mb-4">
          Select Category
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {categories.map((category) => {
            const Icon = category.icon;
            const isSelected = selectedCategory === category.id;
            return (
              <button
                key={category.id}
                onClick={() => {
                  setSelectedCategory(isSelected ? null : category.id);
                  setOnboardingBanner(null);
                }}
                className={`p-4 rounded-2xl border transition-all text-left group ${
                  isSelected
                    ? "border-[#FF6B6B] bg-[#FF6B6B]/10 shadow-lg shadow-[#FF6B6B]/10"
                    : "border-[#2a3a4a] bg-[#1B2838] hover:border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/5"
                }`}
              >
                <div
                  className={`p-2 rounded-xl w-fit mb-3 ${
                    isSelected ? "bg-[#FF6B6B]/20" : "bg-white/5 group-hover:bg-[#FF6B6B]/10"
                  } transition-all`}
                >
                  <Icon
                    className={`h-5 w-5 ${
                      isSelected ? "text-[#FF6B6B]" : "text-[#9aabb8] group-hover:text-[#FF6B6B]"
                    }`}
                  />
                </div>
                <h3
                  className={`font-heading font-bold text-sm mb-1 ${
                    isSelected ? "text-[#FF6B6B]" : "text-[#FFF5F2]"
                  }`}
                >
                  {category.name}
                </h3>
                <p className="text-[#9aabb8] text-xs font-body line-clamp-2">
                  {category.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Difficulty Filters */}
      <div className="mb-8">
        <h2 className="font-heading text-xl font-bold text-[#FFF5F2] mb-4">
          Difficulty Level
        </h2>
        <div className="flex gap-3">
          {difficulties.map((diff) => {
            const isSelected = selectedDifficulty === diff.level;
            return (
              <button
                key={diff.level}
                onClick={() => setSelectedDifficulty(isSelected ? null : diff.level)}
                className={`px-4 py-2 rounded-xl border text-sm font-medium transition-all ${
                  isSelected
                    ? `${diff.bgColor} ${diff.color} ${diff.borderColor}`
                    : "border-[#2a3a4a] text-[#9aabb8] hover:border-[#FF6B6B]/40 hover:text-[#FFF5F2]"
                }`}
              >
                {diff.level}
              </button>
            );
          })}
          {(selectedCategory || selectedDifficulty) && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl border border-[#2a3a4a] text-[#9aabb8] text-sm font-medium hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Clear Filters
            </button>
          )}
        </div>
      </div>

      {/* Sessions Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-heading text-xl font-bold text-[#FFF5F2]">
            Available Sessions
          </h2>
          <p className="text-[#9aabb8] text-sm font-body">
            {filteredSessions.length} session{filteredSessions.length !== 1 ? "s" : ""} found
          </p>
        </div>

        {filteredSessions.length === 0 ? (
          <div className="text-center py-20">
            <BookOpenIcon className="h-16 w-16 text-[#2a3a4a] mx-auto mb-4" />
            <p className="text-[#9aabb8] font-body text-lg">No sessions found</p>
            <p className="text-[#9aabb8] text-sm mt-2">Try adjusting your filters</p>
            <button
              onClick={clearFilters}
              className="mt-4 px-4 py-2 rounded-xl border border-[#FF6B6B] text-[#FF6B6B] text-sm hover:bg-[#FF6B6B]/10 transition-all"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSessions.map((session) => {
              const Icon = session.icon;
              const isLoading = loadingSessionId === session.id;
              return (
                <div
                  key={session.id}
                  className="group relative rounded-2xl border border-[#2a3a4a] bg-[#1B2838] hover:border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/5 transition-all duration-300 overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-[#FF6B6B]/0 to-[#FF6B6B]/0 group-hover:from-[#FF6B6B]/5 group-hover:to-transparent transition-all duration-300" />

                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 rounded-xl bg-white/5 group-hover:bg-[#FF6B6B]/10 transition-all">
                        <Icon className="h-6 w-6 text-[#FF6B6B]" />
                      </div>
                      <span
                        className={`px-2 py-1 rounded-lg text-xs font-mono font-medium ${getDifficultyBgColor(
                          session.difficulty
                        )} ${getDifficultyColor(session.difficulty)}`}
                      >
                        {session.difficulty}
                      </span>
                    </div>

                    <h3 className="font-heading font-bold text-xl text-[#FFF5F2] mb-2">
                      {session.title}
                    </h3>
                    <p className="text-[#9aabb8] text-sm font-body mb-4 line-clamp-2">
                      {session.description}
                    </p>

                    <div className="flex items-center gap-4 mb-6 text-xs text-[#9aabb8] font-mono">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>{session.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpenIcon className="h-3 w-3" />
                        <span>{session.questions} questions</span>
                      </div>
                    </div>

                    <button
                      onClick={() => startSession(session.id)}
                      disabled={!!loadingSessionId}
                      className="w-full py-2.5 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] font-heading font-bold text-sm hover:bg-[#FF6B6B] hover:text-[#0D1B2A] transition-all flex items-center justify-center gap-2 group/btn disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current" />
                          Setting up...
                        </>
                      ) : (
                        <>
                          <PlayIcon className="h-4 w-4 group-hover/btn:animate-pulse" />
                          Start Practice
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Tips Section */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#FF6B6B]/10 to-transparent border border-[#FF6B6B]/20">
        <h3 className="font-heading font-bold text-[#FFF5F2] mb-2 flex items-center gap-2">
          <MicrophoneIcon className="h-5 w-5 text-[#FF6B6B]" />
          Pro Tips for Success
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-1">
            <p className="text-[#FF6B6B] text-xs font-mono">1. STAR Method</p>
            <p className="text-[#9aabb8] text-xs">
              Structure answers with Situation, Task, Action, Result
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[#FF6B6B] text-xs font-mono">2. Time Management</p>
            <p className="text-[#9aabb8] text-xs">
              Aim for 2-3 minutes per answer, be concise
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-[#FF6B6B] text-xs font-mono">3. Be Specific</p>
            <p className="text-[#9aabb8] text-xs">
              Type clear, detailed answers — the AI evaluates depth and accuracy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}