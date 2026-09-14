"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Cookie, X } from "lucide-react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    try {
      const consent = localStorage.getItem("ck_cookie_consent");
      if (!consent) {
        // Small delay for smooth entry
        const timer = setTimeout(() => setShowBanner(true), 1200);
        return () => clearTimeout(timer);
      }
    } catch {
      // In case localStorage is disabled
    }
  }, []);

  const handleAccept = (type: "all" | "essential") => {
    try {
      localStorage.setItem("ck_cookie_consent", type);
    } catch {
      // Ignored
    }
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div
      role="region"
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50 animate-in fade-in slide-in-from-bottom-5 duration-300"
    >
      <div className="bg-[#0D0D0D]/95 backdrop-blur-xl border border-[#F2A516]/30 rounded-2xl p-5 shadow-[0_8px_32px_rgba(0,0,0,0.8)] text-[#FFEFB4]">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-[#F2A516]/15 border border-[#F2A516]/30 text-[#F2A516]">
              <Cookie className="w-5 h-5" />
            </div>
            <h3 className="text-sm font-semibold text-white flex items-center gap-1.5">
              Cookie & Privacy Notice
            </h3>
          </div>
          <button
            onClick={() => handleAccept("essential")}
            className="text-white/40 hover:text-white p-1 transition-colors"
            aria-label="Dismiss cookie notice"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-[#FFEFB4]/70 leading-relaxed mb-4">
          We use essential cookies to maintain secure sessions and ensure website stability. Read our{" "}
          <Link href="/privacy" className="text-[#F2A516] underline hover:text-[#FFEFB4]">
            Privacy Policy
          </Link>{" "}
          for more information.
        </p>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => handleAccept("all")}
            className="flex-1 px-4 py-2 rounded-xl bg-[#F2A516] text-[#0D0D0D] text-xs font-semibold hover:bg-[#FFA500] transition-colors shadow-[2px_2px_0_#000]"
          >
            Accept All
          </button>
          <button
            onClick={() => handleAccept("essential")}
            className="px-4 py-2 rounded-xl bg-white/5 border border-white/15 text-white/80 hover:text-white hover:bg-white/10 text-xs font-medium transition-colors"
          >
            Essential Only
          </button>
        </div>
      </div>
    </div>
  );
}
