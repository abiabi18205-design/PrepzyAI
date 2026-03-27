// app/(dashboard)/dashboard/questions/page.tsx
"use client";

import { useState, useEffect } from "react";
import { getToken } from "@/lib/api";
import { 
  MagnifyingGlassIcon, 
  FunnelIcon,
  XMarkIcon,
  ClockIcon,
  ChartBarIcon,
  TagIcon,
  BookOpenIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  EyeIcon,
  ArrowPathIcon
} from "@heroicons/react/24/outline";

interface Question {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Easy" | "Medium" | "Hard";
  answer?: string;
  tags: string[];
  createdAt: string;
  createdBy?: string;
}

interface FilterState {
  category: string;
  difficulty: string;
  search: string;
}

interface PaginationState {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const categories = [
  "All",
  "Technical",
  "Behavioral",
  "HR",
  "System Design",
  "DSA"
];

const difficulties = [
  "All",
  "Easy",
  "Medium",
  "Hard"
];

export default function QuestionsPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: "All",
    difficulty: "All",
    search: ""
  });
  const [pagination, setPagination] = useState<PaginationState>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch questions
  useEffect(() => {
    fetchQuestions();
  }, [filters, pagination.page]);

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      const token = getToken();
      const queryParams = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.category !== "All" && { category: filters.category }),
        ...(filters.difficulty !== "All" && { difficulty: filters.difficulty }),
        ...(filters.search && { search: filters.search })
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/questions?${queryParams}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      const data = await response.json();
      if (data.success) {
        setQuestions(data.data.questions);
        setPagination(prev => ({
          ...prev,
          total: data.data.pagination.total,
          totalPages: data.data.pagination.totalPages
        }));
      }
    } catch (error) {
      console.error("Error fetching questions:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
    setPagination(prev => ({ ...prev, page: 1 })); // Reset to first page on filter change
  };

  const clearFilters = () => {
    setFilters({
      category: "All",
      difficulty: "All",
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

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case "Easy": return "text-green-400 bg-green-400/10 border-green-400/20";
      case "Medium": return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "Hard": return "text-red-400 bg-red-400/10 border-red-400/20";
      default: return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch(category) {
      case "Technical": return "💻";
      case "Behavioral": return "🗣️";
      case "HR": return "👥";
      case "System Design": return "🏗️";
      case "DSA": return "📊";
      default: return "📚";
    }
  };

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-extrabold text-[#FFF5F2] mb-2">
          Question Bank
        </h1>
        <p className="text-[#9aabb8] font-body">
          Browse and practice with 10,000+ interview questions across various categories
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search Input */}
          <div className="flex-1 relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#4a5a6a]" />
            <input
              type="text"
              placeholder="Search questions by title, topic, or keyword..."
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-[#1B2838] border border-[#2a3a4a] text-[#FFF5F2] placeholder-[#4a5a6a] focus:border-[#FF6B6B]/40 outline-none transition-colors"
            />
          </div>
          
          {/* Filter Toggle Button (Mobile) */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="md:hidden px-4 py-3 rounded-xl bg-[#1B2838] border border-[#2a3a4a] text-[#9aabb8] flex items-center justify-center gap-2"
          >
            <FunnelIcon className="h-5 w-5" />
            Filters
            {(filters.category !== "All" || filters.difficulty !== "All") && (
              <span className="w-2 h-2 rounded-full bg-[#FF6B6B]" />
            )}
          </button>
        </div>

        {/* Filters Panel */}
        <div className={`mt-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => handleFilterChange("category", cat)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filters.category === cat
                      ? "bg-[#FF6B6B] text-[#0D1B2A]"
                      : "bg-[#1B2838] text-[#9aabb8] hover:text-[#FFF5F2] border border-[#2a3a4a]"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Difficulty Filters */}
            <div className="flex gap-2">
              {difficulties.map((diff) => (
                <button
                  key={diff}
                  onClick={() => handleFilterChange("difficulty", diff)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    filters.difficulty === diff
                      ? diff === "Easy" 
                        ? "bg-green-500 text-white"
                        : diff === "Medium"
                        ? "bg-yellow-500 text-black"
                        : diff === "Hard"
                        ? "bg-red-500 text-white"
                        : "bg-[#FF6B6B] text-[#0D1B2A]"
                      : "bg-[#1B2838] text-[#9aabb8] hover:text-[#FFF5F2] border border-[#2a3a4a]"
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Clear Filters Button */}
            {(filters.category !== "All" || filters.difficulty !== "All" || filters.search) && (
              <button
                onClick={clearFilters}
                className="px-3 py-1.5 rounded-lg text-sm text-[#FF6B6B] hover:bg-[#FF6B6B]/10 transition-all flex items-center gap-1"
              >
                <XMarkIcon className="h-4 w-4" />
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 flex items-center justify-between">
        <p className="text-[#9aabb8] text-sm">
          Showing <span className="text-[#FFF5F2] font-bold">{questions.length}</span> of{" "}
          <span className="text-[#FFF5F2] font-bold">{pagination.total}</span> questions
        </p>
        <button
          onClick={fetchQuestions}
          className="p-2 rounded-lg text-[#9aabb8] hover:text-[#FF6B6B] transition-colors"
          title="Refresh"
        >
          <ArrowPathIcon className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Questions Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
        </div>
      ) : questions.length === 0 ? (
        <div className="text-center py-20">
          <BookOpenIcon className="h-16 w-16 text-[#2a3a4a] mx-auto mb-4" />
          <p className="text-[#9aabb8] font-body text-lg">No questions found</p>
          <p className="text-[#9aabb8] text-sm mt-2">Try adjusting your filters or search term</p>
          <button
            onClick={clearFilters}
            className="mt-4 px-4 py-2 rounded-xl border border-[#FF6B6B] text-[#FF6B6B] text-sm hover:bg-[#FF6B6B]/10 transition-all"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {questions.map((question) => (
            <div
              key={question._id}
              className="group p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838] hover:border-[#FF6B6B]/40 hover:bg-[#FF6B6B]/5 transition-all cursor-pointer"
              onClick={() => {
                setSelectedQuestion(question);
                setShowModal(true);
              }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getCategoryIcon(question.category)}</span>
                    <h3 className="font-heading font-bold text-lg text-[#FFF5F2] group-hover:text-[#FF6B6B] transition-colors">
                      {question.title}
                    </h3>
                  </div>
                  <p className="text-[#9aabb8] text-sm font-body line-clamp-2">
                    {question.description}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-mono border ${getDifficultyColor(question.difficulty)}`}>
                    {question.difficulty}
                  </span>
                  <EyeIcon className="h-4 w-4 text-[#4a5a6a] group-hover:text-[#FF6B6B] transition-colors" />
                </div>
              </div>

              {/* Tags */}
              {question.tags && question.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {question.tags.slice(0, 3).map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-md bg-[#0D1B2A] text-[#9aabb8] text-xs font-mono"
                    >
                      #{tag}
                    </span>
                  ))}
                  {question.tags.length > 3 && (
                    <span className="px-2 py-1 rounded-md bg-[#0D1B2A] text-[#9aabb8] text-xs">
                      +{question.tags.length - 3} more
                    </span>
                  )}
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#2a3a4a] text-xs text-[#9aabb8]">
                <div className="flex items-center gap-1">
                  <TagIcon className="h-3 w-3" />
                  <span>{question.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  <span>{new Date(question.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
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

      {/* Question Detail Modal */}
      {showModal && selectedQuestion && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="relative max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#1B2838] border border-[#2a3a4a] shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 bg-[#1B2838] border-b border-[#2a3a4a] p-6 flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl">{getCategoryIcon(selectedQuestion.category)}</span>
                  <h2 className="font-heading text-xl font-bold text-[#FFF5F2]">
                    {selectedQuestion.title}
                  </h2>
                </div>
                <div className="flex gap-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-mono border ${getDifficultyColor(selectedQuestion.difficulty)}`}>
                    {selectedQuestion.difficulty}
                  </span>
                  <span className="px-2 py-1 rounded-lg bg-[#0D1B2A] text-[#9aabb8] text-xs">
                    {selectedQuestion.category}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 rounded-lg hover:bg-white/5 text-[#9aabb8] hover:text-[#FF6B6B] transition-colors"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Question Description */}
              <div>
                <h3 className="font-heading font-bold text-[#FF6B6B] mb-2">Question</h3>
                <p className="text-[#FFF5F2] font-body leading-relaxed">
                  {selectedQuestion.description}
                </p>
              </div>

              {/* Answer */}
              {selectedQuestion.answer && (
                <div>
                  <h3 className="font-heading font-bold text-[#FF6B6B] mb-2">Sample Answer</h3>
                  <div className="p-4 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a]">
                    <p className="text-[#9aabb8] font-body leading-relaxed">
                      {selectedQuestion.answer}
                    </p>
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedQuestion.tags && selectedQuestion.tags.length > 0 && (
                <div>
                  <h3 className="font-heading font-bold text-[#FF6B6B] mb-2">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedQuestion.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-[#0D1B2A] text-[#9aabb8] text-sm font-mono"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4 border-t border-[#2a3a4a]">
                <button
                  onClick={() => {
                    setShowModal(false);
                    // Navigate to practice with this question
                    window.location.href = `/dashboard/practice?question=${selectedQuestion._id}`;
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold hover:bg-[#FFA07A] transition-all"
                >
                  Practice This Question
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