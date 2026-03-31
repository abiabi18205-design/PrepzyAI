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
  PlusIcon,
  TrashIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";

interface Category {
  id: string;
  name: string;
  icon: any;
  description: string;
  color: string;
}

interface SelectedJob {
  id: string;
  categoryId: string;
  categoryName: string;
  questionsCount: number;
}

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

const QUESTIONS_PER_JOB = 3; // Each job gets exactly 3 questions

export default function PracticePage() {
  const router = useRouter();
  const [selectedJobs, setSelectedJobs] = useState<SelectedJob[]>([]);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showJobSelector, setShowJobSelector] = useState(false);

  // Add a job to the list
  const addJob = (categoryId: string, categoryName: string) => {
    // Check if already added
    if (selectedJobs.some(job => job.categoryId === categoryId)) {
      setError(`${categoryName} is already added`);
      setTimeout(() => setError(""), 3000);
      return;
    }
    
    setSelectedJobs([
      ...selectedJobs,
      {
        id: `${categoryId}-${Date.now()}`,
        categoryId,
        categoryName,
        questionsCount: QUESTIONS_PER_JOB,
      }
    ]);
    setShowJobSelector(false);
  };

  // Remove a job from the list
  const removeJob = (id: string) => {
    setSelectedJobs(selectedJobs.filter(job => job.id !== id));
  };

  // Calculate total questions
  const totalQuestions = selectedJobs.length * QUESTIONS_PER_JOB;

  // Start multi-category session
  const startMultiSession = async () => {
    if (selectedJobs.length === 0) {
      setError("Please select at least one job role");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const categories = selectedJobs.map(job => job.categoryId);
      
      const res = await api.post("/api/practice/multi-session", {
        categories,
        questionsPerCategory: QUESTIONS_PER_JOB,
        difficulty: selectedDifficulty || "Mixed",
      });

      if (res.data.success) {
        const sessionId = res.data.data.session.id;
        router.push(`/dashboard/practice/${sessionId}`);
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Failed to start session. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Start single category session (backward compatible)
  const startSingleSession = async (categoryId: string) => {
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/api/practice/session", {
        category: categoryId,
        difficulty: selectedDifficulty || "Mixed",
        questionCount: QUESTIONS_PER_JOB,
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
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSelectedDifficulty(null);
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-[#FFF5F2] mb-2">
          Practice Sessions
        </h1>
        <p className="text-[#9aabb8] font-body">
          Select job roles to practice with {QUESTIONS_PER_JOB} questions each
        </p>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError("")} className="ml-4 text-red-400 hover:text-red-300">✕</button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B] mx-auto mb-4" />
            <p className="text-[#FFF5F2] font-heading font-bold">Creating your session...</p>
            <p className="text-[#9aabb8] text-sm mt-2">Preparing {totalQuestions} questions</p>
          </div>
        </div>
      )}

      {/* Selected Jobs Summary */}
      {selectedJobs.length > 0 && (
        <div className="mb-6 p-4 rounded-2xl border border-[#FF6B6B]/20 bg-[#FF6B6B]/5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-heading font-bold text-[#FFF5F2] flex items-center gap-2">
              <CheckCircleIcon className="h-5 w-5 text-[#FF6B6B]" />
              Selected Jobs ({selectedJobs.length})
            </h3>
            <span className="text-[#FF6B6B] text-sm font-mono">
              Total: {totalQuestions} questions
            </span>
          </div>
          
          <div className="flex flex-wrap gap-2 mb-4">
            {selectedJobs.map((job) => (
              <div
                key={job.id}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#1B2838] border border-[#2a3a4a]"
              >
                <span className="text-[#FFF5F2] text-sm">{job.categoryName}</span>
                <span className="text-[#9aabb8] text-xs">({job.questionsCount} qns)</span>
                <button
                  onClick={() => removeJob(job.id)}
                  className="ml-1 p-0.5 rounded hover:bg-red-500/20 text-[#9aabb8] hover:text-red-400 transition-colors"
                >
                  <TrashIcon className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={() => setShowJobSelector(!showJobSelector)}
            className="text-sm text-[#FF6B6B] hover:text-[#FFA07A] transition-colors flex items-center gap-1"
          >
            <PlusIcon className="h-4 w-4" />
            Add another job role
          </button>
        </div>
      )}

      {/* Job Selector Dropdown */}
      {showJobSelector && (
        <div className="mb-6 p-4 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
          <h3 className="font-heading font-bold text-[#FFF5F2] mb-3">Select a Job Role</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((category) => {
              const isAlreadySelected = selectedJobs.some(job => job.categoryId === category.id);
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => addJob(category.id, category.name)}
                  disabled={isAlreadySelected}
                  className={`p-3 rounded-xl border transition-all text-left ${
                    isAlreadySelected
                      ? "border-green-500/30 bg-green-500/10 opacity-50 cursor-not-allowed"
                      : "border-[#2a3a4a] bg-[#0D1B2A] hover:border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/5"
                  }`}
                >
                  <Icon className="h-5 w-5 text-[#FF6B6B] mb-2" />
                  <p className="text-[#FFF5F2] text-sm font-medium">{category.name}</p>
                  <p className="text-[#9aabb8] text-xs mt-1">{QUESTIONS_PER_JOB} questions</p>
                  {isAlreadySelected && (
                    <p className="text-green-400 text-xs mt-1">✓ Added</p>
                  )}
                </button>
              );
            })}
          </div>
          <button
            onClick={() => setShowJobSelector(false)}
            className="mt-3 text-sm text-[#9aabb8] hover:text-[#FFF5F2] transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Difficulty Filter */}
      <div className="mb-8">
        <h2 className="font-heading text-xl font-bold text-[#FFF5F2] mb-4">
          Difficulty Level (Optional)
        </h2>
        <div className="flex gap-3 flex-wrap">
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
          {selectedDifficulty && (
            <button
              onClick={clearFilters}
              className="px-4 py-2 rounded-xl border border-[#2a3a4a] text-[#9aabb8] text-sm font-medium hover:border-[#FF6B6B] hover:text-[#FF6B6B] transition-all flex items-center gap-2"
            >
              <ArrowPathIcon className="h-4 w-4" />
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Start Session Button */}
      {selectedJobs.length > 0 && (
        <div className="mb-8 p-6 rounded-2xl border border-[#FF6B6B]/20 bg-gradient-to-r from-[#FF6B6B]/10 to-transparent">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h3 className="font-heading text-xl font-bold text-[#FFF5F2]">
                Ready to Practice?
              </h3>
              <p className="text-[#9aabb8] text-sm mt-1">
                You'll face {totalQuestions} questions from {selectedJobs.length} job role{selectedJobs.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={startMultiSession}
              disabled={loading}
              className="px-8 py-3 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold text-lg hover:bg-[#FFA07A] transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <PlayIcon className="h-5 w-5" />
              Start Combined Session ({totalQuestions} questions)
            </button>
          </div>
        </div>
      )}

      {/* Quick Start - Single Category */}
      {selectedJobs.length === 0 && (
        <>
          <div className="mb-6">
            <h2 className="font-heading text-xl font-bold text-[#FFF5F2] mb-4">
              Or start with one job role
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.id}
                  className="group relative rounded-2xl border border-[#2a3a4a] bg-[#1B2838] hover:border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/5 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2 rounded-xl bg-white/5 group-hover:bg-[#FF6B6B]/10 transition-all">
                        <Icon className="h-6 w-6 text-[#FF6B6B]" />
                      </div>
                    </div>

                    <h3 className="font-heading font-bold text-xl text-[#FFF5F2] mb-2">
                      {category.name}
                    </h3>
                    <p className="text-[#9aabb8] text-sm font-body mb-4 line-clamp-2">
                      {category.description}
                    </p>

                    <div className="flex items-center gap-4 mb-6 text-xs text-[#9aabb8] font-mono">
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-3 w-3" />
                        <span>{QUESTIONS_PER_JOB * 2} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <BookOpenIcon className="h-3 w-3" />
                        <span>{QUESTIONS_PER_JOB} questions</span>
                      </div>
                    </div>

                    <button
                      onClick={() => startSingleSession(category.id)}
                      disabled={loading}
                      className="w-full py-2.5 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 text-[#FF6B6B] font-heading font-bold text-sm hover:bg-[#FF6B6B] hover:text-[#0D1B2A] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                    >
                      <PlayIcon className="h-4 w-4" />
                      Start Practice
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Tips Section */}
      <div className="mt-12 p-6 rounded-2xl bg-gradient-to-r from-[#FF6B6B]/10 to-transparent border border-[#FF6B6B]/20">
        <h3 className="font-heading font-bold text-[#FFF5F2] mb-2 flex items-center gap-2">
          <MicrophoneIcon className="h-5 w-5 text-[#FF6B6B]" />
          Pro Tips for Success
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="space-y-1">
            <p className="text-[#FF6B6B] text-xs font-mono">1. Multiple Jobs</p>
            <p className="text-[#9aabb8] text-xs">Select multiple roles to practice mixed interviews (e.g., Technical + Behavioral)</p>
          </div>
          <div className="space-y-1">
            <p className="text-[#FF6B6B] text-xs font-mono">2. STAR Method</p>
            <p className="text-[#9aabb8] text-xs">Structure answers with Situation, Task, Action, Result</p>
          </div>
          <div className="space-y-1">
            <p className="text-[#FF6B6B] text-xs font-mono">3. Time Management</p>
            <p className="text-[#9aabb8] text-xs">Aim for 2-3 minutes per answer, be concise</p>
          </div>
        </div>
      </div>
    </div>
  );
}