"use client";

import React from "react";
import { motion } from "framer-motion";
import { Application, UserSession } from "@/types/join";
import { CheckCircle2, Clock, Calendar, Sparkles, ExternalLink, RefreshCw, LogOut, Lock } from "lucide-react";

interface ApplicationStatusCardProps {
  application: Application;
  session: UserSession;
  onEditRequested: () => void;
  onLogout: () => void;
}

const STATUS_CONFIG: Record<
  string,
  { label: string; bg: string; text: string; border: string; desc: string }
> = {
  Pending: {
    label: "Application Received",
    bg: "bg-blue-100",
    text: "text-blue-900",
    border: "border-blue-800",
    desc: "Your application has been received and queued for review.",
  },
  "Under Review": {
    label: "Under Domain Review",
    bg: "bg-amber-100",
    text: "text-amber-900",
    border: "border-amber-800",
    desc: "Domain leads are currently reviewing your work showcases.",
  },
  Shortlisted: {
    label: "Shortlisted for Interview",
    bg: "bg-purple-100",
    text: "text-purple-900",
    border: "border-purple-800",
    desc: "Congratulations! You have been shortlisted for interview rounds.",
  },
  "Interview Scheduled": {
    label: "Interview Scheduled",
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    border: "border-emerald-800",
    desc: "Your interview details will be sent via email shortly.",
  },
  Accepted: {
    label: "Welcome to CodeKrafters!",
    bg: "bg-[#F2A516]",
    text: "text-[#0D0D0D]",
    border: "border-[#0D0D0D]",
    desc: "Application Accepted! Welcome aboard the team.",
  },
  Rejected: {
    label: "Application Closed",
    bg: "bg-rose-100",
    text: "text-rose-900",
    border: "border-rose-800",
    desc: "Thank you for applying. Recruitments for this cycle are complete.",
  },
};

export function ApplicationStatusCard({
  application,
  session,
  onEditRequested,
  onLogout,
}: ApplicationStatusCardProps) {
  const currentStatus = STATUS_CONFIG[application.status] || STATUS_CONFIG["Pending"];

  const steps = ["Pending", "Under Review", "Shortlisted", "Interview Scheduled", "Accepted"];
  const currentStepIndex = steps.indexOf(application.status);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-10 shadow-[10px_10px_0_#0D0D0D] relative overflow-hidden">
        {/* Header Action Row */}
        <div className="flex items-center justify-between border-b-2 border-[#0D0D0D]/10 pb-4 mb-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-[#0D0D0D] text-[#FFEFB4] font-extrabold flex items-center justify-center border-2 border-[#0D0D0D] shadow-[2px_2px_0_#F2A516]">
              {application.fullName.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="font-extrabold text-[#0D0D0D] text-base">{application.fullName}</h3>
              <p className="text-xs text-[#333333] font-medium">{application.email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#0D0D0D] text-[#FFEFB4] text-xs font-bold hover:text-[#F2A516] border-2 border-[#0D0D0D] shadow-[2px_2px_0_#F2A516] cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Status Highlight Banner */}
        <div
          className={`p-6 sm:p-10 rounded-2xl border-3 border-[#0D0D0D] ${currentStatus.bg} shadow-[4px_4px_0_#0D0D0D] mb-8 text-center relative overflow-hidden`}
        >
          {/* Animated Background Elements for Accepted */}
          {application.status === "Accepted" && (
            <>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="absolute -top-4 -left-4 text-6xl opacity-20 rotate-12"
              >
                🎉
              </motion.div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1.2, 1] }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -bottom-4 -right-4 text-6xl opacity-20 -rotate-12"
              >
                🎁
              </motion.div>
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="text-5xl mb-4 animate-bounce"
              >
                🎊
              </motion.div>
            </>
          )}

          {/* Animated Elements for Rejected */}
          {application.status === "Rejected" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-4 flex items-center justify-center"
            >
              <div className="p-4 bg-rose-200/50 rounded-full border-2 border-rose-900/20">
                <Lock className="w-10 h-10 text-rose-900" />
              </div>
            </motion.div>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-1 bg-[#0D0D0D] text-[#FFEFB4] rounded-full text-xs font-extrabold uppercase mb-2 shadow-[2px_2px_0_#F2A516] relative z-10">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A516]" /> Status: {application.status}
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold uppercase text-[#0D0D0D] tracking-tight relative z-10 mt-2">
            {currentStatus.label}
          </h2>
          <p className="text-sm sm:text-base font-bold text-[#0D0D0D]/80 mt-2 max-w-lg mx-auto relative z-10">
            {currentStatus.desc}
          </p>
        </div>

        {/* Recruitment Timeline Progress */}
        {application.status !== "Rejected" && (
          <div className="mb-8 bg-[#FFEFB4] p-5 rounded-2xl border-2 border-[#0D0D0D] shadow-[3px_3px_0_#0D0D0D]">
            <h4 className="text-xs font-extrabold uppercase text-[#0D0D0D] mb-4 flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-[#F2A516]" /> Recruitment Progress Timeline
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
              {["Submitted", "Under Review", "Shortlisted", "Final Decision"].map((stepLabel, idx) => {
                const isPassed = currentStepIndex >= idx;
                const isCurrent = currentStepIndex === idx;

                return (
                  <div
                    key={stepLabel}
                    className={`p-2.5 rounded-xl border-2 border-[#0D0D0D] font-bold text-xs ${isCurrent
                        ? "bg-[#F2A516] text-[#0D0D0D] shadow-[2px_2px_0_#0D0D0D]"
                        : isPassed
                          ? "bg-[#0D0D0D] text-[#FFEFB4]"
                          : "bg-[#FFF2C6] text-[#0D0D0D]/40 border-dashed"
                      }`}
                  >
                    <div className="text-[10px] uppercase opacity-75">Step 0{idx + 1}</div>
                    <div className="mt-0.5">{stepLabel}</div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Application Details Summary */}
        <div className="space-y-3 mb-8">
          <h4 className="text-xs font-extrabold uppercase text-[#0D0D0D]">
            Application Summary
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-[#FFF2C6] border border-[#0D0D0D] rounded-xl font-medium text-[#0D0D0D]">
              <span className="font-extrabold uppercase block text-[10px] text-[#333333]">
                Applied Domains
              </span>
              <div className="flex flex-wrap gap-1 mt-1">
                {application.domains.map((dom) => (
                  <span
                    key={dom}
                    className="bg-[#F2A516] text-[#0D0D0D] px-2 py-0.5 rounded-md font-bold text-[11px] border border-[#0D0D0D]"
                  >
                    {dom}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-3 bg-[#FFF2C6] border border-[#0D0D0D] rounded-xl font-medium text-[#0D0D0D]">
              <span className="font-extrabold uppercase block text-[10px] text-[#333333]">
                Academic Details
              </span>
              <p className="font-bold text-xs mt-1">
                {application.department} • {application.year}
              </p>
            </div>
          </div>
        </div>

      </div>
    </motion.div>
  );
}
