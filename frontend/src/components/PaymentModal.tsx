"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckIcon,
  ShieldCheckIcon,
  LockClosedIcon,
  ArrowPathIcon,
  SparklesIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import api from "@/lib/api";

interface PaymentModalProps {
  onFreePlan: () => void;
  onSuccess: (plan: string) => void;
}

const benefits = {
  free: [
    "3 AI Mock Interviews/month",
    "Basic question bank",
    "Standard feedback",
    "Email support",
  ],
  pro: [
    "Unlimited AI Mock Interviews",
    "Smart AI Feedback & Scoring",
    "Full question bank access",
    "Priority email support",
    "Detailed performance analytics",
    "Interview replay & review",
  ],
  premium: [
    "Everything in Pro",
    "1-on-1 AI coaching sessions",
    "Custom role-specific paths",
    "Priority access to new features",
    "Resume & LinkedIn review",
    "Dedicated success manager",
  ],
};

const pricing = {
  pro: { monthly: 12, yearly: 9 },
  premium: { monthly: 29, yearly: 22 },
};

export default function PaymentModal({ onFreePlan, onSuccess }: PaymentModalProps) {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [selectedPlan, setSelectedPlan] = useState<"pro" | "premium">("pro");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpgrade = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/api/payment/create-checkout-session", {
        plan: selectedPlan,
        billing,
      });
      if (res.data.success) {
        window.location.href = res.data.data.url;
      } else {
        setError("Could not create payment session. Please try again.");
      }
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
          "Payment service unavailable. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFree = async () => {
    try {
      await api.post("/api/payment/activate-free");
    } catch (_) {}
    onFreePlan();
  };

  return (
    <AnimatePresence>
      {/* Backdrop */}
      <motion.div
        key="backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{ backdropFilter: "blur(12px)", backgroundColor: "rgba(13,27,42,0.85)" }}
      >
        {/* Modal */}
        <motion.div
          key="modal"
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 12 }}
          transition={{ type: "spring", stiffness: 320, damping: 28 }}
          className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-8 pt-8 pb-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-[#FF6B6B]/10 border border-[#FF6B6B]/20 flex items-center justify-center">
                  <SparklesIcon className="h-4 w-4 text-[#FF6B6B]" />
                </div>
                <span className="font-bold text-gray-900 text-lg">
                  Prepzy<span className="text-[#FF6B6B]">AI</span>
                </span>
              </div>
              <button
                onClick={handleFree}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-lg hover:bg-gray-100"
                title="Close"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              Choose your plan
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Start your AI interview prep journey. Upgrade anytime.
            </p>

            {/* Billing toggle */}
            <div className="flex items-center gap-3 mt-5">
              <button
                onClick={() => setBilling("monthly")}
                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-all ${
                  billing === "monthly"
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBilling("yearly")}
                className={`text-sm font-medium px-4 py-1.5 rounded-full transition-all flex items-center gap-2 ${
                  billing === "yearly"
                    ? "bg-gray-900 text-white"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                Yearly
                <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                  Save 25%
                </span>
              </button>
            </div>
          </div>

          {/* Plan cards */}
          <div className="p-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Free */}
            <motion.div
              whileHover={{ y: -2 }}
              onClick={() => {}}
              className="border border-gray-200 rounded-2xl p-5 flex flex-col bg-gray-50 opacity-80"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
                  Free
                </span>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">$0</span>
                <span className="text-gray-400 text-sm">/mo</span>
              </div>
              <ul className="space-y-2 flex-1">
                {benefits.free.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-500">
                    <CheckIcon className="h-4 w-4 text-gray-400 flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
              <button
                onClick={handleFree}
                className="mt-5 w-full py-2 rounded-xl border border-gray-300 text-gray-500 text-sm font-medium hover:bg-gray-100 transition-all"
              >
                Current Plan
              </button>
            </motion.div>

            {/* Pro */}
            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => setSelectedPlan("pro")}
              className={`border-2 rounded-2xl p-5 flex flex-col cursor-pointer transition-all ${
                selectedPlan === "pro"
                  ? "border-[#FF6B6B] bg-[#FF6B6B]/5 shadow-lg shadow-[#FF6B6B]/10"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-[#FF6B6B] uppercase tracking-wide">
                  Pro
                </span>
                <span className="text-xs bg-[#FF6B6B]/10 text-[#FF6B6B] px-2 py-0.5 rounded-full font-semibold">
                  Popular
                </span>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${pricing.pro[billing]}
                </span>
                <span className="text-gray-400 text-sm">/mo</span>
                {billing === "yearly" && (
                  <span className="ml-2 text-xs text-gray-400 line-through">
                    ${pricing.pro.monthly}
                  </span>
                )}
              </div>
              <ul className="space-y-2 flex-1">
                {benefits.pro.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckIcon className="h-4 w-4 text-[#FF6B6B] flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
              <div
                className={`mt-4 h-0.5 rounded-full transition-all ${
                  selectedPlan === "pro" ? "bg-[#FF6B6B]/30" : "bg-transparent"
                }`}
              />
            </motion.div>

            {/* Premium */}
            <motion.div
              whileHover={{ y: -3 }}
              onClick={() => setSelectedPlan("premium")}
              className={`border-2 rounded-2xl p-5 flex flex-col cursor-pointer transition-all ${
                selectedPlan === "premium"
                  ? "border-amber-400 bg-amber-50/50 shadow-lg shadow-amber-200/40"
                  : "border-gray-200 bg-white"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-semibold text-amber-600 uppercase tracking-wide">
                  Premium
                </span>
                <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-semibold">
                  Best Value
                </span>
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  ${pricing.premium[billing]}
                </span>
                <span className="text-gray-400 text-sm">/mo</span>
                {billing === "yearly" && (
                  <span className="ml-2 text-xs text-gray-400 line-through">
                    ${pricing.premium.monthly}
                  </span>
                )}
              </div>
              <ul className="space-y-2 flex-1">
                {benefits.premium.map((b) => (
                  <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                    <CheckIcon className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                ))}
              </ul>
              <div
                className={`mt-4 h-0.5 rounded-full transition-all ${
                  selectedPlan === "premium" ? "bg-amber-400/40" : "bg-transparent"
                }`}
              />
            </motion.div>
          </div>

          {/* CTA */}
          <div className="px-6 pb-6">
            {error && (
              <p className="text-red-500 text-sm text-center mb-3">{error}</p>
            )}

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={handleUpgrade}
              disabled={loading}
              className={`w-full py-3.5 rounded-2xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                selectedPlan === "pro"
                  ? "bg-[#FF6B6B] hover:bg-[#e05c5c] text-white shadow-lg shadow-[#FF6B6B]/30"
                  : "bg-amber-500 hover:bg-amber-600 text-white shadow-lg shadow-amber-300/30"
              } disabled:opacity-70 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <ArrowPathIcon className="h-4 w-4 animate-spin" />
                  Redirecting to payment...
                </>
              ) : (
                <>
                  <SparklesIcon className="h-4 w-4" />
                  Upgrade to {selectedPlan === "pro" ? "Pro" : "Premium"} — $
                  {pricing[selectedPlan][billing]}/mo
                </>
              )}
            </motion.button>

            <button
              onClick={handleFree}
              className="w-full mt-3 py-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
            >
              Continue with Free Plan →
            </button>

            {/* Trust signals */}
            <div className="flex items-center justify-center gap-6 mt-5 pt-4 border-t border-gray-100">
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <LockClosedIcon className="h-3.5 w-3.5" />
                Secure payment
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <ShieldCheckIcon className="h-3.5 w-3.5" />
                30-day guarantee
              </div>
              <div className="flex items-center gap-1.5 text-gray-400 text-xs">
                <ArrowPathIcon className="h-3.5 w-3.5" />
                Cancel anytime
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
