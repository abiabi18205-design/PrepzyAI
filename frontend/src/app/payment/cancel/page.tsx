"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { XCircleIcon, SparklesIcon } from "@heroicons/react/24/outline";
import api from "@/lib/api";

export default function PaymentCancelPage() {
  const router = useRouter();

  const handleContinueFree = async () => {
    try {
      await api.post("/api/payment/activate-free");
    } catch (_) {}
    router.push("/dashboard");
  };

  const handleTryAgain = () => {
    router.push("/onboarding");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-sm w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: "spring", stiffness: 380 }}
          className="w-20 h-20 bg-orange-50 border-2 border-orange-200 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <XCircleIcon className="h-10 w-10 text-orange-400" />
        </motion.div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment cancelled</h1>
        <p className="text-gray-500 text-sm mb-8">
          No worries — you've been placed on the{" "}
          <span className="font-semibold text-gray-700">Free plan</span>. You can
          upgrade anytime from your dashboard.
        </p>

        <div className="space-y-3">
          <button
            onClick={handleContinueFree}
            className="w-full py-3 rounded-2xl bg-[#FF6B6B] text-white font-semibold text-sm hover:bg-[#e05c5c] transition-all shadow-lg shadow-[#FF6B6B]/25 flex items-center justify-center gap-2"
          >
            <SparklesIcon className="h-4 w-4" />
            Start with Free Plan
          </button>

          <button
            onClick={handleTryAgain}
            className="w-full py-3 rounded-2xl border border-gray-200 text-gray-600 font-medium text-sm hover:bg-gray-50 transition-all"
          >
            View plans again
          </button>
        </div>

        <p className="text-xs text-gray-400 mt-6">
          You were not charged. Questions? Contact{" "}
          <a href="mailto:support@prepzyai.com" className="text-[#FF6B6B] hover:underline">
            support@prepzyai.com
          </a>
        </p>
      </motion.div>
    </div>
  );
}
