// app/(dashboard)/dashboard/results/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/api";
import { 
  ChartBarIcon, 
  ClockIcon, 
  TrophyIcon, 
  ArrowTrendingUpIcon,
  CalendarIcon,
  DocumentTextIcon,
  EyeIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  MicrophoneIcon,
  SparklesIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

interface InterviewResult {
  _id: string;
  sessionId: string;
  sessionTitle: string;
  date: string;
  duration: number;
  totalQuestions: number;
  answeredQuestions: number;
  overallScore: number;
  categoryScores: {
    technical: number;
    behavioral: number;
    communication: number;
    confidence: number;
  };
  strengths: string[];
  improvements: string[];
  feedback: string;
  status: "completed" | "in-progress" | "abandoned";
}

interface FilterState {
  timeRange: "week" | "month" | "year" | "all";
  minScore: number;
  status: "all" | "completed" | "in-progress";
  search: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const timeRanges = [
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
  { value: "year", label: "Last Year" },
  { value: "all", label: "All Time" }
];

export default function ResultsPage() {
  const router = useRouter();
  const [results, setResults] = useState<InterviewResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalInterviews: 0,
    averageScore: 0,
    bestScore: 0,
    improvementRate: 0,
    totalQuestionsAnswered: 0
  });
  const [filters, setFilters] = useState<FilterState>({
    timeRange: "all",
    minScore: 0,
    status: "all",
    search: ""
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [selectedResult, setSelectedResult] = useState<InterviewResult | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Fetch results
  useEffect(() => {
    fetchResults();
    fetchStats();
  }, [filters, pagination.page]);

  const fetchResults = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        timeRange: filters.timeRange,
        minScore: filters.minScore.toString(),
        status: filters.status,
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/results?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setResults(data.data.results);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error("Error fetching results:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const token = getToken();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/results/stats`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const clearFilters = () => {
    setFilters({
      timeRange: "all",
      minScore: 0,
      status: "all",
      search: ""
    });
    setPagination(prev => ({ ...prev, page: 1 }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      setPagination(prev => ({ ...prev, page: newPage }));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-400";
    if (score >= 60) return "text-yellow-400";
    return "text-red-400";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-400/10 border-green-400/20";
    if (score >= 60) return "bg-yellow-400/10 border-yellow-400/20";
    return "bg-red-400/10 border-red-400/20";
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case "completed":
        return { icon: CheckCircleIcon, text: "Completed", color: "text-green-400 bg-green-400/10" };
      case "in-progress":
        return { icon: ArrowPathIcon, text: "In Progress", color: "text-yellow-400 bg-yellow-400/10" };
      default:
        return { icon: XCircleIcon, text: "Abandoned", color: "text-red-400 bg-red-400/10" };
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-[#FFF5F2] mb-2">
          Interview Results
        </h1>
        <p className="text-[#9aabb8] font-body">
          Track your progress and analyze your interview performance
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9aabb8] text-sm">Total Interviews</span>
            <DocumentTextIcon className="h-5 w-5 text-[#FF6B6B]" />
          </div>
          <div className="font-heading text-3xl font-bold text-[#FFF5F2]">
            {stats.totalInterviews}
          </div>
          <div className="text-[#9aabb8] text-xs mt-2">Completed sessions</div>
        </div>

        <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9aabb8] text-sm">Average Score</span>
            <ChartBarIcon className="h-5 w-5 text-[#FF6B6B]" />
          </div>
          <div className={`font-heading text-3xl font-bold ${getScoreColor(stats.averageScore)}`}>
            {stats.averageScore}%
          </div>
          <div className="text-[#9aabb8] text-xs mt-2">Across all interviews</div>
        </div>

        <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9aabb8] text-sm">Best Score</span>
            <TrophyIcon className="h-5 w-5 text-yellow-400" />
          </div>
          <div className="font-heading text-3xl font-bold text-yellow-400">
            {stats.bestScore}%
          </div>
          <div className="text-[#9aabb8] text-xs mt-2">Your personal best</div>
        </div>

        <div className="p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#9aabb8] text-sm">Improvement</span>
            <ArrowTrendingUpIcon className={`h-5 w-5 ${stats.improvementRate >= 0 ? 'text-green-400' : 'text-red-400'}`} />
          </div>
          <div className={`font-heading text-3xl font-bold ${stats.improvementRate >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {stats.improvementRate >= 0 ? '+' : ''}{stats.improvementRate}%
          </div>
          <div className="text-[#9aabb8] text-xs mt-2">vs last month</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Search by session title..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-4 pr-4 py-3 rounded-xl bg-[#1B2838] border border-[#2a3a4a] text-[#FFF5F2] placeholder-[#4a5a6a] focus:border-[#FF6B6B]/40 outline-none transition-colors"
            />
          </div>
          
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-4 py-3 rounded-xl bg-[#1B2838] border border-[#2a3a4a] text-[#9aabb8] flex items-center justify-center gap-2"
          >
            <ChartBarIcon className="h-5 w-5" />
            Filters
          </button>
        </div>

        {/* Filters Panel */}
        <div className={`mt-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-wrap gap-4">
            {/* Time Range */}
            <div className="flex gap-2">
              {timeRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => handleFilterChange("timeRange", range.value)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filters.timeRange === range.value
                      ? "bg-[#FF6B6B] text-[#0D1B2A]"
                      : "bg-[#1B2838] text-[#9aabb8] hover:text-[#FFF5F2] border border-[#2a3a4a]"
                  }`}
                >
                  {range.label}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <div className="flex gap-2">
              <button
                onClick={() => handleFilterChange("status", "all")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filters.status === "all"
                    ? "bg-[#FF6B6B] text-[#0D1B2A]"
                    : "bg-[#1B2838] text-[#9aabb8] hover:text-[#FFF5F2] border border-[#2a3a4a]"
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleFilterChange("status", "completed")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filters.status === "completed"
                    ? "bg-[#FF6B6B] text-[#0D1B2A]"
                    : "bg-[#1B2838] text-[#9aabb8] hover:text-[#FFF5F2] border border-[#2a3a4a]"
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => handleFilterChange("status", "in-progress")}
                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                  filters.status === "in-progress"
                    ? "bg-[#FF6B6B] text-[#0D1B2A]"
                    : "bg-[#1B2838] text-[#9aabb8] hover:text-[#FFF5F2] border border-[#2a3a4a]"
                }`}
              >
                In Progress
              </button>
            </div>

            {/* Min Score Filter */}
            <div className="flex items-center gap-3">
              <span className="text-[#9aabb8] text-sm">Min Score:</span>
              <select
                value={filters.minScore}
                onChange={(e) => handleFilterChange("minScore", parseInt(e.target.value))}
                className="px-3 py-1.5 rounded-lg bg-[#1B2838] border border-[#2a3a4a] text-[#FFF5F2] text-sm focus:border-[#FF6B6B]/40 outline-none"
              >
                <option value={0}>Any</option>
                <option value={70}>70%+</option>
                <option value={80}>80%+</option>
                <option value={90}>90%+</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(filters.timeRange !== "all" || filters.minScore !== 0 || filters.status !== "all" || filters.search) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-lg text-sm text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-all"
              >
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results List */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
        </div>
      ) : results.length === 0 ? (
        <div className="text-center py-20">
          <DocumentTextIcon className="h-16 w-16 text-[#2a3a4a] mx-auto mb-4" />
          <p className="text-[#9aabb8] font-body text-lg">No results found</p>
          <p className="text-[#9aabb8] text-sm mt-2">Complete some practice sessions to see your results here</p>
          <button
            onClick={() => router.push('/dashboard/practice')}
            className="mt-4 px-4 py-2 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] text-sm font-bold hover:bg-[#FFA07A] transition-all"
          >
            Start Practicing
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {results.map((result) => {
            const StatusIcon = getStatusBadge(result.status).icon;
            const statusStyle = getStatusBadge(result.status).color;
            
            return (
              <div
                key={result._id}
                className="group p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838] hover:border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/5 transition-all cursor-pointer"
                onClick={() => {
                  setSelectedResult(result);
                  setShowModal(true);
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-heading font-bold text-lg text-[#FFF5F2] group-hover:text-[#FF6B6B] transition-colors">
                        {result.sessionTitle}
                      </h3>
                      <span className={`px-2 py-1 rounded-lg text-xs font-mono flex items-center gap-1 ${statusStyle}`}>
                        <StatusIcon className="h-3 w-3" />
                        {getStatusBadge(result.status).text}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-[#9aabb8]">
                      <div className="flex items-center gap-1">
                        <CalendarIcon className="h-4 w-4" />
                        <span>{formatDate(result.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <ClockIcon className="h-4 w-4" />
                        <span>{result.duration} min</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MicrophoneIcon className="h-4 w-4" />
                        <span>{result.answeredQuestions}/{result.totalQuestions} answered</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-heading font-bold ${getScoreColor(result.overallScore)}`}>
                      {result.overallScore}%
                    </div>
                    <div className="text-[#9aabb8] text-xs mt-1">Overall Score</div>
                  </div>
                </div>

                {/* Score Bars */}
                <div className="grid grid-cols-4 gap-3 mt-4 pt-4 border-t border-[#2a3a4a]">
                  <div>
                    <div className="text-[#9aabb8] text-xs mb-1">Technical</div>
                    <div className="h-1.5 bg-[#2a3a4a] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF6B6B] rounded-full transition-all"
                        style={{ width: `${result.categoryScores.technical}%` }}
                      />
                    </div>
                    <div className="text-[#9aabb8] text-xs mt-1">{result.categoryScores.technical}%</div>
                  </div>
                  <div>
                    <div className="text-[#9aabb8] text-xs mb-1">Behavioral</div>
                    <div className="h-1.5 bg-[#2a3a4a] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF6B6B] rounded-full transition-all"
                        style={{ width: `${result.categoryScores.behavioral}%` }}
                      />
                    </div>
                    <div className="text-[#9aabb8] text-xs mt-1">{result.categoryScores.behavioral}%</div>
                  </div>
                  <div>
                    <div className="text-[#9aabb8] text-xs mb-1">Communication</div>
                    <div className="h-1.5 bg-[#2a3a4a] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF6B6B] rounded-full transition-all"
                        style={{ width: `${result.categoryScores.communication}%` }}
                      />
                    </div>
                    <div className="text-[#9aabb8] text-xs mt-1">{result.categoryScores.communication}%</div>
                  </div>
                  <div>
                    <div className="text-[#9aabb8] text-xs mb-1">Confidence</div>
                    <div className="h-1.5 bg-[#2a3a4a] rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-[#FF6B6B] rounded-full transition-all"
                        style={{ width: `${result.categoryScores.confidence}%` }}
                      />
                    </div>
                    <div className="text-[#9aabb8] text-xs mt-1">{result.categoryScores.confidence}%</div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-end">
                  <EyeIcon className="h-4 w-4 text-[#4a5a6a] group-hover:text-[#FF6B6B] transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => handlePageChange(pagination.page - 1)}
            disabled={pagination.page === 1}
            className="p-2 rounded-lg border border-[#2a3a4a] text-[#9aabb8] hover:border-[#FF6B6B] hover:text-[#FF6B6B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="h-5 w-5" />
          </button>
          
          <div className="flex gap-2">
            {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
              let pageNum;
              if (pagination.totalPages <= 5) {
                pageNum = i + 1;
              } else if (pagination.page <= 3) {
                pageNum = i + 1;
              } else if (pagination.page >= pagination.totalPages - 2) {
                pageNum = pagination.totalPages - 4 + i;
              } else {
                pageNum = pagination.page - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className={`min-w-[36px] h-9 rounded-lg text-sm font-medium transition-all ${
                    pagination.page === pageNum
                      ? "bg-[#FF6B6B] text-[#0D1B2A]"
                      : "border border-[#2a3a4a] text-[#9aabb8] hover:border-[#FF6B6B] hover:text-[#FF6B6B]"
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => handlePageChange(pagination.page + 1)}
            disabled={pagination.page === pagination.totalPages}
            className="p-2 rounded-lg border border-[#2a3a4a] text-[#9aabb8] hover:border-[#FF6B6B] hover:text-[#FF6B6B] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRightIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Result Detail Modal */}
      {showModal && selectedResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1B2838] border border-[#2a3a4a] shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1B2838] border-b border-[#2a3a4a] p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h2 className="font-heading text-xl font-bold text-[#FFF5F2]">
                      {selectedResult.sessionTitle}
                    </h2>
                    <span className={`px-2 py-1 rounded-lg text-xs font-mono flex items-center gap-1 ${getStatusBadge(selectedResult.status).color}`}>
                      <CheckCircleIcon className="h-3 w-3" />
                      {getStatusBadge(selectedResult.status).text}
                    </span>
                  </div>
                  <div className="flex gap-4 text-sm text-[#9aabb8]">
                    <div className="flex items-center gap-1">
                      <CalendarIcon className="h-4 w-4" />
                      <span>{new Date(selectedResult.date).toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="h-4 w-4" />
                      <span>{selectedResult.duration} minutes</span>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-white/5 text-[#9aabb8] hover:text-[#FF6B6B] transition-colors"
                >
                  <XCircleIcon className="h-6 w-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Overall Score */}
              <div className="text-center p-6 rounded-2xl bg-gradient-to-br from-[#FF6B6B]/10 to-transparent border border-[#FF6B6B]/20">
                <div className={`text-6xl font-heading font-bold ${getScoreColor(selectedResult.overallScore)} mb-2`}>
                  {selectedResult.overallScore}%
                </div>
                <p className="text-[#9aabb8]">Overall Performance Score</p>
              </div>

              {/* Category Scores */}
              <div>
                <h3 className="font-heading font-bold text-[#FF6B6B] mb-3">Category Breakdown</h3>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(selectedResult.categoryScores).map(([category, score]) => (
                    <div key={category} className="p-3 rounded-xl bg-[#0D1B2A]">
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-[#9aabb8] capitalize">{category}</span>
                        <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
                      </div>
                      <div className="h-1.5 bg-[#2a3a4a] rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-[#FF6B6B] rounded-full transition-all"
                          style={{ width: `${score}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Strengths */}
              <div>
                <h3 className="font-heading font-bold text-green-400 mb-3 flex items-center gap-2">
                  <CheckCircleIcon className="h-5 w-5" />
                  Key Strengths
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedResult.strengths.map((strength, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-green-400/10 border border-green-400/20 text-green-400 text-sm"
                    >
                      {strength}
                    </span>
                  ))}
                </div>
              </div>

              {/* Areas for Improvement */}
              <div>
                <h3 className="font-heading font-bold text-yellow-400 mb-3 flex items-center gap-2">
                  <ArrowTrendingUpIcon className="h-5 w-5" />
                  Areas for Improvement
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedResult.improvements.map((improvement, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1.5 rounded-lg bg-yellow-400/10 border border-yellow-400/20 text-yellow-400 text-sm"
                    >
                      {improvement}
                    </span>
                  ))}
                </div>
              </div>

              {/* AI Feedback */}
              <div>
                <h3 className="font-heading font-bold text-[#FF6B6B] mb-3 flex items-center gap-2">
                  <SparklesIcon className="h-5 w-5" />
                  AI Coach Feedback
                </h3>
                <div className="p-4 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a]">
                  <p className="text-[#9aabb8] leading-relaxed">
                    {selectedResult.feedback}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    router.push(`/dashboard/practice/${selectedResult.sessionId}`);
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold hover:bg-[#FFA07A] transition-all"
                >
                  Practice Again
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 rounded-xl border border-[#2a3a4a] text-[#9aabb8] hover:text-[#FFF5F2] transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}