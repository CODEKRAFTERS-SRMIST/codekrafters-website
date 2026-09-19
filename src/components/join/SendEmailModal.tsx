"use client";

import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  X,
  Send,
  Mail,
  Calendar,
  Clock,
  Video,
  MapPin,
  Eye,
  Edit3,
  Sparkles,
  AlertCircle,
  Layers,
  SkipForward,
  CheckCircle2,
} from "lucide-react";
import { Application, UserRole } from "@/types/join";
import {
  generateShortlistEmailHtml,
  generateTasksLiveEmailHtml,
  generateFinalSelectionEmailHtml,
  generateCustomBroadcastEmailHtml,
} from "@/lib/email-templates";


export type EmailModalMode =
  | "SHORTLIST_INDIVIDUAL"
  | "SHORTLIST_BATCH"
  | "TASKS_LIVE_BROADCAST"
  | "SELECTION_OFFER"
  | "CUSTOM_UPDATE";

interface SendEmailModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: EmailModalMode;
  candidate?: Application | null;
  targetDomain?: string;
  batchCount?: number;
  onSuccess?: (message: string) => void;
  userRole?: UserRole;
}

export function SendEmailModal({
  isOpen,
  onClose,
  mode,
  candidate,
  targetDomain = "ALL",
  batchCount = 0,
  onSuccess,
  userRole,
}: SendEmailModalProps) {
  const isExecutive = userRole === "PRESIDENT" || userRole === "VICE_PRESIDENT";

  const initialMode = useMemo(() => {
    if (mode === "TASKS_LIVE_BROADCAST" && !isExecutive && userRole) {
      return candidate ? "SHORTLIST_INDIVIDUAL" : "SHORTLIST_BATCH";
    }
    return mode;
  }, [mode, isExecutive, userRole, candidate]);

  const [currentMode, setCurrentMode] = useState<EmailModalMode>(initialMode);
  const [activeTab, setActiveTab] = useState<"COMPOSE" | "PREVIEW">("COMPOSE");

  React.useEffect(() => {
    if (mode === "TASKS_LIVE_BROADCAST" && !isExecutive && userRole) {
      setCurrentMode(candidate ? "SHORTLIST_INDIVIDUAL" : "SHORTLIST_BATCH");
    } else {
      setCurrentMode(mode);
    }
  }, [mode, isExecutive, userRole, candidate]);

  // Form states
  const [subject, setSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [interviewDate, setInterviewDate] = useState("Saturday, 26 September 2026");
  const [interviewTime, setInterviewTime] = useState("10:00 AM - 10:30 AM");
  const [meetingLink, setMeetingLink] = useState("https://meet.google.com/xyz-codekrafters");
  const [venue, setVenue] = useState("Google Meet (Online)");
  const [deadline, setDeadline] = useState("24 September (11:59 PM)");
  const [onboardingLink, setOnboardingLink] = useState("https://codekraftersrmp.in/profile");

  // Batch Range & Recovery States
  const isBatchMode =
    currentMode === "TASKS_LIVE_BROADCAST" ||
    currentMode === "SHORTLIST_BATCH" ||
    (currentMode === "SELECTION_OFFER" && !candidate);

  const [batchOffset, setBatchOffset] = useState<number>(0);
  const [batchSize, setBatchSize] = useState<number>(100);
  const [autoSendAllBatches, setAutoSendAllBatches] = useState<boolean>(true);

  const [sending, setSending] = useState(false);
  const [progressStatus, setProgressStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Compute recipient details
  const recipientSummary = useMemo(() => {
    if (currentMode === "SHORTLIST_INDIVIDUAL" || (currentMode === "SELECTION_OFFER" && candidate)) {
      return {
        title: candidate?.fullName || "Candidate",
        sub: `${candidate?.email || ""} • Domain: ${candidate?.primaryDomain || targetDomain}`,
        badge: "1 Recipient",
      };
    }
    if (currentMode === "SELECTION_OFFER" && !candidate) {
      const remaining = Math.max(0, batchCount - batchOffset);
      return {
        title: `All Accepted Members`,
        sub: `Target Domain: ${targetDomain === "ALL" ? "All Domains" : targetDomain}${
          batchOffset > 0 ? ` • Skipping first ${batchOffset}` : ""
        }`,
        badge: `${remaining} of ${batchCount} Candidates`,
      };
    }
    if (currentMode === "SHORTLIST_BATCH") {
      const remaining = Math.max(0, batchCount - batchOffset);
      return {
        title: `All Shortlisted Applicants`,
        sub: `Target Domain: ${targetDomain === "ALL" ? "All Domains" : targetDomain}${
          batchOffset > 0 ? ` • Skipping first ${batchOffset}` : ""
        }`,
        badge: `${remaining} of ${batchCount} Shortlisted`,
      };
    }
    if (currentMode === "TASKS_LIVE_BROADCAST") {
      const remaining = Math.max(0, (batchCount || 456) - batchOffset);
      return {
        title: `All Registered Applicants`,
        sub: `Task Launch Broadcast • Domain: ${targetDomain === "ALL" ? "All Domains" : targetDomain}${
          batchOffset > 0 ? ` • Starting from #${batchOffset + 1}` : ""
        }`,
        badge: `${remaining} of ${batchCount || 456} Applicants`,
      };
    }
    return {
      title: "Recipients",
      sub: `Domain: ${targetDomain}`,
      badge: `${batchCount || 1} Recipients`,
    };
  }, [currentMode, candidate, targetDomain, batchCount, batchOffset]);

  // Compute live rendered HTML for preview
  const previewData = useMemo(() => {
    const candidateName = candidate?.fullName || "Alex Rivera";
    const domainName =
      candidate?.primaryDomain || (targetDomain !== "ALL" ? targetDomain : "Web Development");

    if (currentMode === "SHORTLIST_INDIVIDUAL" || currentMode === "SHORTLIST_BATCH") {
      return generateShortlistEmailHtml({
        candidateName,
        domainName,
        subject: subject.trim() || undefined,
        customMessage: customMessage.trim() || undefined,
        interviewDate,
        interviewTime,
        meetingLink,
        venue,
      });
    }

    if (currentMode === "TASKS_LIVE_BROADCAST") {
      return generateTasksLiveEmailHtml({
        candidateName,
        domains: candidate?.domains || [domainName],
        deadline,
        customMessage: customMessage.trim() || undefined,
      });
    }

    if (currentMode === "SELECTION_OFFER") {
      return generateFinalSelectionEmailHtml({
        candidateName,
        domainName,
        customMessage: customMessage.trim() || undefined,
        onboardingLink,
      });
    }

    return generateCustomBroadcastEmailHtml({
      candidateName,
      title: subject || "Update from CodeKrafters",
      message: customMessage || "Important update regarding your recruitment application.",
    });
  }, [
    currentMode,
    candidate,
    targetDomain,
    subject,
    customMessage,
    interviewDate,
    interviewTime,
    meetingLink,
    venue,
    deadline,
    onboardingLink,
  ]);

  if (!isOpen) return null;

  const handleSend = async () => {
    setSending(true);
    setError(null);
    setProgressStatus("Preparing email payload...");

    try {
      if (currentMode === "SHORTLIST_INDIVIDUAL") {
        if (!candidate?.id) throw new Error("No candidate selected");

        const res = await fetch("/api/admin/email/shortlisted", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            applicationId: candidate.id,
            domain: candidate.primaryDomain,
            subject: subject.trim() || undefined,
            customMessage: customMessage.trim() || undefined,
            interviewDate,
            interviewTime,
            meetingLink,
            venue,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send shortlist email");

        onSuccess?.(`Shortlist & interview invitation sent to ${candidate.fullName}!`);
        onClose();
      } else if (currentMode === "SHORTLIST_BATCH") {
        let currentOffset = batchOffset;
        let hasMore = true;
        let totalDispatched = 0;
        let batchIndex = 1;

        while (hasMore) {
          setProgressStatus(
            `Dispatching batch #${batchIndex} (Offset: ${currentOffset}, Limit: ${batchSize})...`
          );

          const res = await fetch("/api/admin/email/shortlisted", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              batch: true,
              domain: targetDomain,
              subject: subject.trim() || undefined,
              customMessage: customMessage.trim() || undefined,
              interviewDate,
              interviewTime,
              meetingLink,
              venue,
              batchOffset: currentOffset,
              batchLimit: batchSize,
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to send batch shortlist emails");

          totalDispatched += data.sentCount || 0;
          currentOffset = data.nextOffset;
          hasMore = autoSendAllBatches && data.hasMore && (data.sentCount || 0) > 0;
          batchIndex++;

          if (hasMore) {
            setProgressStatus(
              `Sent ${totalDispatched} emails so far. Pausing briefly before next batch...`
            );
            await new Promise((resolve) => setTimeout(resolve, 400));
          }
        }

        onSuccess?.(
          `Batch shortlist emails dispatched successfully to ${totalDispatched} candidate(s)!`
        );
        onClose();
      } else if (currentMode === "TASKS_LIVE_BROADCAST") {
        if (!isExecutive && userRole) {
          throw new Error(
            "Forbidden: Tasks Live email broadcast can only be sent by the President or Vice President."
          );
        }

        let currentOffset = batchOffset;
        let hasMore = true;
        let totalDispatched = 0;
        let batchIndex = 1;

        while (hasMore) {
          setProgressStatus(
            `Dispatching Batch #${batchIndex} (Applicants #${currentOffset + 1} to #${
              currentOffset + batchSize
            })...`
          );

          const res = await fetch("/api/admin/email/tasks-live", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              domain: targetDomain,
              deadline,
              customMessage: customMessage.trim() || undefined,
              batchOffset: currentOffset,
              batchLimit: batchSize,
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to broadcast tasks live email");

          totalDispatched += data.sentCount || 0;
          currentOffset = data.nextOffset;
          hasMore = autoSendAllBatches && data.hasMore && (data.sentCount || 0) > 0;
          batchIndex++;

          if (hasMore) {
            setProgressStatus(
              `Progress: ${totalDispatched} emails sent so far. Continuing next batch...`
            );
            await new Promise((resolve) => setTimeout(resolve, 400));
          }
        }

        onSuccess?.(
          `Tasks Live announcement successfully broadcasted to ${totalDispatched} applicant(s)!`
        );
        onClose();
      } else if (currentMode === "SELECTION_OFFER") {
        if (candidate?.id) {
          if (candidate.status !== "Accepted") {
            throw new Error(
              `Candidate status is "${candidate.status}". Selection offer can only be sent to candidates with status "Accepted".`
            );
          }

          const res = await fetch("/api/admin/email/custom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              templateType: "SELECTION",
              applicationId: candidate.id,
              domain: candidate.primaryDomain,
              message: customMessage.trim() || undefined,
              onboardingLink,
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to send selection offer email");

          onSuccess?.(`Official Acceptance Offer email sent to ${candidate.fullName}!`);
          onClose();
        } else {
          // Batch selection offer for all Accepted candidates
          let currentOffset = batchOffset;
          let hasMore = true;
          let totalDispatched = 0;
          let batchIndex = 1;

          while (hasMore) {
            setProgressStatus(
              `Dispatching Batch #${batchIndex} (Offset: ${currentOffset}, Limit: ${batchSize})...`
            );

            const res = await fetch("/api/admin/email/custom", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                templateType: "SELECTION",
                batch: true,
                domain: targetDomain,
                message: customMessage.trim() || undefined,
                onboardingLink,
                batchOffset: currentOffset,
                batchLimit: batchSize,
              }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Failed to send batch selection offers");

            totalDispatched += data.sentCount || 0;
            currentOffset = data.nextOffset;
            hasMore = autoSendAllBatches && data.hasMore && (data.sentCount || 0) > 0;
            batchIndex++;

            if (hasMore) {
              setProgressStatus(
                `Progress: ${totalDispatched} offers sent so far. Continuing next batch...`
              );
              await new Promise((resolve) => setTimeout(resolve, 400));
            }
          }

          onSuccess?.(
            `Official Acceptance Offer emails sent to ${totalDispatched} accepted candidate(s)!`
          );
          onClose();
        }
      } else {
        // Custom update
        const res = await fetch("/api/admin/email/custom", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            templateType: "CUSTOM",
            applicationId: candidate?.id,
            candidateEmail: candidate?.email,
            candidateName: candidate?.fullName,
            domain: targetDomain,
            subject: subject.trim() || undefined,
            message: customMessage.trim() || undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send email");

        onSuccess?.(`Custom announcement sent successfully!`);
        onClose();
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred");
    } finally {
      setSending(false);
      setProgressStatus(null);
    }
  };


  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="bg-[#FFFDF5] border-3 border-[#0D0D0D] rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-[12px_12px_0_#0D0D0D] overflow-hidden relative"
      >
        {/* Modal Header Bar */}
        <div className="bg-[#0D0D0D] text-[#FFEFB4] px-6 py-4 border-b-3 border-[#F2A516] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#F2A516] text-[#0D0D0D] rounded-xl border border-[#FFEFB4]">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-black text-base sm:text-lg uppercase text-white tracking-wide">
                  {mode === "SHORTLIST_INDIVIDUAL"
                    ? "Send Shortlist & Interview Invite"
                    : mode === "SHORTLIST_BATCH"
                    ? "Broadcast Shortlist & Interview Email"
                    : mode === "TASKS_LIVE_BROADCAST"
                    ? "Broadcast: Domain Tasks Are Live"
                    : mode === "SELECTION_OFFER"
                    ? "Send Membership Offer Email"
                    : "Send Custom Email Announcement"}
                </h3>
                <span className="bg-[#F2A516] text-[#0D0D0D] text-[10px] font-black uppercase px-2 py-0.5 rounded">
                  Resend
                </span>
              </div>
              <p className="text-xs text-[#FFEFB4]/80 font-medium">
                Sender: <strong className="text-white">support@codekraftersrmp.in</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-[#1A1A1A] text-[#FFEFB4] hover:text-[#F2A516] hover:bg-[#2A2A2A] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Sub-Header: Recipient Info & Tabs */}
        <div className="bg-[#FFF2C6] px-6 py-3 border-b-2 border-[#0D0D0D] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-black uppercase text-[#0D0D0D]">To:</span>
            <span className="font-extrabold text-xs sm:text-sm text-[#0D0D0D]">
              {recipientSummary.title}
            </span>
            <span className="text-xs text-gray-700 font-semibold hidden sm:inline">
              ({recipientSummary.sub})
            </span>
            <span className="px-2 py-0.5 bg-[#0D0D0D] text-[#FFEFB4] rounded-full text-[10px] font-black uppercase shadow-[1px_1px_0_#F2A516]">
              {recipientSummary.badge}
            </span>
          </div>

          {/* Compose vs Preview Tabs */}
          <div className="flex items-center gap-1 bg-[#0D0D0D]/10 p-1 rounded-xl border border-[#0D0D0D]">
            <button
              type="button"
              onClick={() => setActiveTab("COMPOSE")}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "COMPOSE"
                  ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[1px_1px_0_#F2A516]"
                  : "text-[#0D0D0D] hover:bg-black/5"
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" /> Compose
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("PREVIEW")}
              className={`px-3 py-1 rounded-lg text-xs font-extrabold flex items-center gap-1.5 transition-all cursor-pointer ${
                activeTab === "PREVIEW"
                  ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[1px_1px_0_#F2A516]"
                  : "text-[#0D0D0D] hover:bg-black/5"
              }`}
            >
              <Eye className="w-3.5 h-3.5 text-[#F2A516]" /> Live Email Preview
            </button>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-5">
          {error && (
            <div className="bg-rose-100 border-2 border-rose-600 rounded-xl p-3 text-rose-900 text-xs font-bold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {activeTab === "COMPOSE" ? (
            <div className="space-y-4">
              {/* Template Selector */}
              <div>
                <label className="block text-[11px] font-black uppercase text-[#0D0D0D] mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#F2A516]" /> Choose Email Template:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => setCurrentMode(candidate ? "SHORTLIST_INDIVIDUAL" : "SHORTLIST_BATCH")}
                    className={`p-2.5 rounded-xl border-2 border-[#0D0D0D] text-left text-xs font-black uppercase transition-all cursor-pointer ${
                      currentMode === "SHORTLIST_INDIVIDUAL" || currentMode === "SHORTLIST_BATCH"
                        ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[2px_2px_0_#F2A516]"
                        : "bg-white text-[#0D0D0D] hover:bg-[#FFF2C6]"
                    }`}
                  >
                    🎉 Shortlist & Interview
                  </button>

                  {isExecutive || !userRole ? (
                    <button
                      type="button"
                      onClick={() => setCurrentMode("TASKS_LIVE_BROADCAST")}
                      className={`p-2.5 rounded-xl border-2 border-[#0D0D0D] text-left text-xs font-black uppercase transition-all cursor-pointer ${
                        currentMode === "TASKS_LIVE_BROADCAST"
                          ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[2px_2px_0_#F2A516]"
                          : "bg-white text-[#0D0D0D] hover:bg-[#FFF2C6]"
                      }`}
                    >
                      🚀 Tasks Are Live
                    </button>
                  ) : (
                    <div
                      title="Tasks Live email broadcast is restricted to President and Vice President"
                      className="p-2.5 rounded-xl border-2 border-[#0D0D0D]/30 bg-gray-100 text-gray-400 text-left text-xs font-black uppercase cursor-not-allowed flex flex-col justify-between"
                    >
                      <span>🚀 Tasks Are Live</span>
                      <span className="text-[9px] text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded mt-1 inline-block w-fit font-bold border border-amber-300">
                        🔒 President/VP Only
                      </span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => setCurrentMode("SELECTION_OFFER")}
                    className={`p-2.5 rounded-xl border-2 border-[#0D0D0D] text-left text-xs font-black uppercase transition-all cursor-pointer ${
                      currentMode === "SELECTION_OFFER"
                        ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[2px_2px_0_#F2A516]"
                        : "bg-white text-[#0D0D0D] hover:bg-[#FFF2C6]"
                    }`}
                  >
                    🎊 Member Offer
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentMode("CUSTOM_UPDATE")}
                    className={`p-2.5 rounded-xl border-2 border-[#0D0D0D] text-left text-xs font-black uppercase transition-all cursor-pointer ${
                      currentMode === "CUSTOM_UPDATE"
                        ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[2px_2px_0_#F2A516]"
                        : "bg-white text-[#0D0D0D] hover:bg-[#FFF2C6]"
                    }`}
                  >
                    📢 Custom Notice
                  </button>
                </div>
              </div>

              {/* Batch Delivery & Range Controls (Only for batch broadcast modes) */}
              {isBatchMode && (
                <div className="p-4 bg-[#FFEFB4]/70 border-2 border-[#0D0D0D] rounded-2xl shadow-[3px_3px_0_#0D0D0D] space-y-3">
                  <div className="flex items-center justify-between border-b border-[#0D0D0D]/15 pb-2">
                    <span className="text-[11px] font-black uppercase text-[#0D0D0D] flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-[#F2A516]" /> Batch Delivery & Offset Range
                    </span>
                    <span className="text-[10px] font-extrabold bg-[#0D0D0D] text-[#FFEFB4] px-2 py-0.5 rounded">
                      High-Speed Resend Batching
                    </span>
                  </div>

                  {/* Quick Preset Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-black uppercase text-gray-700">Quick Range:</span>
                    <button
                      type="button"
                      onClick={() => setBatchOffset(0)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border border-[#0D0D0D] transition-all cursor-pointer ${
                        batchOffset === 0
                          ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[1px_1px_0_#F2A516]"
                          : "bg-white text-[#0D0D0D] hover:bg-[#FFF2C6]"
                      }`}
                    >
                      🚀 Send All (Start from #1)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBatchOffset(45)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase border border-[#0D0D0D] transition-all cursor-pointer flex items-center gap-1 ${
                        batchOffset === 45
                          ? "bg-[#F2A516] text-[#0D0D0D] shadow-[1px_1px_0_#0D0D0D]"
                          : "bg-white text-[#0D0D0D] hover:bg-[#FFF2C6]"
                      }`}
                    >
                      <SkipForward className="w-3 h-3" /> Skip First 45 (Send to #46 - #{batchCount || 456})
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#0D0D0D] mb-1">
                        Start From Candidate Offset:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          min="0"
                          max={batchCount || 1000}
                          value={batchOffset}
                          onChange={(e) => setBatchOffset(Math.max(0, parseInt(e.target.value) || 0))}
                          className="w-full bg-white text-[#0D0D0D] font-black text-xs border-2 border-[#0D0D0D] rounded-xl px-3 py-2 shadow-[2px_2px_0_#0D0D0D]"
                        />
                        <span className="text-[10px] font-bold text-gray-600 shrink-0">
                          (Index {batchOffset})
                        </span>
                      </div>
                      <p className="text-[9px] text-gray-600 mt-1">
                        Set to <strong>45</strong> if the first 45 candidates already received this email.
                      </p>
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#0D0D0D] mb-1">
                        Batch Request Chunk Size:
                      </label>
                      <select
                        value={batchSize}
                        onChange={(e) => setBatchSize(parseInt(e.target.value))}
                        className="w-full bg-white text-[#0D0D0D] font-black text-xs border-2 border-[#0D0D0D] rounded-xl px-3 py-2 shadow-[2px_2px_0_#0D0D0D]"
                      >
                        <option value={100}>100 recipients / API call (Fastest)</option>
                        <option value={50}>50 recipients / API call (Standard)</option>
                        <option value={25}>25 recipients / API call (Conservative)</option>
                      </select>
                      <div className="flex items-center gap-1.5 mt-2">
                        <input
                          type="checkbox"
                          id="autoSendCheck"
                          checked={autoSendAllBatches}
                          onChange={(e) => setAutoSendAllBatches(e.target.checked)}
                          className="rounded border-[#0D0D0D] text-[#0D0D0D] accent-[#0D0D0D] cursor-pointer"
                        />
                        <label htmlFor="autoSendCheck" className="text-[10px] font-black text-[#0D0D0D] cursor-pointer">
                          Auto-dispatch all remaining batches in sequence
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Subject Line */}
              <div>
                <label className="block text-xs font-black uppercase text-[#0D0D0D] mb-1">
                  Email Subject Line
                </label>
                <input
                  type="text"
                  placeholder={previewData.subject}
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full bg-[#FFEFB4] text-[#0D0D0D] font-bold text-xs sm:text-sm border-2 border-[#0D0D0D] rounded-xl px-4 py-2.5 shadow-[2px_2px_0_#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#F2A516]"
                />
              </div>


              {/* Shortlist Specific Scheduling Fields */}
              {(currentMode === "SHORTLIST_INDIVIDUAL" || currentMode === "SHORTLIST_BATCH") && (
                <div className="p-4 bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-2xl shadow-[3px_3px_0_#0D0D0D] space-y-3">
                  <span className="text-[11px] font-black uppercase text-[#0D0D0D] flex items-center gap-1.5 border-b border-[#0D0D0D]/10 pb-2">
                    <Sparkles className="w-4 h-4 text-[#F2A516]" /> Interview Schedule Details
                  </span>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#0D0D0D] mb-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#F2A516]" /> Interview Date
                      </label>
                      <input
                        type="text"
                        value={interviewDate}
                        onChange={(e) => setInterviewDate(e.target.value)}
                        placeholder="e.g. Saturday, 26 September 2026"
                        className="w-full bg-white text-[#0D0D0D] font-bold text-xs border-2 border-[#0D0D0D] rounded-xl px-3 py-2 shadow-[2px_2px_0_#0D0D0D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#0D0D0D] mb-1 flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#F2A516]" /> Interview Time Slot
                      </label>
                      <input
                        type="text"
                        value={interviewTime}
                        onChange={(e) => setInterviewTime(e.target.value)}
                        placeholder="e.g. 10:00 AM - 10:30 AM"
                        className="w-full bg-white text-[#0D0D0D] font-bold text-xs border-2 border-[#0D0D0D] rounded-xl px-3 py-2 shadow-[2px_2px_0_#0D0D0D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#0D0D0D] mb-1 flex items-center gap-1">
                        <Video className="w-3 h-3 text-[#F2A516]" /> Google Meet / Call Link
                      </label>
                      <input
                        type="text"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        placeholder="https://meet.google.com/..."
                        className="w-full bg-white text-[#0D0D0D] font-bold text-xs border-2 border-[#0D0D0D] rounded-xl px-3 py-2 shadow-[2px_2px_0_#0D0D0D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-black uppercase text-[#0D0D0D] mb-1 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-[#F2A516]" /> Venue / Mode
                      </label>
                      <input
                        type="text"
                        value={venue}
                        onChange={(e) => setVenue(e.target.value)}
                        placeholder="e.g. Google Meet (Online) or Lab 304"
                        className="w-full bg-white text-[#0D0D0D] font-bold text-xs border-2 border-[#0D0D0D] rounded-xl px-3 py-2 shadow-[2px_2px_0_#0D0D0D]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Tasks Live Specific Fields */}
              {currentMode === "TASKS_LIVE_BROADCAST" && (
                <div>
                  <label className="block text-xs font-black uppercase text-[#0D0D0D] mb-1">
                    Task Submission Deadline
                  </label>
                  <input
                    type="text"
                    value={deadline}
                    onChange={(e) => setDeadline(e.target.value)}
                    placeholder="24 September (11:59 PM)"
                    className="w-full bg-[#FFEFB4] text-[#0D0D0D] font-bold text-xs sm:text-sm border-2 border-[#0D0D0D] rounded-xl px-4 py-2.5 shadow-[2px_2px_0_#0D0D0D]"
                  />
                </div>
              )}

              {/* Selection Offer Specific Fields */}
              {mode === "SELECTION_OFFER" && (
                <div>
                  <label className="block text-xs font-black uppercase text-[#0D0D0D] mb-1">
                    Onboarding Portal Link / Action URL
                  </label>
                  <input
                    type="text"
                    value={onboardingLink}
                    onChange={(e) => setOnboardingLink(e.target.value)}
                    placeholder="https://codekraftersrmp.in/profile"
                    className="w-full bg-[#FFEFB4] text-[#0D0D0D] font-bold text-xs sm:text-sm border-2 border-[#0D0D0D] rounded-xl px-4 py-2.5 shadow-[2px_2px_0_#0D0D0D]"
                  />
                </div>
              )}

              {/* Custom Message Body */}
              <div>
                <label className="block text-xs font-black uppercase text-[#0D0D0D] mb-1">
                  Custom Notes / Message Body (Optional)
                </label>
                <textarea
                  rows={4}
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  placeholder={
                    mode === "TASKS_LIVE_BROADCAST"
                      ? "Add any special announcements, domain Discord/WhatsApp links, or guidelines..."
                      : "Add any special instructions or words of encouragement from domain leads..."
                  }
                  className="w-full bg-[#FFEFB4] text-[#0D0D0D] font-medium text-xs sm:text-sm border-2 border-[#0D0D0D] rounded-xl p-3.5 shadow-[2px_2px_0_#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#F2A516]"
                />
              </div>

              <div className="bg-[#FFF2C6] p-3 rounded-xl border border-[#0D0D0D]/20 text-[11px] font-bold text-[#555555]">
                💡 Tip: Click the <strong>&quot;Live Email Preview&quot;</strong> tab in the top right to see how this email looks in candidate inboxes before sending.
              </div>
            </div>
          ) : (
            /* Live HTML Preview Tab */
            <div className="space-y-3">
              <div className="p-3 bg-[#0D0D0D] text-[#FFEFB4] rounded-xl text-xs font-bold flex items-center justify-between">
                <span>
                  <strong>Subject:</strong> {previewData.subject}
                </span>
                <span className="text-[10px] bg-[#F2A516] text-[#0D0D0D] px-2 py-0.5 rounded font-black">
                  Live Render
                </span>
              </div>
              <div className="border-3 border-[#0D0D0D] rounded-2xl overflow-hidden bg-white shadow-[4px_4px_0_#0D0D0D]">
                <iframe
                  srcDoc={previewData.html}
                  title="Live Email Preview"
                  className="w-full h-[380px] border-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-[#f9f7e5] px-6 py-4 border-t-2 border-[#0D0D0D] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              disabled={sending}
              className="px-5 py-2.5 rounded-xl border-2 border-[#0D0D0D] font-black text-xs uppercase bg-white text-[#0D0D0D] hover:bg-gray-100 shadow-[2px_2px_0_#0D0D0D] cursor-pointer disabled:opacity-50"
            >
              Cancel
            </button>
            {sending && progressStatus && (
              <div className="flex items-center gap-2 bg-[#FFEFB4] border border-[#0D0D0D] px-3 py-1.5 rounded-xl text-[11px] font-bold text-[#0D0D0D] animate-pulse">
                <div className="w-3 h-3 border-2 border-[#0D0D0D] border-t-transparent rounded-full animate-spin shrink-0"></div>
                <span>{progressStatus}</span>
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={sending || (currentMode === "TASKS_LIVE_BROADCAST" && !isExecutive && !!userRole)}
            className="px-6 py-2.5 rounded-xl border-2 border-[#0D0D0D] font-black text-xs uppercase tracking-wider bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] shadow-[3px_3px_0_#F2A516] flex items-center gap-2 hover:translate-y-[-1px] transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#FFEFB4] border-t-transparent rounded-full animate-spin"></div>
                Dispatching Batches...
              </>
            ) : currentMode === "TASKS_LIVE_BROADCAST" && !isExecutive && !!userRole ? (
              <>
                🔒 Restricted to President & VP
              </>
            ) : (
              <>
                <Send className="w-4 h-4 text-[#F2A516]" /> Dispatch Email Now ➔
              </>
            )}
          </button>
        </div>

      </motion.div>
    </div>
  );
}
