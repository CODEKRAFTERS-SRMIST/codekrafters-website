"use client";

import React, { useState, useEffect } from "react";
import { Russo_One } from "next/font/google";
import { UserSession } from "@/types/join";
import {
  User,
  LogOut,
  Sparkles,
  Shield,
  Crown,
  Terminal,
  Code2,
  KeyRound,
  Eye,
  EyeOff,
  ChevronDown,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { motion, AnimatePresence } from "framer-motion";

const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });

export default function UserProfile() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Change password state
  const [showChangePw, setShowChangePw] = useState(false);
  const [oldPw, setOldPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showOldPw, setShowOldPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const rawSession = localStorage.getItem("codekrafters_user_session");
    if (rawSession) {
      setSession(JSON.parse(rawSession));
      setIsLoading(false);
    } else {
      window.location.href = "/login?redirect=/profile";
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("codekrafters_user_session");
    window.location.href = "/";
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (!oldPw || !newPw || !confirmPw) {
      setPwMsg({ type: "error", text: "Please fill in all password fields." });
      return;
    }
    if (newPw !== confirmPw) {
      setPwMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (newPw.length < 6) {
      setPwMsg({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: session?.id, oldPassword: oldPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwMsg({ type: "success", text: "Password changed successfully!" });
        setOldPw(""); setNewPw(""); setConfirmPw("");
        setTimeout(() => setShowChangePw(false), 2000);
      } else {
        setPwMsg({ type: "error", text: data.error || "Failed to change password." });
      }
    } catch {
      setPwMsg({ type: "error", text: "Network error. Please try again." });
    } finally {
      setPwLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFEFB4] flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D0D0D]"></div>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FFEFB4] flex flex-col font-sans relative overflow-x-hidden">
      {/* Background Tech Grid */}
      <div
        className="absolute inset-0 opacity-[0.08]"
        style={{
          backgroundImage:
            "linear-gradient(#0D0D0D 1px, transparent 1px), linear-gradient(90deg, #0D0D0D 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      ></div>
      <Navbar />

      <div className="flex-1 p-4 sm:p-8 flex items-center justify-center pt-28 pb-12 relative z-10">
        {/* Main ID Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 50, rotateX: 10 }}
          animate={{ opacity: 1, y: 0, rotateX: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="w-full max-w-xl bg-[#f9f7e5] border-[3px] border-[#0D0D0D] rounded-[2rem] p-6 sm:p-10 shadow-[16px_16px_0_#0D0D0D] text-[#0D0D0D] relative perspective-1000"
        >
          {/* Top Lanyard Hole */}
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-8 bg-[#FFEFB4] border-[3px] border-[#0D0D0D] rounded-full shadow-[inset_0_-4px_0_rgba(0,0,0,0.1)] z-20 flex items-center justify-center">
            <div className="w-8 h-3 bg-[#0D0D0D] rounded-full opacity-20"></div>
          </div>

          {/* Decorative Corner Accents */}
          <Sparkles className="absolute top-6 left-6 w-5 h-5 text-[#F2A516] opacity-50" />
          <Code2 className="absolute bottom-6 right-6 w-5 h-5 text-[#0D0D0D] opacity-20" />

          {/* Badge classification */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", bounce: 0.5 }}
            className="absolute top-6 right-6 bg-[#F2A516] text-[10px] sm:text-xs font-black uppercase px-3 py-1.5 rounded-full border-2 border-[#0D0D0D] shadow-[3px_3px_0_#0D0D0D] flex items-center gap-1.5 transform hover:scale-110 transition-transform cursor-default"
          >
            {session.role === "PRESIDENT" ? (
              <Crown className="w-3.5 h-3.5" />
            ) : session.role === "DOMAIN_ADMIN" ? (
              <Shield className="w-3.5 h-3.5" />
            ) : (
              <Terminal className="w-3.5 h-3.5" />
            )}
            {session.role === "PRESIDENT" ? "PRESIDENT" : session.role === "DOMAIN_ADMIN" ? "DOMAIN ADMIN" : "APPLICANT"}
          </motion.div>

          {/* Profile Header */}
          <div className="flex flex-col items-center mb-8 mt-6">
            <div className="relative mb-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute -inset-2 rounded-full border-2 border-dashed border-[#F2A516] opacity-50"
              />
              <div className="w-28 h-28 bg-[#0D0D0D] rounded-full border-[3px] border-[#F2A516] flex items-center justify-center shadow-[6px_6px_0_#0D0D0D] relative z-10 overflow-hidden group">
                <User className="w-14 h-14 text-[#FFEFB4] group-hover:scale-110 transition-transform duration-300" />

                {/* Glowing inner shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_20px_rgba(242,165,22,0.3)] rounded-full"></div>
              </div>

              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.5, type: "spring" }}
                className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-[3px] border-[#0D0D0D] z-20 flex items-center justify-center"
              >
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
              </motion.div>
            </div>

            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className={`${russoOne.className} text-3xl sm:text-4xl font-black text-center uppercase tracking-tight leading-none mb-3`}
            >
              {session.fullName || session.email.split("@")[0]}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 bg-[#FFF2C6] px-4 py-2 rounded-full border-2 border-[#0D0D0D] text-sm font-bold shadow-[3px_3px_0_#0D0D0D]"
            >
              <span className="w-2 h-2 rounded-full bg-[#F2A516] animate-ping"></span>
              {session.email}
            </motion.div>
          </div>

          <div className="space-y-5">

            {/* Admin Command Center */}
            {(session.role === "PRESIDENT" || session.role === "DOMAIN_ADMIN") && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="mt-8 pt-6 border-t-[3px] border-dashed border-[#0D0D0D]/20 space-y-3 relative"
              >
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#f9f7e5] px-4">
                  <h3 className="text-[10px] font-black uppercase text-[#0D0D0D] tracking-widest flex items-center gap-2">
                    <Terminal className="w-3 h-3" /> Command Center
                  </h3>
                </div>

                <button
                  onClick={() => (window.location.href = "/join")}
                  className="w-full bg-[#FFF2C6] text-[#0D0D0D] hover:bg-[#F2A516] font-black uppercase py-4 px-5 rounded-xl border-[3px] border-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D] hover:translate-y-[-3px] hover:shadow-[6px_6px_0_#0D0D0D] transition-all flex items-center justify-between group"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#0D0D0D] rounded-full group-hover:scale-150 transition-transform"></div>
                    Recruitment Dash
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>

                <button
                  onClick={() => (window.location.href = "/admin/events")}
                  className="w-full bg-[#FFF2C6] text-[#0D0D0D] hover:bg-[#F2A516] font-black uppercase py-4 px-5 rounded-xl border-[3px] border-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D] hover:translate-y-[-3px] hover:shadow-[6px_6px_0_#0D0D0D] transition-all flex items-center justify-between group"
                >
                  <span className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#0D0D0D] rounded-full group-hover:scale-150 transition-transform"></div>
                    Events Manager
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform">
                    →
                  </span>
                </button>

                {session.role === "PRESIDENT" && (
                  <button
                    onClick={() => (window.location.href = "/join?tab=users")}
                    className="w-full bg-[#0D0D0D] text-[#FFEFB4] hover:bg-[#1a1a1a] font-black uppercase py-4 px-5 rounded-xl border-[3px] border-[#F2A516] shadow-[4px_4px_0_#F2A516] hover:translate-y-[-3px] hover:shadow-[6px_6px_0_#F2A516] transition-all flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-3">
                      <Crown className="w-4 h-4 text-[#F2A516]" />
                      User Management
                    </span>
                    <span className="text-[#F2A516] group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>
                )}
              </motion.div>
            )}

            {/* Change Password */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4"
            >
              <button
                onClick={() => { setShowChangePw(!showChangePw); setPwMsg(null); }}
                className="w-full bg-[#FFF2C6] text-[#0D0D0D] font-black uppercase py-3.5 px-5 rounded-2xl border-[3px] border-[#0D0D0D] shadow-[3px_3px_0_#0D0D0D] hover:translate-y-[-2px] hover:shadow-[5px_5px_0_#0D0D0D] transition-all flex items-center justify-between group"
              >
                <span className="flex items-center gap-2">
                  <KeyRound className="w-4 h-4 text-[#F2A516]" /> Change Password
                </span>
                <ChevronDown className={`w-4 h-4 transition-transform duration-300 ${showChangePw ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {showChangePw && (
                  <motion.form
                    key="changepw"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    onSubmit={handleChangePassword}
                    className="overflow-hidden"
                  >
                    <div className="mt-3 p-5 bg-white border-[3px] border-[#0D0D0D] rounded-2xl shadow-[3px_3px_0_#0D0D0D] space-y-4">
                      {/* Old Password */}
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-[#555] mb-1.5">Current Password</label>
                        <div className="relative">
                          <input
                            type={showOldPw ? "text" : "password"}
                            value={oldPw}
                            onChange={(e) => setOldPw(e.target.value)}
                            placeholder="Enter current password"
                            className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2.5 text-sm font-bold text-[#0D0D0D] placeholder-[#0D0D0D]/30 focus:outline-none focus:ring-2 focus:ring-[#F2A516] pr-10"
                          />
                          <button type="button" onClick={() => setShowOldPw(!showOldPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0D0D0D]/50 hover:text-[#0D0D0D] transition-colors">
                            {showOldPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* New Password */}
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-[#555] mb-1.5">New Password</label>
                        <div className="relative">
                          <input
                            type={showNewPw ? "text" : "password"}
                            value={newPw}
                            onChange={(e) => setNewPw(e.target.value)}
                            placeholder="Min. 6 characters"
                            className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2.5 text-sm font-bold text-[#0D0D0D] placeholder-[#0D0D0D]/30 focus:outline-none focus:ring-2 focus:ring-[#F2A516] pr-10"
                          />
                          <button type="button" onClick={() => setShowNewPw(!showNewPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0D0D0D]/50 hover:text-[#0D0D0D] transition-colors">
                            {showNewPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                          </button>
                        </div>
                      </div>

                      {/* Confirm Password */}
                      <div>
                        <label className="block text-[10px] font-black uppercase tracking-wider text-[#555] mb-1.5">Confirm New Password</label>
                        <input
                          type="password"
                          value={confirmPw}
                          onChange={(e) => setConfirmPw(e.target.value)}
                          placeholder="Re-enter new password"
                          className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2.5 text-sm font-bold text-[#0D0D0D] placeholder-[#0D0D0D]/30 focus:outline-none focus:ring-2 focus:ring-[#F2A516]"
                        />
                      </div>

                      {/* Feedback message */}
                      {pwMsg && (
                        <div className={`p-3 rounded-xl text-xs font-black border-2 ${
                          pwMsg.type === "success"
                            ? "bg-emerald-100 border-emerald-800 text-emerald-900"
                            : "bg-rose-100 border-rose-800 text-rose-900"
                        }`}>
                          {pwMsg.text}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={pwLoading}
                        className="w-full bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] font-black uppercase py-3 px-5 rounded-xl border-2 border-[#0D0D0D] shadow-[3px_3px_0_#F2A516] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#F2A516] transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        <KeyRound className="w-4 h-4" />
                        {pwLoading ? "Updating..." : "Update Password"}
                      </button>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={handleLogout}
              className="w-full mt-4 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] font-black uppercase py-4 px-6 rounded-2xl border-[3px] border-[#0D0D0D] shadow-[4px_4px_0_#F2A516] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#F2A516] transition-all flex items-center justify-center gap-2 overflow-hidden relative group"
            >
              <div className="absolute inset-0 bg-white/10 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300"></div>
              <LogOut className="w-5 h-5 relative z-10" />
              <span className="tracking-widest relative z-10">
                Log Out
              </span>
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
