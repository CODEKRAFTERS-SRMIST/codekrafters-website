"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Application, ApplicationStatus, UserSession } from "@/types/join";
import {
  getTimelineSteps,
  DOMAIN_TASKS_DATA,
  normalizeDomainKey,
} from "@/data/recruitmentTasks";
import {
  CheckCircle2,
  Clock,
  Calendar,
  Sparkles,
  ExternalLink,
  LogOut,
  Lock,
  MessageCircle,
  FileCode,
  Send,
  Layers,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

import { updateApplicationStatus } from "@/lib/api";

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
  Applied: {
    label: "Application Received",
    bg: "bg-slate-100",
    text: "text-slate-900",
    border: "border-slate-800",
    desc: "Your application has been received! Round 1 domain challenges unlock on Thursday, 17 September (Phase 2).",
  },
  "Task Ongoing": {
    label: "Round 1 Task Ongoing",
    bg: "bg-[#FFF2C6]",
    text: "text-[#0D0D0D]",
    border: "border-[#0D0D0D]",
    desc: "Phase 2 is live! Complete your domain challenge and submit your solution link before 24 September (11:59 PM).",
  },
  "Task Completed": {
    label: "Task Solution Submitted",
    bg: "bg-teal-100",
    text: "text-teal-950",
    border: "border-teal-800",
    desc: "Your domain task has been submitted successfully! Evaluators are reviewing submissions.",
  },
  "Under Review": {
    label: "Under Domain Review",
    bg: "bg-amber-100",
    text: "text-amber-950",
    border: "border-amber-800",
    desc: "Domain leads are actively reviewing your code, project architecture, and performance.",
  },
  Shortlisted: {
    label: "Shortlisted for Interview",
    bg: "bg-purple-100",
    text: "text-purple-900",
    border: "border-purple-800",
    desc: "Congratulations! You have been shortlisted for online interview rounds on 26-27 September.",
  },
  "Interview Scheduled": {
    label: "Interview Scheduled",
    bg: "bg-emerald-100",
    text: "text-emerald-900",
    border: "border-emerald-800",
    desc: "Your interview schedule is confirmed. Please check your email for the meeting invite & link.",
  },
  Accepted: {
    label: "Welcome to CodeKrafters!",
    bg: "bg-[#F2A516]",
    text: "text-[#0D0D0D]",
    border: "border-[#0D0D0D]",
    desc: "Application Accepted! Welcome aboard the CodeKrafters Core Team.",
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
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [tasksVisible, setTasksVisible] = useState<boolean>(false);
  const [localStatus, setLocalStatus] = useState<ApplicationStatus>(application.status || "Applied");
  // Modal & interactive submission state
  const [showSubmitModal, setShowSubmitModal] = useState<boolean>(false);
  const [activeDomainSubmit, setActiveDomainSubmit] = useState<string>(application.primaryDomain || application.domains[0] || "General");
  const [submittingTask, setSubmittingTask] = useState<boolean>(false);
  const [submissionSuccessToast, setSubmissionSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    async function loadSettings() {
      try {
        const res = await fetch("/api/admin/recruitment-settings");
        const data = await res.json();
        if (isMounted && data?.settings) {
          const phase = Number(data.settings.current_phase) || 1;
          const visible = Boolean(data.settings.tasks_visible);
          setCurrentPhase(phase);
          setTasksVisible(visible);

          // Automated status progression:
          // 1. If Applied and Phase 2 active / tasks visible -> Task Ongoing
          if (application.status === "Applied" && (phase >= 2 || visible)) {
            setLocalStatus("Task Ongoing");
          }
          // 2. If Task Ongoing and Phase 3+ (deadline over) -> Task Completed
          else if (application.status === "Task Ongoing" && phase >= 3) {
            setLocalStatus("Task Completed");
          } else {
            setLocalStatus(application.status || "Applied");
          }
        }
      } catch (e) {
        console.warn("Could not load recruitment settings:", e);
      }
    }
    loadSettings();
    return () => {
      isMounted = false;
    };
  }, [application.status]);

  const currentStatus = STATUS_CONFIG[localStatus] || STATUS_CONFIG["Applied"];
  const timelineSteps = getTimelineSteps(currentPhase);
  const isTaskUnlocked = tasksVisible;

  // Handle task submission
  async function handleConfirmTaskSubmit(e?: React.FormEvent) {
    if (e) e.preventDefault();
    setSubmittingTask(true);
    try {
      await updateApplicationStatus(
        application.id,
        "Task Completed"
      );
      setLocalStatus("Task Completed");
      setShowSubmitModal(false);
      setSubmissionSuccessToast("Task marked as submitted! Status updated to Task Completed.");
      setTimeout(() => setSubmissionSuccessToast(null), 4000);
    } catch (err: any) {
      alert(err.message || "Failed to update task status");
    } finally {
      setSubmittingTask(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto"
    >
      {/* Dashboard Title */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="mb-5 flex items-center gap-3"
      >
        <span className="text-[10px] font-black uppercase tracking-widest text-[#0D0D0D]/50 font-mono">&gt;_</span>
        <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#0D0D0D]">
          {(session.fullName || application.fullName || "Applicant").split(" ")[0]}
          <span className="text-[#F2A516]">'s</span> Dashboard
        </h1>
      </motion.div>

      <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-5 sm:p-10 shadow-[10px_10px_0_#0D0D0D] relative overflow-hidden">
        {/* Header Action Row */}
        <div className="flex items-center justify-between border-b-2 border-[#0D0D0D]/10 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-[#0D0D0D] text-[#FFEFB4] font-black text-lg flex items-center justify-center border-2 border-[#0D0D0D] shadow-[2px_2px_0_#F2A516]">
              {application.fullName ? application.fullName.charAt(0).toUpperCase() : "C"}
            </div>
            <div>
              <h3 className="font-extrabold text-[#0D0D0D] text-base sm:text-lg leading-tight">
                {application.fullName}
              </h3>
              <p className="text-xs text-[#555555] font-semibold">{application.email}</p>
            </div>
          </div>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0D0D0D] text-[#FFEFB4] text-xs font-black uppercase tracking-wider hover:text-[#F2A516] border-2 border-[#0D0D0D] shadow-[2px_2px_0_#F2A516] hover:translate-y-[-1px] transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" /> Sign Out
          </button>
        </div>

        {/* Success Toast */}
        {submissionSuccessToast && (
          <div className="mb-4 p-3 bg-emerald-100 border-2 border-emerald-800 text-emerald-900 rounded-xl text-xs font-black flex items-center gap-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-800 shrink-0" />
            {submissionSuccessToast}
          </div>
        )}

        {/* Status Highlight Banner */}
        <div
          className={`p-6 sm:p-8 rounded-2xl border-3 border-[#0D0D0D] ${currentStatus.bg} shadow-[5px_5px_0_#0D0D0D] mb-8 text-center relative overflow-hidden`}
        >
          {localStatus === "Accepted" && (
            <>
              <div className="absolute -top-4 -left-4 text-6xl opacity-20 rotate-12">🎉</div>
              <div className="absolute -bottom-4 -right-4 text-6xl opacity-20 -rotate-12">🎁</div>
            </>
          )}

          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-[#0D0D0D] text-[#FFEFB4] rounded-full text-xs font-black uppercase tracking-wider mb-2 shadow-[2px_2px_0_#F2A516] relative z-10">
            <Sparkles className="w-3.5 h-3.5 text-[#F2A516]" /> STATUS: {localStatus}
          </div>
          <h2 className="text-2xl sm:text-4xl font-black uppercase text-[#0D0D0D] tracking-tight relative z-10 mt-2">
            {currentStatus.label}
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#0D0D0D]/80 mt-2 max-w-lg mx-auto relative z-10">
            {currentStatus.desc}
          </p>
        </div>

        {/* ============================================================ */}
        {/* RECRUITMENT TIMELINE (Dynamically Highlighted by Current Phase) */}
        {/* ============================================================ */}
        <div className="mb-8 bg-[#FFEFB4] p-5 sm:p-7 rounded-2xl border-3 border-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D]">
          <div className="flex items-center justify-between mb-4 border-b-2 border-[#0D0D0D]/10 pb-3">
            <h4 className="text-sm font-black uppercase text-[#0D0D0D] flex items-center gap-2">
              <Clock className="w-4 h-4 text-[#F2A516]" /> Recruitment Roadmap & Schedule
            </h4>
            <span className="text-[11px] font-black uppercase bg-[#0D0D0D] text-[#FFEFB4] px-2.5 py-0.5 rounded-full">
              Phase {currentPhase} of 6
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {timelineSteps.map((step) => {
              const isCompleted = step.status === "completed";
              const isActive = step.status === "active";

              return (
                <div
                  key={step.phaseNumber}
                  className={`p-4 rounded-xl border-2 border-[#0D0D0D] transition-all ${
                    isActive
                      ? "bg-[#F2A516] text-[#0D0D0D] shadow-[3px_3px_0_#0D0D0D] ring-2 ring-[#0D0D0D]"
                      : isCompleted
                      ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[2px_2px_0_#0D0D0D]"
                      : "bg-[#FFF2C6] text-[#0D0D0D]"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span
                      className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md ${
                        isActive
                          ? "bg-[#0D0D0D] text-[#FFEFB4]"
                          : isCompleted
                          ? "bg-[#F2A516] text-[#0D0D0D]"
                          : "bg-[#0D0D0D]/10 text-[#0D0D0D]"
                      }`}
                    >
                      {step.date}
                    </span>
                    {isActive && (
                      <span className="flex h-2 w-2 relative">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0D0D0D] opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-[#0D0D0D]"></span>
                      </span>
                    )}
                  </div>
                  <h5 className="font-extrabold text-xs uppercase mb-1 leading-snug">
                    {step.phase}
                  </h5>
                  <p
                    className={`text-[11px] font-medium leading-normal ${
                      isCompleted ? "text-gray-300" : "text-[#333333]"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* DOMAIN-SPECIFIC TASKS & COMMUNITY HUB                        */}
        {/* ============================================================ */}
        <div className="mb-8 bg-[#f9f7e5] border-3 border-[#0D0D0D] p-5 sm:p-7 rounded-2xl shadow-[4px_4px_0_#0D0D0D]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-4 border-b-2 border-[#0D0D0D]/10 pb-3">
            <div>
              <h4 className="text-sm font-black uppercase text-[#0D0D0D] flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#F2A516]" /> Your Applied Domain Tasks & Communities
              </h4>
              <p className="text-xs font-semibold text-[#555555] mt-0.5">
                {isTaskUnlocked
                  ? "Tasks unlocked • Submissions close strictly on 24 Sep (11:59 PM)"
                  : currentPhase < 2
                  ? "Registrations ongoing • Round 1 task briefing & submission links unlock on 17 Sep (Phase 2)"
                  : "Task submission window has concluded for this cycle"}
              </p>
            </div>
            <span className="text-xs font-black uppercase px-2.5 py-1 bg-[#F2A516] text-[#0D0D0D] rounded-full border-2 border-[#0D0D0D]">
              {application.domains.length} {application.domains.length === 1 ? "Domain" : "Domains"} Applied
            </span>
          </div>

          <div className="space-y-4">
            {application.domains.map((domainName) => {
              const normalizedKey = normalizeDomainKey(domainName);
              const taskInfo =
                DOMAIN_TASKS_DATA[normalizedKey] || DOMAIN_TASKS_DATA["webdevelopment"];

              return (
                <div
                  key={domainName}
                  className="bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-2xl p-5 shadow-[4px_4px_0_#0D0D0D] transition-all hover:translate-y-[-1px]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2 mb-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 bg-[#0D0D0D] text-[#FFEFB4] text-[10px] font-black uppercase rounded-full">
                          {taskInfo.category}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-800/30">
                          Due: 24 Sep (11:59 PM)
                        </span>
                      </div>
                      <h5 className="text-base sm:text-lg font-black uppercase text-[#0D0D0D]">
                        {domainName} Challenge
                      </h5>
                      <p className="text-xs font-medium text-[#444444] mt-0.5 max-w-xl">
                        {taskInfo.tagline}
                      </p>
                    </div>

                    <div className="shrink-0">
                      {isTaskUnlocked ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-emerald-800 bg-emerald-100 px-2.5 py-1 rounded-full border border-emerald-700">
                          <Sparkles className="w-3 h-3 text-emerald-700" /> Active Briefing
                        </span>
                      ) : currentPhase < 2 ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-900 bg-amber-200/90 px-2.5 py-1 rounded-full border border-amber-800">
                          <Lock className="w-3 h-3 text-amber-900" /> Unlocks 17 Sep
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-rose-900 bg-rose-200 px-2.5 py-1 rounded-full border border-rose-800">
                          <Lock className="w-3 h-3 text-rose-900" /> Closed 24 Sep
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Task Action Bar */}
                  <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#0D0D0D]/10 mt-3">
                    {isTaskUnlocked ? (
                      <>
                        {/* Button 1: Dedicated Task Page */}
                        <Link
                          href={`/join/tasks/${taskInfo.slug}`}
                          className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#0D0D0D] shadow-[2px_2px_0_#F2A516] hover:translate-y-[-1px] transition-all cursor-pointer"
                        >
                          <FileCode className="w-3.5 h-3.5" /> View Task Briefing
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>

                        {/* Button 2: Official Submission Form (Synced from recruitmentTasks.ts) */}
                        {taskInfo.submissionLink ? (
                          <a
                            href={taskInfo.submissionLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#F2A516] text-[#0D0D0D] hover:bg-[#e09814] text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#0D0D0D] shadow-[2px_2px_0_#0D0D0D] hover:translate-y-[-1px] transition-all cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5 text-[#0D0D0D]" /> Open Submission Form
                            <ExternalLink className="w-3 h-3 opacity-60" />
                          </a>
                        ) : null}

                        {/* Button 3: Task Submitted Action */}
                        {localStatus === "Task Completed" ? (
                          <div className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-100 text-emerald-950 text-xs font-black uppercase tracking-wider rounded-xl border-2 border-emerald-800 shadow-[2px_2px_0_#0D0D0D]">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-800" /> Task Submitted
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => {
                              setActiveDomainSubmit(domainName);
                              setShowSubmitModal(true);
                            }}
                            className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#0D0D0D] shadow-[2px_2px_0_#F2A516] hover:translate-y-[-1px] transition-all cursor-pointer"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#F2A516]" /> Task Submitted
                          </button>
                        )}
                      </>
                    ) : (
                      /* Locked Notice when in Phase 1 or post-deadline */
                      <div className="flex items-center gap-2 px-3.5 py-2 bg-[#FFEFB4] border-2 border-dashed border-[#0D0D0D] rounded-xl text-xs font-bold text-[#0D0D0D]">
                        <Lock className="w-3.5 h-3.5 text-[#F2A516] shrink-0" />
                        <span>
                          {currentPhase < 2 ? (
                            <>
                              Task briefing and submission link unlock on{" "}
                              <strong>Thursday, 17 September (Phase 2)</strong>.
                            </>
                          ) : (
                            <>
                              Task submissions closed on{" "}
                              <strong>Thursday, 24 September (11:59 PM IST)</strong>.
                            </>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Button 3: Join WhatsApp Group (ALWAYS Accessible) */}
                    <a
                      href={taskInfo.whatsappLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#25D366] text-[#0D0D0D] hover:bg-[#20bd5a] text-xs font-black uppercase tracking-wider rounded-xl border-2 border-[#0D0D0D] shadow-[2px_2px_0_#0D0D0D] hover:translate-y-[-1px] transition-all cursor-pointer ml-auto"
                    >
                      <MessageCircle className="w-3.5 h-3.5 text-[#0D0D0D]" /> Join {domainName} WhatsApp
                      <ExternalLink className="w-3 h-3 opacity-60" />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================ */}
        {/* APPLICATION SUMMARY & CANDIDATE PROFILE                      */}
        {/* ============================================================ */}
        <div className="space-y-3 mb-4">
          <h4 className="text-xs font-black uppercase text-[#0D0D0D] flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-[#F2A516]" /> Application Summary
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-2xl font-medium text-[#0D0D0D] shadow-[2px_2px_0_#0D0D0D]">
              <span className="font-black uppercase block text-[10px] text-gray-700 mb-1">
                Applied Domains
              </span>
              <div className="flex flex-wrap gap-1.5">
                {application.domains.map((dom) => (
                  <span
                    key={dom}
                    className="bg-[#F2A516] text-[#0D0D0D] px-2.5 py-1 rounded-md font-black text-xs border border-[#0D0D0D] shadow-[1px_1px_0_#0D0D0D]"
                  >
                    {dom}
                  </span>
                ))}
              </div>
            </div>

            <div className="p-4 bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-2xl font-medium text-[#0D0D0D] shadow-[2px_2px_0_#0D0D0D]">
              <span className="font-black uppercase block text-[10px] text-gray-700 mb-1">
                Academic Details
              </span>
              <p className="font-extrabold text-xs text-[#0D0D0D]">
                {application.department} • {application.year}
              </p>
              {application.phone && (
                <p className="text-[11px] font-semibold text-gray-600 mt-1">
                  Contact: {application.phone}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE TASK SUBMISSION MODAL                            */}
        {/* ============================================================ */}
        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
            <div className="bg-[#FFF2C6] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-[8px_8px_0_#0D0D0D] relative space-y-5 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b-2 border-[#0D0D0D]/10 pb-3">
                <div>
                  <span className="text-[10px] font-black uppercase text-gray-700 tracking-wider">
                    {activeDomainSubmit} Submission
                  </span>
                  <h3 className="font-black text-lg uppercase text-[#0D0D0D] flex items-center gap-2">
                    <Send className="w-5 h-5 text-[#F2A516]" /> Submit Task Solution
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="text-sm font-black bg-[#0D0D0D] text-[#FFEFB4] w-8 h-8 rounded-full border-2 border-[#0D0D0D] flex items-center justify-center hover:bg-rose-600 hover:text-white transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Official Google Form Link Callout */}
              {(() => {
                const curKey = activeDomainSubmit ? normalizeDomainKey(activeDomainSubmit) : "";
                const curTask = curKey ? DOMAIN_TASKS_DATA[curKey] : null;
                if (!curTask?.submissionLink) return null;
                return (
                  <div className="p-3.5 bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl space-y-2 shadow-[2px_2px_0_#0D0D0D]">
                    <div className="text-xs font-black uppercase text-[#0D0D0D] flex items-center gap-1.5">
                      <Send className="w-3.5 h-3.5 text-[#0D0D0D]" /> Official {activeDomainSubmit} Submission Form
                    </div>
                    <p className="text-[11px] font-semibold text-[#333333]">
                      Make sure you have completed the official domain form/quiz before confirming:
                    </p>
                    <a
                      href={curTask.submissionLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] rounded-lg text-xs font-black uppercase tracking-wider transition-colors w-fit"
                    >
                      Open Official Form ➔ <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                );
              })()}

              <div className="p-3.5 bg-amber-50 border border-amber-900/20 rounded-xl text-xs font-bold text-amber-950 space-y-1">
                <p className="flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#F2A516] shrink-0" />
                  <span>Marking your task as submitted will:</span>
                </p>
                <ul className="list-disc list-inside text-[11px] font-medium text-amber-900 ml-1 space-y-0.5">
                  <li>Update your portal application status to <strong>Task Completed</strong>.</li>
                  <li>Notify domain leads and reviewers in the Admin Dashboard with a completion timestamp.</li>
                </ul>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowSubmitModal(false)}
                  className="px-4 py-2.5 rounded-xl border-2 border-[#0D0D0D] bg-white text-xs font-black uppercase tracking-wider text-[#0D0D0D] hover:bg-gray-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => handleConfirmTaskSubmit()}
                  disabled={submittingTask}
                  className="px-5 py-2.5 rounded-xl border-2 border-[#0D0D0D] bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] text-xs font-black uppercase tracking-wider shadow-[3px_3px_0_#F2A516] hover:translate-y-[-1px] transition-all cursor-pointer flex items-center gap-1.5"
                >
                  {submittingTask ? (
                    "Updating..."
                  ) : (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#F2A516]" /> Confirm Task Submitted
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
