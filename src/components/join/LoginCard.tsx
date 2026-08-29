"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { UserRole, UserSession } from "@/types/join";
import { User, ShieldCheck, Mail, Lock, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

interface LoginCardProps {
  onLoginSuccess: (session: UserSession) => void;
}

export function LoginCard({ onLoginSuccess }: LoginCardProps) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, fullName: isSignUp ? fullName : undefined, action: isSignUp ? "SIGN_UP" : "SIGN_IN" }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed.");
      }

      onLoginSuccess({
        id: data.user.id,
        email: data.user.email,
        role: data.user.role,
        admin_level: data.user.admin_level,
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
      className="w-full max-w-md mx-auto"
    >
      {/* Outer Card Container */}
      <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0_#0D0D0D] relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#F2A516]/30 rounded-full blur-2xl pointer-events-none" />

        {/* Header Title */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-full text-xs font-bold text-[#0D0D0D] mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A516]" />
            CODEKRAFTERS PORTAL
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#0D0D0D] tracking-tight">
            {isSignUp ? "Sign Up" : "Sign In"}
          </h2>
          <p className="text-xs sm:text-sm text-[#333333] font-medium mt-1">
            {isSignUp ? "Create a new CodeKrafters account." : "Access your CodeKrafters account."}
          </p>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {isSignUp && (
            <div>
              <label className="block text-xs font-bold text-[#0D0D0D] uppercase mb-1">
                Full Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Morgan"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#0D0D0D] uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-3.5 text-[#0D0D0D]/60" />
              <input
                type="email"
                required
                placeholder="john@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#0D0D0D] uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-3.5 text-[#0D0D0D]/60" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl pl-10 pr-4 py-2.5 text-sm font-semibold text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D]"
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
            disabled={loading}
            className="w-full mt-2 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] border-2 border-[#0D0D0D] py-3 px-6 rounded-full font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-[4px_4px_0_#F2A516] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#F2A516] transition-all duration-200 disabled:opacity-50 cursor-pointer"
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

        <div className="mt-4 text-center">
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError("");
            }}
            className="text-xs font-bold text-[#333333] hover:text-[#F2A516] transition-colors"
          >
            {isSignUp ? "Already have an account? Sign In" : "Don't have an account? Sign Up"}
          </button>
        </div>

        {/* Feature Highlights */}
        <div className="mt-6 pt-4 border-t-2 border-[#0D0D0D]/10 text-center">
          <div className="flex items-center justify-center gap-4 text-[11px] font-bold text-[#333333]">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F2A516]" /> Instant Sync
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F2A516]" /> Multi-Domain
            </span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#F2A516]" /> Real-time Admin
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
