"use client";

import React, { useState, useEffect } from "react";
import { Russo_One } from "next/font/google";
import { UserSession } from "@/types/join";
import {
  User,
  LogOut,
  Sparkles,
  Zap,
  Shield,
  Crown,
  Terminal,
  Code2,
} from "lucide-react";
import { Navbar } from "@/components/navbar";
import { motion } from "framer-motion";

const russoOne = Russo_One({ subsets: ["latin"], weight: "400" });

export default function UserProfile() {
  const [session, setSession] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const rawSession = localStorage.getItem("codekrafters_user_session");
    if (rawSession) {
      setSession(JSON.parse(rawSession));
      setIsLoading(false);
    } else {
      setSession(null);
      setIsLoading(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("codekrafters_user_session");
    window.location.href = "/";
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
    return (
      <div className="min-h-screen bg-[#FFEFB4] flex flex-col font-sans relative overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage: "radial-gradient(#0D0D0D 1px, transparent 1px)",
            backgroundSize: "32px 32px",
          }}
        ></div>
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-4 pt-24 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-[#f9f7e5] border-[3px] border-[#0D0D0D] rounded-3xl p-8 sm:p-12 shadow-[12px_12px_0_#0D0D0D] max-w-lg w-full text-center relative overflow-hidden"
          >
            <div className="w-20 h-20 bg-[#F2A516] rounded-full border-4 border-[#0D0D0D] flex items-center justify-center mx-auto mb-6 shadow-[4px_4px_0_#0D0D0D] relative z-10">
              <User className="w-10 h-10 text-[#0D0D0D]" />
            </div>
            <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#0D0D0D] tracking-tight mb-3">
              ACCESS DENIED
            </h2>
            <p className="text-sm text-[#333333] font-bold mb-8">
              You must authenticate your identity to view the CodeKrafters
              manifest.
            </p>
            <button
              onClick={() =>
                (window.location.href = "/login?redirect=/profile")
              }
              className="w-full bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] border-[3px] border-[#0D0D0D] py-4 px-6 rounded-full font-black text-sm sm:text-base uppercase tracking-widest shadow-[6px_6px_0_#F2A516] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_#F2A516] transition-all flex items-center justify-center gap-2"
            >
              <Zap className="w-5 h-5" /> INITIALIZE LOGIN
            </button>
          </motion.div>
        </div>
      </div>
    );
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
            {session.role === "ADMIN" ? (
              <Crown className="w-3.5 h-3.5" />
            ) : (
              <Terminal className="w-3.5 h-3.5" />
            )}
            {session.role === "ADMIN" ? "SYS_ADMIN" : "User"}
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
            {/* Stats Dashboard */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="grid grid-cols-2 gap-4 mb-2"
            >
              <div className="p-4 bg-white border-[3px] border-[#0D0D0D] rounded-2xl flex flex-col items-center justify-center text-center shadow-[4px_4px_0_#0D0D0D] relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="absolute top-0 right-0 w-16 h-16 bg-[#FFEFB4] rounded-bl-full -z-0 opacity-50 group-hover:scale-150 transition-transform duration-500"></div>
                <span className="font-black text-[#0D0D0D] text-3xl mb-1 relative z-10 group-hover:text-[#F2A516] transition-colors">
                  0
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-extrabold text-[#333333] relative z-10 tracking-wider">
                  Events Attended
                </span>
              </div>
              <div className="p-4 bg-white border-[3px] border-[#0D0D0D] rounded-2xl flex flex-col items-center justify-center text-center shadow-[4px_4px_0_#0D0D0D] relative overflow-hidden group hover:-translate-y-1 transition-transform">
                <div className="absolute top-0 left-0 w-16 h-16 bg-[#F2A516] rounded-br-full -z-0 opacity-20 group-hover:scale-150 transition-transform duration-500"></div>
                <span className="font-black text-[#0D0D0D] text-3xl mb-1 relative z-10 group-hover:text-[#F2A516] transition-colors">
                  1
                </span>
                <span className="text-[10px] sm:text-xs uppercase font-extrabold text-[#333333] relative z-10 tracking-wider">
                  Active Apps
                </span>
              </div>
            </motion.div>

            {/* Clearance Level */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="p-4 bg-white border-[3px] border-[#0D0D0D] rounded-2xl flex justify-between items-center shadow-[4px_4px_0_#0D0D0D]"
            >
              <span className="font-extrabold text-sm uppercase flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#F2A516]" /> Clearance Level
              </span>
              <span className="text-xs uppercase font-black bg-[#0D0D0D] text-[#FFEFB4] px-4 py-2 rounded-lg border-2 border-[#F2A516] shadow-[2px_2px_0_#F2A516] tracking-widest">
                {session.role === "ADMIN"
                  ? `Lvl_${session.admin_level || "LEAD"}`
                  : "Lvl_APPLICANT"}
              </span>
            </motion.div>

            {/* Admin Command Center */}
            {session.role === "ADMIN" && (
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

                {session.admin_level === "PRESIDENT" && (
                  <button
                    onClick={() => (window.location.href = "/admin/president")}
                    className="w-full bg-[#0D0D0D] text-[#FFEFB4] hover:bg-[#1a1a1a] font-black uppercase py-4 px-5 rounded-xl border-[3px] border-[#F2A516] shadow-[4px_4px_0_#F2A516] hover:translate-y-[-3px] hover:shadow-[6px_6px_0_#F2A516] transition-all flex items-center justify-between group"
                  >
                    <span className="flex items-center gap-3">
                      <Crown className="w-4 h-4 text-[#F2A516]" />
                      Core Control
                    </span>
                    <span className="text-[#F2A516] group-hover:translate-x-1 transition-transform">
                      →
                    </span>
                  </button>
                )}
              </motion.div>
            )}

            <motion.button
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              onClick={handleLogout}
              className="w-full mt-8 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] font-black uppercase py-4 px-6 rounded-2xl border-[3px] border-[#0D0D0D] shadow-[4px_4px_0_#F2A516] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#F2A516] transition-all flex items-center justify-center gap-2 overflow-hidden relative group"
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
