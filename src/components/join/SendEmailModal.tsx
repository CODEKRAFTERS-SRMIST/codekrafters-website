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
} from "lucide-react";
import { Application } from "@/types/join";
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
}

export function SendEmailModal({
  isOpen,
  onClose,
  mode,
  candidate,
  targetDomain = "ALL",
  batchCount = 0,
  onSuccess,
}: SendEmailModalProps) {
  const [currentMode, setCurrentMode] = useState<EmailModalMode>(mode);
  const [activeTab, setActiveTab] = useState<"COMPOSE" | "PREVIEW">("COMPOSE");

  React.useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  // Form states
  const [subject, setSubject] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [interviewDate, setInterviewDate] = useState("Saturday, 26 September 2026");
  const [interviewTime, setInterviewTime] = useState("10:00 AM - 10:30 AM");
  const [meetingLink, setMeetingLink] = useState("https://meet.google.com/xyz-codekrafters");
  const [venue, setVenue] = useState("Google Meet (Online)");
  const [deadline, setDeadline] = useState("24 September (11:59 PM)");
  const [onboardingLink, setOnboardingLink] = useState("https://codekrafters.in/profile");

  const [sending, setSending] = useState(false);
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
      return {
        title: `All Accepted Members`,
        sub: `Target Domain: ${targetDomain === "ALL" ? "All Domains" : targetDomain}`,
        badge: `${batchCount} Accepted Candidates`,
      };
    }
    if (currentMode === "SHORTLIST_BATCH") {
      return {
        title: `All Shortlisted Applicants`,
        sub: `Target Domain: ${targetDomain === "ALL" ? "All Domains" : targetDomain}`,
        badge: `${batchCount} Shortlisted Candidates`,
      };
    }
    if (currentMode === "TASKS_LIVE_BROADCAST") {
      return {
        title: `All Registered Applicants`,
        sub: `Broadcasting Task Launch Notice • Domain: ${targetDomain === "ALL" ? "All Domains" : targetDomain}`,
        badge: `${batchCount || "All"} Applicants`,
      };
    }
    return {
      title: "Recipients",
      sub: `Domain: ${targetDomain}`,
      badge: `${batchCount || 1} Recipients`,
    };
  }, [currentMode, candidate, targetDomain, batchCount]);

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
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to send batch shortlist emails");

        onSuccess?.(
          `Batch shortlist emails dispatched successfully to ${data.sentCount} candidate(s)!`
        );
        onClose();
      } else if (currentMode === "TASKS_LIVE_BROADCAST") {
        const res = await fetch("/api/admin/email/tasks-live", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            domain: targetDomain,
            deadline,
            customMessage: customMessage.trim() || undefined,
          }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to broadcast tasks live email");

        onSuccess?.(
          `Tasks Live announcement successfully broadcasted to ${data.sentCount} applicant(s)!`
        );
        onClose();
      } else if (currentMode === "SELECTION_OFFER") {
        if (candidate?.id) {
          if (candidate.status !== "Accepted") {
            throw new Error(`Candidate status is "${candidate.status}". Selection offer can only be sent to candidates with status "Accepted".`);
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
          const res = await fetch("/api/admin/email/custom", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              templateType: "SELECTION",
              batch: true,
              domain: targetDomain,
              message: customMessage.trim() || undefined,
              onboardingLink,
            }),
          });

          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Failed to send batch selection offers");

          onSuccess?.(`Official Acceptance Offer emails sent to ${data.sentCount} accepted candidate(s)!`);
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
                    placeholder="https://codekrafters.in/profile"
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
        <div className="bg-[#f9f7e5] px-6 py-4 border-t-2 border-[#0D0D0D] flex items-center justify-between">
          <button
            type="button"
            onClick={onClose}
            disabled={sending}
            className="px-5 py-2.5 rounded-xl border-2 border-[#0D0D0D] font-black text-xs uppercase bg-white text-[#0D0D0D] hover:bg-gray-100 shadow-[2px_2px_0_#0D0D0D] cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSend}
            disabled={sending}
            className="px-6 py-2.5 rounded-xl border-2 border-[#0D0D0D] font-black text-xs uppercase tracking-wider bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] shadow-[3px_3px_0_#F2A516] flex items-center gap-2 hover:translate-y-[-1px] transition-all cursor-pointer"
          >
            {sending ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-[#FFEFB4] border-t-transparent rounded-full animate-spin"></div>
                Dispatching Email...
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
