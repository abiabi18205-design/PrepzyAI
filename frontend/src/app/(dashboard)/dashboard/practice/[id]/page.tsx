// app/(dashboard)/dashboard/practice/[id]/page.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
  PaperAirplaneIcon,
  BookOpenIcon,
  XMarkIcon,
  ChartBarIcon,
  LightBulbIcon,
  ArrowPathIcon,
  ChatBubbleLeftRightIcon,
  MicrophoneIcon
} from "@heroicons/react/24/outline";

interface Question {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  tags: string[];
  timeLimit: number;
}

interface SessionData {
  id: string;
  title: string;
  category: string;
  difficulty: string;
  questions: Question[];
  totalQuestions: number;
  status: string;
}

interface CriteriaScores {
  accuracy: number;
  completeness: number;
  clarity: number;
  examples: number;
  communication: number;
}

interface Evaluation {
  result: "Correct" | "Partially Correct" | "Incorrect" | "Excellent" | "Good" | "Average" | "Needs Improvement";
  overallScore: number;
  criteriaScores?: CriteriaScores;
  confidenceScore?: number;
    confidenceAnalysis?: string;  
  feedback: string;
  improvementTip?: string;
  whatWentWell?: string[];
  whatToImprove?: string[];
  followUpQuestions?: string[];
  sampleAnswer?: string;
  lengthAnalysis?: {
    wordCount: number;
    lengthScore: number;
    lengthFeedback: string;
  };
}

interface AnswerRecord {
  questionId: string;
  userAnswer: string;
  evaluation: Evaluation | null;
}

export default function PracticeSessionPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.id as string;

  const [session, setSession] = useState<SessionData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userAnswer, setUserAnswer] = useState("");
  const [evaluating, setEvaluating] = useState(false);
  const [currentEval, setCurrentEval] = useState<Evaluation | null>(null);
  const [answers, setAnswers] = useState<Record<string, AnswerRecord>>({});
  const [completing, setCompleting] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSampleAnswer, setShowSampleAnswer] = useState(false);
  const [showFollowUp, setShowFollowUp] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Start session timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeElapsed((prev) => prev + 1);
    }, 1000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  // Fetch session
  useEffect(() => {
    const fetchSession = async () => {
      try {
        const res = await api.get(`/api/practice/session/${sessionId}`);
        if (res.data.success) {
          setSession(res.data.data.session);
        }
      } catch (err: any) {
        console.error("Failed to fetch session:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSession();
  }, [sessionId]);

  // Focus textarea when question changes
  useEffect(() => {
    if (!evaluating && !currentEval) {
      textareaRef.current?.focus();
    }
  }, [currentIndex, currentEval, evaluating]);

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const currentQuestion = session?.questions[currentIndex];
  const progress = session ? ((currentIndex) / session.questions.length) * 100 : 0;
  const answeredCount = Object.keys(answers).length;

  const submitAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion || evaluating) return;

    setEvaluating(true);
    try {
      const res = await api.post("/api/practice/evaluate", {
        questionId: currentQuestion.id,
        userAnswer: userAnswer.trim(),
        sessionId,
      });

      if (res.data.success) {
        const evaluation = res.data.data.evaluation;
        setCurrentEval(evaluation);
        setAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: {
            questionId: currentQuestion.id,
            userAnswer: userAnswer.trim(),
            evaluation,
          },
        }));
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to evaluate. Please try again.");
    } finally {
      setEvaluating(false);
    }
  };

  const nextQuestion = () => {
    if (!session) return;
    if (currentIndex + 1 < session.questions.length) {
      setCurrentIndex((i) => i + 1);
      setUserAnswer("");
      setCurrentEval(null);
      setShowSampleAnswer(false);
      setShowFollowUp(false);
    } else {
      completeSession();
    }
  };

  const skipQuestion = () => {
    if (!session) return;
    if (currentIndex + 1 < session.questions.length) {
      setCurrentIndex((i) => i + 1);
      setUserAnswer("");
      setCurrentEval(null);
      setShowSampleAnswer(false);
      setShowFollowUp(false);
    } else {
      completeSession();
    }
  };

  const completeSession = async () => {
    setCompleting(true);
    if (timerRef.current) clearInterval(timerRef.current);

    try {
      const res = await api.post("/api/practice/complete", {
        sessionId,
        duration: Math.round(timeElapsed / 60),
      });

      if (res.data.success) {
        router.push(`/dashboard/results`);
      }
    } catch (err: any) {
      console.error("Failed to complete session:", err);
      router.push("/dashboard/results");
    } finally {
      setCompleting(false);
    }
  };

  const getResultColor = (result: string) => {
    if (result === "Excellent" || result === "Correct") return "text-green-400";
    if (result === "Good" || result === "Partially Correct") return "text-yellow-400";
    if (result === "Average") return "text-orange-400";
    return "text-red-400";
  };

  const getResultBg = (result: string) => {
    if (result === "Excellent" || result === "Correct") return "bg-green-400/10 border-green-400/20";
    if (result === "Good" || result === "Partially Correct") return "bg-yellow-400/10 border-yellow-400/20";
    if (result === "Average") return "bg-orange-400/10 border-orange-400/20";
    return "bg-red-400/10 border-red-400/20";
  };

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-400";
    if (score >= 5) return "text-yellow-400";
    return "text-red-400";
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === "Easy") return "bg-green-400/10 text-green-400";
    if (difficulty === "Medium") return "bg-yellow-400/10 text-yellow-400";
    return "bg-red-400/10 text-red-400";
  };

  const getCriteriaLabel = (key: string) => {
    const labels: Record<string, string> = {
      accuracy: "Technical Accuracy",
      completeness: "Completeness",
      clarity: "Clarity & Structure",
      examples: "Real-world Examples",
      communication: "Communication",
    };
    return labels[key] || key;
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B] mx-auto mb-4" />
          <p className="text-[#9aabb8]">Loading your session...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <BookOpenIcon className="h-16 w-16 text-[#2a3a4a] mx-auto mb-4" />
          <p className="text-[#9aabb8] mb-4">Session not found</p>
          <button
            onClick={() => router.push("/dashboard/practice")}
            className="px-4 py-2 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-bold"
          >
            Back to Practice
          </button>
        </div>
      </div>
    );
  }

  // ── Completing overlay ────────────────────────────────────────────────────
  if (completing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B] mx-auto mb-4" />
          <p className="text-[#FFF5F2] font-heading font-bold text-lg">Generating your results...</p>
          <p className="text-[#9aabb8] text-sm mt-2">AI is preparing your performance report.</p>
        </div>
      </div>
    );
  }

  // ── Exit confirm modal ────────────────────────────────────────────────────
  if (showExitConfirm) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
        <div className="max-w-md w-full rounded-2xl bg-[#1B2838] border border-[#2a3a4a] p-6">
          <h3 className="font-heading text-lg font-bold text-[#FFF5F2] mb-2">Exit Session?</h3>
          <p className="text-[#9aabb8] text-sm mb-6">
            Your progress so far ({answeredCount} answered) will be saved and session will be marked as abandoned.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowExitConfirm(false)}
              className="flex-1 py-2.5 rounded-xl border border-[#2a3a4a] text-[#9aabb8] hover:text-[#FFF5F2] transition-colors"
            >
              Keep Going
            </button>
            <button
              onClick={() => router.push("/dashboard/practice")}
              className="flex-1 py-2.5 rounded-xl bg-red-500/20 border border-red-500/30 text-red-400 font-bold hover:bg-red-500/30 transition-all"
            >
              Exit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-6 max-w-4xl mx-auto">

      {/* Top Bar */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setShowExitConfirm(true)}
          className="flex items-center gap-2 text-[#9aabb8] hover:text-[#FF6B6B] transition-colors text-sm"
        >
          <XMarkIcon className="h-5 w-5" />
          Exit
        </button>
        <div className="flex items-center gap-4 text-sm text-[#9aabb8]">
          <div className="flex items-center gap-1.5">
            <ClockIcon className="h-4 w-4" />
            <span className="font-mono">{formatTime(timeElapsed)}</span>
          </div>
          <span className="font-mono">
            {currentIndex + 1} / {session.questions.length}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-1.5 bg-[#2a3a4a] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#FF6B6B] rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-[#9aabb8] mt-1.5 font-mono">
          <span>{answeredCount} answered</span>
          <span>{session.questions.length - currentIndex - 1} remaining</span>
        </div>
      </div>

      {/* Question Card */}
      <div className="mb-6 p-6 rounded-2xl border border-[#2a3a4a] bg-[#1B2838]">
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="px-2 py-1 rounded-lg text-xs font-mono bg-[#FF6B6B]/10 text-[#FF6B6B]">
            {currentQuestion?.category}
          </span>
          <span className={`px-2 py-1 rounded-lg text-xs font-mono ${getDifficultyColor(currentQuestion?.difficulty || "")}`}>
            {currentQuestion?.difficulty}
          </span>
        </div>
        <h2 className="font-heading text-xl font-bold text-[#FFF5F2] mb-3 leading-snug">
          {currentQuestion?.title}
        </h2>
        {currentQuestion?.description && (
          <p className="text-[#9aabb8] font-body text-sm leading-relaxed">
            {currentQuestion.description}
          </p>
        )}
        {currentQuestion?.tags && currentQuestion.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {currentQuestion.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 rounded-md bg-[#0D1B2A] text-[#9aabb8] text-xs font-mono">
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Answer Section */}
      {!currentEval ? (
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#9aabb8] mb-2">
            Your Answer
          </label>
          <textarea
            ref={textareaRef}
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.ctrlKey) submitAnswer();
            }}
            placeholder="Type your answer here... (Ctrl+Enter to submit)"
            rows={6}
            disabled={evaluating}
            className="w-full p-4 rounded-xl bg-[#1B2838] border border-[#2a3a4a] text-[#FFF5F2] placeholder-[#4a5a6a] focus:border-[#FF6B6B]/40 outline-none transition-colors resize-none font-body text-sm leading-relaxed disabled:opacity-60"
          />
          <div className="flex items-center justify-between mt-3">
            <button
              onClick={skipQuestion}
              disabled={evaluating}
              className="text-sm text-[#9aabb8] hover:text-[#FFF5F2] transition-colors disabled:opacity-50"
            >
              Skip question →
            </button>
            <button
              onClick={submitAnswer}
              disabled={!userAnswer.trim() || evaluating}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold text-sm hover:bg-[#FFA07A] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {evaluating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#0D1B2A]" />
                  Evaluating...
                </>
              ) : (
                <>
                  <PaperAirplaneIcon className="h-4 w-4" />
                  Submit Answer
                </>
              )}
            </button>
          </div>
        </div>
      ) : (
        /* Enhanced Feedback Card */
        <div className="mb-6 p-6 rounded-2xl border border-[#FF6B6B]/20 bg-gradient-to-br from-[#FF6B6B]/5 to-transparent">
          <div className="flex items-center gap-2 mb-5">
            <SparklesIcon className="h-5 w-5 text-[#FF6B6B]" />
            <h3 className="font-heading text-lg font-bold text-[#FFF5F2]">AI Evaluation</h3>
          </div>

          {/* Result + Overall Score */}
          <div className="flex items-center gap-4 mb-5 flex-wrap">
            <span className={`px-3 py-1.5 rounded-xl border text-sm font-bold ${getResultBg(currentEval.result)} ${getResultColor(currentEval.result)}`}>
              {currentEval.result}
            </span>
            <div className="flex items-baseline gap-1">
              <span className={`text-3xl font-heading font-bold ${getScoreColor(currentEval.overallScore)}`}>
                {currentEval.overallScore}
              </span>
              <span className="text-[#9aabb8] text-sm font-mono">/ 10</span>
            </div>
            <div className="flex-1 h-2 bg-[#2a3a4a] rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  currentEval.overallScore >= 8 ? "bg-green-400" : currentEval.overallScore >= 5 ? "bg-yellow-400" : "bg-red-400"
                }`}
                style={{ width: `${(currentEval.overallScore / 10) * 100}%` }}
              />
            </div>
          </div>

          {/* Confidence Score (New) */}
          {currentEval.confidenceScore !== undefined && (
            <div className="mb-4 p-3 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a]">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[#9aabb8] text-xs font-mono flex items-center gap-1">
                  <ChatBubbleLeftRightIcon className="h-3 w-3" />
                  Confidence Score
                </p>
                <span className={`text-sm font-bold ${getScoreColor(currentEval.confidenceScore)}`}>
                  {currentEval.confidenceScore}/10
                </span>
              </div>
              <div className="h-1.5 bg-[#2a3a4a] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#FF6B6B] rounded-full transition-all"
                  style={{ width: `${(currentEval.confidenceScore / 10) * 100}%` }}
                />
              </div>
            </div>
          )}

          {/* Word Count Analysis (New) */}
          {currentEval.lengthAnalysis && (
            <div className="mb-4 p-3 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a]">
              <div className="flex items-center justify-between">
                <p className="text-[#9aabb8] text-xs font-mono">📝 Word Count</p>
                <span className={`text-xs font-bold ${currentEval.lengthAnalysis.lengthScore >= 7 ? "text-green-400" : "text-yellow-400"}`}>
                  {currentEval.lengthAnalysis.wordCount} words
                </span>
              </div>
              <p className="text-[#9aabb8] text-xs mt-1">{currentEval.lengthAnalysis.lengthFeedback}</p>
            </div>
          )}

          {/* Your Answer */}
          <div className="mb-4 p-3 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a]">
            <p className="text-[#9aabb8] text-xs font-mono mb-1">Your Answer:</p>
            <p className="text-[#FFF5F2] text-sm leading-relaxed">
              {answers[currentQuestion!.id]?.userAnswer}
            </p>
          </div>

          {/* Criteria Scores (New) */}
          {currentEval.criteriaScores && (
            <div className="mb-4 p-3 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a]">
              <p className="text-[#9aabb8] text-xs font-mono mb-3 flex items-center gap-1">
                <ChartBarIcon className="h-3 w-3" />
                Detailed Criteria Scores
              </p>
              <div className="space-y-2">
                {Object.entries(currentEval.criteriaScores).map(([key, score]) => (
                  <div key={key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[#9aabb8]">{getCriteriaLabel(key)}</span>
                      <span className={`font-bold ${getScoreColor(score as number)}`}>{score}/10</span>
                    </div>
                    <div className="h-1.5 bg-[#2a3a4a] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#FF6B6B] rounded-full transition-all"
                        style={{ width: `${((score as number) / 10) * 100}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* What Went Well (New) */}
          {currentEval.whatWentWell && currentEval.whatWentWell.length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-green-400/5 border border-green-400/10">
              <p className="text-green-400 text-xs font-mono mb-2 flex items-center gap-1">
                <CheckCircleIcon className="h-3 w-3" />
                ✅ What Went Well
              </p>
              <ul className="space-y-1">
                {currentEval.whatWentWell.map((item, idx) => (
                  <li key={idx} className="text-[#9aabb8] text-sm flex items-start gap-2">
                    <span className="text-green-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* What to Improve (New) */}
          {currentEval.whatToImprove && currentEval.whatToImprove.length > 0 && (
            <div className="mb-4 p-3 rounded-xl bg-yellow-400/5 border border-yellow-400/10">
              <p className="text-yellow-400 text-xs font-mono mb-2 flex items-center gap-1">
                <ArrowPathIcon className="h-3 w-3" />
                📈 Areas to Improve
              </p>
              <ul className="space-y-1">
                {currentEval.whatToImprove.map((item, idx) => (
                  <li key={idx} className="text-[#9aabb8] text-sm flex items-start gap-2">
                    <span className="text-yellow-400">•</span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Feedback */}
          <div className="mb-4">
            <p className="text-[#9aabb8] text-xs font-mono mb-1.5">📋 Feedback:</p>
            <p className="text-[#FFF5F2] text-sm leading-relaxed">{currentEval.feedback}</p>
          </div>

          {/* Improvement Tip */}
          {currentEval.improvementTip && (
            <div className="mb-4 p-3 rounded-xl bg-[#FF6B6B]/5 border border-[#FF6B6B]/10">
              <p className="text-[#FF6B6B] text-xs font-mono mb-1 flex items-center gap-1">
                <LightBulbIcon className="h-3 w-3" />
                💡 Improvement Tip:
              </p>
              <p className="text-[#9aabb8] text-sm leading-relaxed">{currentEval.improvementTip}</p>
            </div>
          )}

          {/* Sample Answer (New - Collapsible) */}
          {/* {currentEval.sampleAnswer && (
            <div className="mb-4">
              <button
                onClick={() => setShowSampleAnswer(!showSampleAnswer)}
                className="flex items-center gap-2 text-xs font-mono text-[#FF6B6B] hover:text-[#FFA07A] transition-colors"
              >
                <span>{showSampleAnswer ? "▼" : "▶"}</span>
                View Sample Answer
              </button>
              {showSampleAnswer && (
                <div className="mt-2 p-3 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a]">
                  <p className="text-[#9aabb8] text-sm leading-relaxed">{currentEval.sampleAnswer}</p>
                </div>
              )}
            </div>
          )} */}

          {currentEval.sampleAnswer && (
  <div className="mb-4">
    <button
      onClick={() => setShowSampleAnswer(!showSampleAnswer)}
      className="flex items-center gap-2 text-xs font-mono text-[#FF6B6B] hover:text-[#FFA07A] transition-colors"
    >
      <span>{showSampleAnswer ? "▼" : "▶"}</span>
      🎤 View Sample Answer (How to say it)
    </button>
    {showSampleAnswer && (
      <div className="mt-2 p-4 rounded-xl bg-gradient-to-r from-[#FF6B6B]/5 to-transparent border border-[#FF6B6B]/20">
        <div className="flex items-center gap-2 mb-2">
          <MicrophoneIcon className="h-4 w-4 text-[#FF6B6B]" />
          <span className="text-xs font-mono text-[#FF6B6B]">SPEAK LIKE THIS</span>
        </div>
        <p className="text-[#FFF5F2] text-sm leading-relaxed italic">
          "{currentEval.sampleAnswer}"
        </p>
        <div className="mt-2 flex items-center gap-2 text-xs text-[#9aabb8]">
          <span>💡 Tip: Practice saying this out loud</span>
        </div>
      </div>
    )}
  </div>
)}
{/* Confidence Analysis - More Detailed */}
{currentEval.confidenceScore !== undefined && (
  <div className="mb-4 p-3 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a]">
    <div className="flex items-center justify-between mb-2">
      <p className="text-[#9aabb8] text-xs font-mono flex items-center gap-1">
        <ChatBubbleLeftRightIcon className="h-3 w-3" />
        Confidence Score
      </p>
      <span className={`text-sm font-bold ${getScoreColor(currentEval.confidenceScore * 10)}`}>
        {currentEval.confidenceScore}/10
      </span>
    </div>
    <div className="h-1.5 bg-[#2a3a4a] rounded-full overflow-hidden mb-2">
      <div
        className="h-full bg-gradient-to-r from-yellow-400 to-green-400 rounded-full transition-all"
        style={{ width: `${(currentEval.confidenceScore / 10) * 100}%` }}
      />
    </div>
    {currentEval.confidenceAnalysis && (
      <p className="text-[#9aabb8] text-xs mt-2 italic">
        📊 {currentEval.confidenceAnalysis}
      </p>
    )}
    <div className="mt-2 flex gap-2 text-xs">
      {currentEval.confidenceScore <= 3 && (
        <span className="text-yellow-400">⚠️ Try to reduce hesitation words like "um", "like", "I think"</span>
      )}
      {currentEval.confidenceScore >= 7 && (
        <span className="text-green-400">✓ Great confidence! Your assertive language shows expertise.</span>
      )}
    </div>
  </div>
)}

          {/* Follow-up Questions (New - Collapsible) */}
          {currentEval.followUpQuestions && currentEval.followUpQuestions.length > 0 && (
            <div className="mb-4">
              <button
                onClick={() => setShowFollowUp(!showFollowUp)}
                className="flex items-center gap-2 text-xs font-mono text-[#FF6B6B] hover:text-[#FFA07A] transition-colors"
              >
                <span>{showFollowUp ? "▼" : "▶"}</span>
                Follow-up Questions to Practice
              </button>
              {showFollowUp && (
                <div className="mt-2 p-3 rounded-xl bg-[#0D1B2A] border border-[#2a3a4a]">
                  <ul className="space-y-2">
                    {currentEval.followUpQuestions.map((q, idx) => (
                      <li key={idx} className="text-[#9aabb8] text-sm flex items-start gap-2">
                        <span className="text-[#FF6B6B]">Q{idx + 1}:</span>
                        {q}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex gap-3 mt-6">
            {currentIndex > 0 && (
              <button
                onClick={() => {
                  setCurrentIndex((i) => i - 1);
                  setUserAnswer(answers[session.questions[currentIndex - 1].id]?.userAnswer || "");
                  setCurrentEval(answers[session.questions[currentIndex - 1].id]?.evaluation || null);
                  setShowSampleAnswer(false);
                  setShowFollowUp(false);
                }}
                className="flex items-center gap-1 px-4 py-2.5 rounded-xl border border-[#2a3a4a] text-[#9aabb8] hover:text-[#FFF5F2] hover:border-[#FF6B6B] transition-all text-sm"
              >
                <ChevronLeftIcon className="h-4 w-4" /> Previous
              </button>
            )}
            <button
              onClick={nextQuestion}
              className="flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl bg-[#FF6B6B] text-[#0D1B2A] font-heading font-bold text-sm hover:bg-[#FFA07A] transition-all"
            >
              {currentIndex + 1 === session.questions.length ? (
                <>
                  <CheckCircleIcon className="h-4 w-4" />
                  Finish & Get Results
                </>
              ) : (
                <>
                  Next Question
                  <ChevronRightIcon className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Question Navigator */}
      <div className="flex flex-wrap gap-2 mt-4">
        {session.questions.map((q, i) => {
          const isAnswered = !!answers[q.id];
          const isCurrent = i === currentIndex;
          return (
            <button
              key={q.id}
              onClick={() => {
                setCurrentIndex(i);
                setUserAnswer(answers[q.id]?.userAnswer || "");
                setCurrentEval(answers[q.id]?.evaluation || null);
                setShowSampleAnswer(false);
                setShowFollowUp(false);
              }}
              className={`w-8 h-8 rounded-lg text-xs font-mono font-bold transition-all ${
                isCurrent
                  ? "bg-[#FF6B6B] text-[#0D1B2A]"
                  : isAnswered
                  ? "bg-green-400/20 text-green-400 border border-green-400/30"
                  : "bg-[#1B2838] border border-[#2a3a4a] text-[#9aabb8] hover:border-[#FF6B6B]/40"
              }`}
            >
              {i + 1}
            </button>
          );
        })}
      </div>
    </div>
  );
}