"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import api from "@/lib/api";
import {
  SparklesIcon,
  PaperAirplaneIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import PaymentModal from "@/components/PaymentModal";

interface Message {
  role: "assistant" | "user";
  content: string;
}

interface OnboardingData {
  onboarding_complete: boolean;
  role: string;
  level: string;
  type: string;
  plan: string;
}

const PLAN_COLORS: Record<string, string> = {
  free: "bg-slate-500/20 text-slate-300 border-slate-500/30",
  pro: "bg-[#FF6B6B]/20 text-[#FF6B6B] border-[#FF6B6B]/30",
  premium: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
};

export default function OnboardingPage() {
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [onboardingData, setOnboardingData] = useState<OnboardingData | null>(null);
  const [redirecting, setRedirecting] = useState(false);
  const [started, setStarted] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Start onboarding on mount
  useEffect(() => {
    startOnboarding();
  }, []);

  const startOnboarding = async () => {
    setStarted(true);
    setLoading(true);
    try {
      const res = await api.post("/api/onboarding/chat", { messages: [] });
      if (res.data.success) {
        setMessages([{ role: "assistant", content: res.data.data.message }]);
      }
    } catch (err) {
      setMessages([{
        role: "assistant",
        content: "Hi! I'm your PrepzyAI onboarding assistant. What role are you preparing for? ",
      }]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || loading || redirecting) return;

    const userMessage = input.trim();
    setInput("");

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    setMessages(newMessages);
    setLoading(true);

    try {
      const res = await api.post("/api/onboarding/chat", {
        messages: newMessages,
      });

      if (res.data.success) {
        const { message, onboardingData: data } = res.data.data;

        setMessages([...newMessages, { role: "assistant", content: message }]);

        if (data?.onboarding_complete) {
          setOnboardingData(data);

          // Save preferences
          await api.post("/api/onboarding/preferences", {
            role: data.role,
            level: data.level,
            type: data.type,
            plan: data.plan,
          });

          // ✅ Save to localStorage for practice page filtering
          localStorage.setItem("onboarding", JSON.stringify({
            role: data.role,
            level: data.level,
            type: data.type,
            plan: data.plan,
          }));

          // Show payment modal instead of redirecting directly
          setTimeout(() => setShowPaymentModal(true), 1000);
        }
      }
    } catch (err) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I had a moment there. Could you say that again?",
        },
      ]);
    } finally {
      setLoading(false);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Quick reply chips
  const quickReplies: Record<number, string[]> = {
    1: ["Frontend", "Backend", "Data Science", "Full Stack", "DevOps"],
    2: ["Beginner", "Intermediate", "Advanced"],
    3: ["Technical", "HR", "Mixed"],
    4: ["Free", "Pro", "Premium"],
  };

  const getQuickReplies = () => {
    const userMsgCount = messages.filter((m) => m.role === "user").length;
    return quickReplies[userMsgCount + 1] || [];
  };

  if (redirecting) {
    return (
      <div className="min-h-screen bg-[#0D1B2A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 rounded-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/30 flex items-center justify-center mx-auto mb-6">
            <CheckCircleIcon className="h-10 w-10 text-[#FF6B6B]" />
          </div>
          <h2 className="text-2xl font-bold text-[#FFF5F2] mb-2">You're all set!</h2>
          <p className="text-[#9aabb8] mb-6">Taking you to your personalized dashboard...</p>
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF6B6B]" />
            <span className="text-[#9aabb8] text-sm">Redirecting...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D1B2A] flex flex-col">

      {/* Payment Modal Overlay */}
      {showPaymentModal && (
        <PaymentModal
          onFreePlan={() => {
            setShowPaymentModal(false);
            router.push("/dashboard");
          }}
          onSuccess={(plan) => {
            setShowPaymentModal(false);
            router.push("/dashboard");
          }}
        />
      )}

      {/* Header */}
      <div className="border-b border-[#2a3a4a] px-6 py-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-[#FF6B6B] flex items-center justify-center">
          <SparklesIcon className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="font-bold text-[#FFF5F2] text-sm">PrepzyAI Onboarding</h1>
          <p className="text-[#9aabb8] text-xs">Let's personalize your experience</p>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-[#9aabb8] text-xs">AI Active</span>
        </div>
      </div>

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-2 py-4 border-b border-[#2a3a4a]">
        {[1, 2, 3, 4].map((step) => {
          const userCount = messages.filter((m) => m.role === "user").length;
          const isDone = userCount >= step;
          const isCurrent = userCount === step - 1;
          return (
            <div key={step} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                isDone
                  ? "bg-[#FF6B6B] text-white"
                  : isCurrent
                  ? "bg-[#FF6B6B]/20 text-[#FF6B6B] border border-[#FF6B6B]/40"
                  : "bg-[#1B2838] text-[#4a5a6a] border border-[#2a3a4a]"
              }`}>
                {isDone ? "✓" : step}
              </div>
              {step < 4 && (
                <div className={`w-8 h-px ${isDone ? "bg-[#FF6B6B]" : "bg-[#2a3a4a]"}`} />
              )}
            </div>
          );
        })}
      </div>
      <div className="flex justify-center gap-10 text-xs text-[#4a5a6a] pb-3 pt-1">
        <span>Role</span>
        <span>Level</span>
        <span>Type</span>
        <span>Plan</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-4 max-w-2xl mx-auto w-full">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
            {msg.role === "assistant" && (
              <div className="w-8 h-8 rounded-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/30 flex items-center justify-center mr-3 flex-shrink-0 mt-1">
                <SparklesIcon className="h-4 w-4 text-[#FF6B6B]" />
              </div>
            )}
            <div className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
              msg.role === "user"
                ? "bg-[#FF6B6B] text-white rounded-br-sm"
                : "bg-[#1B2838] border border-[#2a3a4a] text-[#FFF5F2] rounded-bl-sm"
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Loading indicator */}
        {loading && (
          <div className="flex justify-start">
            <div className="w-8 h-8 rounded-full bg-[#FF6B6B]/20 border border-[#FF6B6B]/30 flex items-center justify-center mr-3 flex-shrink-0">
              <SparklesIcon className="h-4 w-4 text-[#FF6B6B]" />
            </div>
            <div className="bg-[#1B2838] border border-[#2a3a4a] rounded-2xl rounded-bl-sm px-4 py-3">
              <div className="flex gap-1.5 items-center">
                <div className="w-2 h-2 rounded-full bg-[#FF6B6B] animate-bounce" style={{ animationDelay: "0ms" }} />
                <div className="w-2 h-2 rounded-full bg-[#FF6B6B] animate-bounce" style={{ animationDelay: "150ms" }} />
                <div className="w-2 h-2 rounded-full bg-[#FF6B6B] animate-bounce" style={{ animationDelay: "300ms" }} />
              </div>
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Quick Reply Chips */}
      {!loading && !onboardingData && getQuickReplies().length > 0 && (
        <div className="px-4 pb-3 max-w-2xl mx-auto w-full">
          <div className="flex flex-wrap gap-2">
            {getQuickReplies().map((reply) => (
              <button
                key={reply}
                onClick={() => {
                  setInput(reply);
                  setTimeout(() => sendMessage(), 0);
                }}
                className="px-3 py-1.5 rounded-xl bg-[#1B2838] border border-[#2a3a4a] text-[#9aabb8] text-xs hover:border-[#FF6B6B]/40 hover:text-[#FF6B6B] transition-all"
              >
                {reply}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      {!onboardingData && (
        <div className="border-t border-[#2a3a4a] px-4 py-4 max-w-2xl mx-auto w-full">
          <div className="flex items-center gap-3 bg-[#1B2838] border border-[#2a3a4a] rounded-2xl px-4 py-2.5 focus-within:border-[#FF6B6B]/40 transition-colors">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your answer..."
              disabled={loading || redirecting}
              className="flex-1 bg-transparent text-[#FFF5F2] placeholder-[#4a5a6a] text-sm outline-none disabled:opacity-50"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || loading || redirecting}
              className="w-8 h-8 rounded-xl bg-[#FF6B6B] flex items-center justify-center hover:bg-[#FFA07A] transition-all disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
            >
              <PaperAirplaneIcon className="h-4 w-4 text-white" />
            </button>
          </div>
          <p className="text-[#4a5a6a] text-xs text-center mt-2">Press Enter to send</p>
        </div>
      )}
    </div>
  );
}