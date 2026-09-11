"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { UserRole, UserSession } from "@/types/join";
import { Mail, Lock, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

interface LoginCardProps {
  onLoginSuccess: (session: UserSession) => void;
  defaultIsSignUp?: boolean;
}

export function LoginCard({ onLoginSuccess, defaultIsSignUp = false }: LoginCardProps) {
  const [isSignUp, setIsSignUp] = useState(defaultIsSignUp);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const err = params.get("error");
      if (err === "oauth_failed") {
        setError("Google authentication was cancelled or failed. Please try again.");
      } else if (err === "oauth_registration_failed") {
        setError("Could not register account via Google. Please contact CodeKrafters admins.");
      }
    } catch (e) { }
  }, []);

  const handleGoogleSignIn = async () => {
    setError("");
    setOauthLoading(true);

    try {
      const supabase = createClient();
      const searchParams = new URLSearchParams(window.location.search);
      const redirect = searchParams.get("redirect") || "/profile";

      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/api/auth/callback?redirect=${encodeURIComponent(redirect)}`,
        },
      });

      if (oauthError) throw oauthError;
    } catch (err: any) {
      setError(err.message || "Failed to connect to Google.");
      setOauthLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    if (isSignUp && !fullName) {
      setError("Full Name is required for sign up.");
      return;
    }

    if (!password) {
      setError("Password is required.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isSignUp ? "/api/auth/signup" : "/api/auth/login";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName: isSignUp ? fullName : undefined }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      onLoginSuccess({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        domain_id: data.user.domain_id,
        fullName: data.user.fullName,
      });
    } catch (err: any) {
      setError(err.message || "Failed to authenticate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-xl mx-auto"
    >
      {/* Outer Card Container */}
      <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-5 sm:p-8 shadow-[8px_8px_0_#0D0D0D] relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F2A516]/30 rounded-full blur-2xl pointer-events-none" />

        {/* Header Title & Toggle */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-full text-[13px] font-bold text-[#0D0D0D] mb-5 shadow-[2px_2px_0_#F2A516]">
            <Sparkles className="w-4 h-4 text-[#F2A516]" />
            CODEKRAFTERS PORTAL
          </div>

          {/* Toggle Switch */}
          <div className="relative flex items-center bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-full p-1.5 w-full max-w-[320px] mx-auto mb-4 shadow-[3px_3px_0_#0D0D0D]">
            <motion.div
              className="absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-[#0D0D0D] rounded-full shadow-sm pointer-events-none"
              initial={false}
              animate={{ left: isSignUp ? "calc(50% + 3px)" : "6px" }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
            <button
              type="button"
              onClick={() => { setIsSignUp(false); setError(""); }}
              className={`relative flex-1 py-2.5 text-sm font-black uppercase tracking-wider z-10 transition-colors ${!isSignUp ? "text-[#FFEFB4]" : "text-[#0D0D0D]"}`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => { setIsSignUp(true); setError(""); }}
              className={`relative flex-1 py-2.5 text-sm font-black uppercase tracking-wider z-10 transition-colors ${isSignUp ? "text-[#FFEFB4]" : "text-[#0D0D0D]"}`}
            >
              Sign Up
            </button>
          </div>

          <p className="text-sm text-[#333333] font-bold mt-2">
            {isSignUp ? "Create a CodeKrafters account with your real email." : "Access your CodeKrafters account."}
          </p>
        </div>

        {/* Real Email OAuth Provider */}
        <div className="mb-5">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={oauthLoading || loading}
            className="w-full bg-white hover:bg-[#FFF2C6] text-[#0D0D0D] border-3 border-[#0D0D0D] py-3.5 px-6 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-3 shadow-[4px_4px_0_#0D0D0D] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#F2A516] transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{oauthLoading ? "Connecting to Google..." : "Continue with Google"}</span>
          </button>
        </div>

        {/* Or Divider */}
        <div className="relative flex items-center justify-center mb-5">
          <div className="border-t-2 border-[#0D0D0D]/15 w-full"></div>
          <span className="bg-[#f9f7e5] px-3 text-[10px] font-black uppercase text-[#0D0D0D]/50 tracking-wider whitespace-nowrap">
            OR USE EMAIL & PASSWORD
          </span>
          <div className="border-t-2 border-[#0D0D0D]/15 w-full"></div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-extrabold text-[#0D0D0D] uppercase mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-3 text-base font-bold text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-extrabold text-[#0D0D0D] uppercase mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-5 h-5 absolute left-4 top-3.5 text-[#0D0D0D]/60 pointer-events-none" />
              <input
                type="email"
                required
                placeholder="john@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl pl-12 pr-4 py-3 text-base font-bold text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-extrabold text-[#0D0D0D] uppercase mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-5 h-5 absolute left-4 top-3.5 text-[#0D0D0D]/60 pointer-events-none" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl pl-12 pr-4 py-3 text-base font-bold text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D]"
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-100 border-2 border-red-500 text-red-800 text-xs font-bold p-3 rounded-xl shadow-[2px_2px_0_#0D0D0D]">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || oauthLoading}
            className="w-full mt-3 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] border-2 border-[#0D0D0D] py-3.5 px-6 rounded-full font-black text-base uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0_#F2A516] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#F2A516] transition-all duration-200 disabled:opacity-50 cursor-pointer"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>{isSignUp ? "Create Account" : "Sign In"}</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Feature Highlights */}
        <div className="mt-6 pt-4 border-t-2 border-[#0D0D0D]/10 text-center">
          <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-[11px] font-bold text-[#333333]">
            <span className="flex items-center gap-1 whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F2A516]" /> Verified Emails Only
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F2A516]" /> Instant Supabase Sync
            </span>
            <span className="flex items-center gap-1 whitespace-nowrap">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F2A516]" /> Real-time Portal
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
