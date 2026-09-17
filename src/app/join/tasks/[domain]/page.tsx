"use client";

import React, { use, useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/navbar";
import { DOMAIN_TASKS_DATA, normalizeDomainKey } from "@/data/recruitmentTasks";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ExternalLink,
  CheckCircle2,
  HelpCircle,
  Award,
  Sparkles,
  MessageCircle,
  FileCode,
  Send,
  AlertTriangle,
  Lock,
} from "lucide-react";

interface TaskPageProps {
  params: Promise<{ domain: string }>;
}

export default function DomainTaskPage({ params }: TaskPageProps) {
  const { domain } = use(params);
  const normalizedKey = normalizeDomainKey(domain);
  const task = DOMAIN_TASKS_DATA[normalizedKey] || DOMAIN_TASKS_DATA["webdevelopment"];

  const [loading, setLoading] = useState(true);
  const [tasksVisible, setTasksVisible] = useState(false);
  const [currentPhase, setCurrentPhase] = useState(1);

  useEffect(() => {
    let isMounted = true;
    async function checkSettings() {
      try {
        const res = await fetch("/api/admin/recruitment-settings");
        const data = await res.json();
        if (isMounted && data?.settings) {
          setTasksVisible(Boolean(data.settings.tasks_visible));
          setCurrentPhase(Number(data.settings.current_phase) || 1);
        }
      } catch (e) {
        console.warn("Could not check settings:", e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    checkSettings();
    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#FFEFB4] text-[#0D0D0D] font-sans relative overflow-x-hidden flex flex-col pt-24">
      {/* Paper Fiber Texture Overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-15 -z-10"
        style={{
          backgroundImage: `url("https://www.transparenttextures.com/patterns/paper-fibers.png")`,
        }}
      />

      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(13, 13, 13, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(13, 13, 13, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: "28px 28px",
        }}
      />

      <Navbar />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 w-full flex-grow py-8 pb-24">
        {/* Navigation Breadcrumb / Back Link */}
        <div className="mb-6">
          <Link
            href="/join"
            className="inline-flex items-center gap-2 px-4 py-2 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] rounded-full text-xs font-black uppercase tracking-wider border-2 border-[#0D0D0D] shadow-[3px_3px_0_#F2A516] hover:translate-y-[-1px] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-b-3 border-[#0D0D0D]"></div>
          </div>
        ) : !tasksVisible ? (
          /* ============================================================ */
          /* LOCKED STATE WHEN TASKS ARE HIDDEN OR IN PHASE 1            */
          /* ============================================================ */
          <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-8 sm:p-12 shadow-[8px_8px_0_#0D0D0D] text-center max-w-xl mx-auto my-8">
            <div className="w-16 h-16 bg-[#FFF2C6] rounded-full border-3 border-[#0D0D0D] flex items-center justify-center mx-auto mb-6 shadow-[3px_3px_0_#F2A516]">
              <Lock className="w-8 h-8 text-[#0D0D0D]" />
            </div>

            <div className="inline-flex items-center gap-1.5 px-3.5 py-1 bg-amber-100 text-amber-900 border border-amber-800/40 rounded-full text-xs font-extrabold mb-3">
              <Clock className="w-3.5 h-3.5" />
              {currentPhase < 2 ? "Unlocks 17 September (Phase 2)" : "Task Window Closed"}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#0D0D0D] tracking-tight mb-3">
              {task.domainName} Task Locked
            </h1>

            <p className="text-sm font-semibold text-[#444444] mb-8 leading-relaxed">
              {currentPhase < 2 ? (
                <>
                  Round 1 recruitment challenges are currently under preparation by our domain leads.
                  The full task briefing and submission form will unlock automatically on{" "}
                  <strong>Thursday, 17 September 2026</strong>.
                </>
              ) : (
                <>
                  The Round 1 task submission deadline of{" "}
                  <strong>24 September (11:59 PM IST)</strong> has concluded. Domain leads are currently evaluating submitted projects.
                </>
              )}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link
                href="/join"
                className="w-full sm:w-auto px-6 py-3 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#0D0D0D] shadow-[3px_3px_0_#F2A516] hover:translate-y-[-1px] transition-all cursor-pointer"
              >
                Return to Dashboard
              </Link>

              <a
                href={task.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366] text-[#0D0D0D] font-black text-xs uppercase tracking-wider rounded-xl border-2 border-[#0D0D0D] shadow-[3px_3px_0_#0D0D0D] hover:translate-y-[-1px] transition-all cursor-pointer hover:bg-[#20bd5a]"
              >
                <MessageCircle className="w-4 h-4 text-[#0D0D0D]" /> Join Domain WhatsApp Group
              </a>
            </div>
          </div>
        ) : (
          /* ============================================================ */
          /* UNLOCKED STATE: FULL EDITORIAL BRIEFING                      */
          /* ============================================================ */
          <>
            {/* Hero Article Header */}
            <header className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-10 shadow-[8px_8px_0_#0D0D0D] mb-8 relative overflow-hidden">
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="px-3.5 py-1 bg-[#F2A516] text-[#0D0D0D] text-xs font-black uppercase rounded-full border-2 border-[#0D0D0D] shadow-[2px_2px_0_#0D0D0D]">
                  {task.category} Domain
                </span>
                <span className="px-3.5 py-1 bg-[#0D0D0D] text-[#FFEFB4] text-xs font-black uppercase rounded-full border-2 border-[#0D0D0D]">
                  Round 1 Challenge
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-800 rounded-full text-xs font-extrabold">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-700" /> Active Task
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl font-extrabold uppercase tracking-tight text-[#0D0D0D] leading-tight mb-3">
                {task.domainName} Task Briefing
              </h1>

              <p className="text-base sm:text-lg font-bold text-[#333333] mb-6 max-w-2xl">
                {task.tagline}
              </p>

              {/* Timeline & Deadlines Bar */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-4 bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-2xl shadow-[3px_3px_0_#0D0D0D] mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#0D0D0D] text-[#F2A516] flex items-center justify-center border border-[#0D0D0D] shrink-0">
                    <Calendar className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-700 block">
                      Launch Date
                    </span>
                    <span className="text-xs font-extrabold text-[#0D0D0D]">
                      Thursday, 17 September 2026
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#F2A516] text-[#0D0D0D] flex items-center justify-center border border-[#0D0D0D] shrink-0">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-700 block">
                      Submission Deadline
                    </span>
                    <span className="text-xs font-extrabold text-[#0D0D0D]">
                      24 September (11:59 PM IST)
                    </span>
                  </div>
                </div>
              </div>

              {/* Direct CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={task.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#25D366] text-[#0D0D0D] font-black text-sm uppercase tracking-wider rounded-xl border-2 border-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#0D0D0D] transition-all cursor-pointer hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="w-5 h-5 text-[#0D0D0D]" /> Join Official {task.domainName} WhatsApp Group
                  <ExternalLink className="w-4 h-4 opacity-70" />
                </a>

                <span className="text-xs font-extrabold uppercase text-[#0D0D0D]/70 bg-[#FFF2C6] border-2 border-[#0D0D0D] px-4 py-2.5 rounded-xl">
                  Task briefing & submission updates will be announced in WhatsApp
                </span>
              </div>
            </header>

            {/* Section 1: Overview */}
            <section className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0_#0D0D0D] mb-8">
              <h2 className="text-xl sm:text-2xl font-black uppercase text-[#0D0D0D] flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#0D0D0D]/10">
                <FileCode className="w-6 h-6 text-[#F2A516]" /> 1. Challenge Overview
              </h2>
              <p className="text-sm sm:text-base font-semibold text-[#333333] leading-relaxed">
                {task.overview}
              </p>

              <div className="mt-4 p-4 bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-2xl flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-[#F2A516] shrink-0 mt-0.5" />
                <p className="text-xs font-bold text-[#0D0D0D]">
                  <strong>Tip:</strong> We value originality, architecture, and attention to detail.
                  Avoid generic templates. If you get stuck or have questions regarding instructions, ask in
                  the official domain WhatsApp group!
                </p>
              </div>
            </section>

            {/* Section 2: Tracks & Requirements */}
            {task.tracks && task.tracks.length > 0 && (
              <section className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0_#0D0D0D] mb-8">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-[#0D0D0D] flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#0D0D0D]/10">
                  <Sparkles className="w-6 h-6 text-[#F2A516]" />{" "}
                  {task.tracks.length === 1 ? "2. Task Challenge & Specifications" : "2. Available Tracks & Specifications"}
                </h2>
                <div className="space-y-6">
                  {task.tracks.map((track, i) => (
                    <div
                      key={i}
                      className="bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-2xl p-5 shadow-[3px_3px_0_#0D0D0D]"
                    >
                      <h3 className="text-base font-black uppercase text-[#0D0D0D] mb-1">
                        {track.title}
                      </h3>
                      <p className="text-xs font-bold text-[#444444] mb-3">{track.desc}</p>
                      
                      {track.requirements && track.requirements.length > 0 && (
                        <div className="space-y-1.5 mb-3">
                          {track.requirements.map((req, rIdx) => (
                            <div key={rIdx} className="flex items-start gap-2 text-xs font-semibold text-[#0D0D0D]">
                              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                              <span>{req}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {track.tasks && track.tasks.length > 0 && (
                        <div className="space-y-4 mt-3">
                          {track.tasks.map((t, tIdx) => (
                            <div key={tIdx} className="p-4 bg-[#FFEFB4] border border-[#0D0D0D] rounded-xl">
                              <h4 className="text-sm font-black uppercase text-[#0D0D0D] mb-1">{t.title}</h4>
                              <p className="text-xs font-medium text-[#444444] mb-2">{t.desc}</p>
                              {t.requirements && t.requirements.length > 0 && (
                                <div className="space-y-1">
                                  {t.requirements.map((req, reqIdx) => (
                                    <div key={reqIdx} className="flex items-start gap-2 text-xs font-semibold text-[#0D0D0D]">
                                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                                      <span>{req}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {track.submissionStructure && (
                        <div className="mt-3 p-3 bg-amber-100 border border-amber-800/40 rounded-xl text-xs font-semibold text-amber-950">
                          <strong>Submission Structure:</strong> {track.submissionStructure}
                        </div>
                      )}

                      {track.candidateProfiles && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-800/40 rounded-xl text-xs font-semibold text-blue-950">
                          <p className="mb-1 font-bold">{track.candidateProfiles.desc}</p>
                          <ul className="list-disc list-inside ml-2 space-y-0.5">
                            {track.candidateProfiles.required.map((p, pIdx) => (
                              <li key={pIdx}>{p}</li>
                            ))}
                          </ul>
                          {track.candidateProfiles.note && (
                            <p className="mt-1 text-[11px] text-blue-800 italic">{track.candidateProfiles.note}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 3: Deliverables & Submission */}
            {task.deliverables && task.deliverables.length > 0 && (
              <section className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0_#0D0D0D] mb-8">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-[#0D0D0D] flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#0D0D0D]/10">
                  <CheckCircle2 className="w-6 h-6 text-[#F2A516]" /> 3. Required Deliverables
                </h2>
                <div className="space-y-2">
                  {task.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3 bg-[#FFEFB4] border border-[#0D0D0D] rounded-xl text-xs font-bold text-[#0D0D0D]"
                    >
                      <div className="w-6 h-6 rounded-full bg-[#0D0D0D] text-[#FFEFB4] font-black flex items-center justify-center shrink-0 text-[10px]">
                        {idx + 1}
                      </div>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 4: Evaluation Criteria */}
            {task.evaluationCriteria && task.evaluationCriteria.length > 0 && (
              <section className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0_#0D0D0D] mb-8">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-[#0D0D0D] flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#0D0D0D]/10">
                  <Award className="w-6 h-6 text-[#F2A516]" /> 4. Evaluation Rubric
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {task.evaluationCriteria.map((c, i) => (
                    <div
                      key={i}
                      className="p-4 bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-2xl shadow-[2px_2px_0_#0D0D0D]"
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-extrabold text-xs uppercase text-[#0D0D0D]">{c.title}</span>
                        {c.weight && (
                          <span className="px-2 py-0.5 bg-[#0D0D0D] text-[#F2A516] font-black text-[10px] rounded-md">
                            {c.weight}
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-medium text-[#444444]">{c.desc}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Section 5: FAQs */}
            {task.faq && task.faq.length > 0 && (
              <section className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0_#0D0D0D] mb-8">
                <h2 className="text-xl sm:text-2xl font-black uppercase text-[#0D0D0D] flex items-center gap-2 mb-4 pb-3 border-b-2 border-[#0D0D0D]/10">
                  <HelpCircle className="w-6 h-6 text-[#F2A516]" /> 5. Frequently Asked Questions
                </h2>
                <div className="space-y-3">
                  {task.faq.map((item, i) => (
                    <div key={i} className="p-4 bg-[#FFEFB4] border border-[#0D0D0D] rounded-2xl">
                      <h3 className="font-extrabold text-xs text-[#0D0D0D] mb-1">Q: {item.q}</h3>
                      <p className="text-xs font-semibold text-[#444444]">A: {item.a}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Bottom Callout Banner */}
            <div className="bg-[#0D0D0D] text-[#FFEFB4] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0_#F2A516] text-center">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[#FFEFB4] mb-2">
                Ready to Submit Your Work?
              </h2>
              <p className="text-xs sm:text-sm font-bold text-gray-300 max-w-lg mx-auto mb-6">
                Ensure your repositories or drive folders have public permissions before submitting.
                The portal closes strictly on <strong>Thursday, 24th September at 11:59 PM IST</strong>.
              </p>

              <div className="flex flex-wrap justify-center gap-3">
                <a
                  href={task.submissionLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#F2A516] text-[#0D0D0D] font-black text-xs uppercase tracking-wider rounded-full border-2 border-[#0D0D0D] shadow-[3px_3px_0_#FFFFFF] hover:translate-y-[-2px] transition-all cursor-pointer"
                >
                  <Send className="w-4 h-4" /> Open Submission Form
                </a>

                <a
                  href={task.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-[#25D366] text-[#0D0D0D] font-black text-xs uppercase tracking-wider rounded-full border-2 border-[#0D0D0D] shadow-[3px_3px_0_#FFFFFF] hover:translate-y-[-2px] transition-all cursor-pointer hover:bg-[#20bd5a]"
                >
                  <MessageCircle className="w-4 h-4" /> Join WhatsApp Group
                </a>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
