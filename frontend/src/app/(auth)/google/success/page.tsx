"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { saveToken } from "@/lib/api";

function GoogleSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    const token = searchParams.get("token");
    
    if (token) {
      saveToken(token);
      console.log("✅ Token saved:", token);
      
      // ✅ Redirect to dashboard instead of home page
      setTimeout(() => {
        router.push("/dashboard");
        router.refresh(); // Force refresh to update auth state
      }, 1000);
    } else {
      console.log("❌ No token found in URL");
      // Redirect to login if no token
      setTimeout(() => {
        router.push("/login?error=google_auth_failed");
      }, 1000);
    }
  }, [searchParams, router]);

  return (
    <div style={{ 
      minHeight: "100vh", 
      display: "flex", 
      flexDirection: "column",
      alignItems: "center", 
      justifyContent: "center", 
      background: "#0D1B2A" 
    }}>
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FF6B6B]/20 bg-[#FF6B6B]/5 mb-6">
          <span className="w-2 h-2 rounded-full bg-[#FF6B6B] animate-pulse" />
          <span className="text-[#FF6B6B] text-xs font-mono">Authenticating</span>
        </div>
        
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B] mx-auto mb-4"></div>
        
        <p className="text-[#FF6B6B] font-mono text-sm">
          Signing you in with Google...
        </p>
        <p className="text-[#9aabb8] text-xs mt-2">
          Please wait, redirecting to dashboard
        </p>
      </div>
    </div>
  );
}

export default function GoogleSuccessPage() {
  return (
    <Suspense fallback={
      <div style={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center", 
        background: "#0D1B2A" 
      }}>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
      </div>
    }>
      <GoogleSuccess />
    </Suspense>
  );
}