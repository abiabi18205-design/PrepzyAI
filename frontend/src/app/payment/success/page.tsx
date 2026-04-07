"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import api from "@/lib/api";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<"confirming" | "done" | "error">("confirming");
  const [plan, setPlan] = useState("pro");

  useEffect(() => {
    const confirm = async () => {
      const sessionId = searchParams.get("session_id");
      const mock = searchParams.get("mock");
      const mockPlan = searchParams.get("plan") || "pro";

      try {
        const res = await api.post("/api/payment/confirm-session", {
          sessionId,
          mock,
          plan: mockPlan,
        });

        if (res.data.success) {
          setPlan(res.data.data.plan);
          // Update localStorage
          const onboarding = JSON.parse(localStorage.getItem("onboarding") || "{}");
          localStorage.setItem("onboarding", JSON.stringify({ ...onboarding, plan: res.data.data.plan }));
          setStatus("done");
          setTimeout(() => router.push("/dashboard"), 2500);
        } else {
          setStatus("error");
        }
      } catch {
        setStatus("error");
      }
    };

    confirm();
  }, [router, searchParams]);

  if (status === "error") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <p className="text-red-500 font-semibold mb-2">Something went wrong confirming your payment.</p>
          <p className="text-gray-500 text-sm mb-4">Don't worry — your payment may have gone through. Contact support if charged.</p>
          <button
            onClick={() => router.push("/dashboard")}
            className="bg-[#FF6B6B] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#e05c5c] transition-all"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="bg-white rounded-3xl shadow-xl p-10 text-center max-w-sm w-full"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 400 }}
          className="w-20 h-20 bg-green-50 border-2 border-green-200 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircleIcon className="h-10 w-10 text-green-500" />
        </motion.div>

        {status === "confirming" ? (
          <>
            <h1 className="text-xl font-bold text-gray-900 mb-2">Confirming payment…</h1>
            <p className="text-gray-500 text-sm">Please wait a moment.</p>
            <div className="mt-6 flex justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#FF6B6B]" />
            </div>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
              Welcome to {plan}! 🎉
            </h1>
            <p className="text-gray-500 text-sm mb-6">
              Your plan is now active. Taking you to your dashboard…
            </p>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-400">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#FF6B6B]" />
              Redirecting…
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
