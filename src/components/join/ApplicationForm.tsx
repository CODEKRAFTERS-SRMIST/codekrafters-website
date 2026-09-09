"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Application, ApplicantFormData, UserSession, DOMAINS_LIST, DEPARTMENTS, YEARS } from "@/types/join";
import { submitApplication } from "@/lib/api";
import {
  User,
  BookOpen,
  Layers,
  Link as LinkIcon,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Code,
  Smartphone,
  Cpu,
  Shield,
  Palette,
  Megaphone,
  Calendar,
  Star,
  XCircle,
} from "lucide-react";

interface ApplicationFormProps {
  session: UserSession;
  existingApplication?: Application | null;
  onApplicationSubmitted: (app: Application) => void;
}

const DOMAIN_ICONS: Record<string, React.ElementType> = {
  Code,
  Smartphone,
  Cpu,
  Shield,
  Palette,
  Megaphone,
  Calendar,
};

export function ApplicationForm({
  session,
  existingApplication,
  onApplicationSubmitted,
}: ApplicationFormProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  React.useEffect(() => {
    if (formError) {
      const timer = setTimeout(() => setFormError(""), 4000);
      return () => clearTimeout(timer);
    }
  }, [formError]);

  const [formData, setFormData] = useState<ApplicantFormData>({
    fullName: existingApplication?.fullName || session.fullName || "",
    email: existingApplication?.email || session.email || "",
    phone: existingApplication?.phone || "",
    department: existingApplication?.department || DEPARTMENTS[0],
    year: existingApplication?.year || YEARS[0],
    domains: existingApplication?.domains || [],
    primaryDomain: existingApplication?.primaryDomain || "",
    githubUrl: existingApplication?.githubUrl || "",
    linkedinUrl: existingApplication?.linkedinUrl || "",
    portfolioUrl: existingApplication?.portfolioUrl || "",
    resumeUrl: existingApplication?.resumeUrl || "",
    whyJoin: existingApplication?.whyJoin || "",
    pastExperience: existingApplication?.pastExperience || "",
  });

  const toggleDomain = (domainName: string) => {
    let updatedDomains: string[];
    if (formData.domains.includes(domainName)) {
      updatedDomains = formData.domains.filter((d) => d !== domainName);
    } else {
      if (formData.domains.length >= 2) return; // Limit to maximum 2 domains
      updatedDomains = [...formData.domains, domainName];
    }

    const updatedPrimary = updatedDomains.includes(formData.primaryDomain)
      ? formData.primaryDomain
      : updatedDomains[0] || "";

    setFormData({ ...formData, domains: updatedDomains, primaryDomain: updatedPrimary });
  };

  const handleNextStep = () => {
    setFormError("");
    if (step === 1) {
      if (!formData.fullName.trim() || !formData.email.trim() || !formData.phone.trim()) {
        setFormError("Please fill out all personal and academic details.");
        return;
      }
      if (formData.phone.replace(/\D/g, '').length < 10) {
        setFormError("Please provide a valid phone number (at least 10 digits).");
        return;
      }
    } else if (step === 2) {
      if (formData.domains.length === 0) {
        setFormError("Please select at least one domain to apply for.");
        return;
      }

      // Simple client-side URL validation
      const isValidUrl = (url: string) => {
        if (!url.trim()) return true;
        try {
          const parsed = new URL(url);
          return parsed.protocol === "http:" || parsed.protocol === "https:";
        } catch {
          return false;
        }
      };

      if (
        !isValidUrl(formData.githubUrl) ||
        !isValidUrl(formData.linkedinUrl) ||
        !isValidUrl(formData.portfolioUrl) ||
        !isValidUrl(formData.resumeUrl)
      ) {
        setFormError("Please ensure all provided portfolio links are valid URLs (must include http:// or https://).");
        return;
      }
    }
    setStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step < 3) {
      handleNextStep();
      return;
    }

    setFormError("");

    if (!formData.whyJoin.trim() || formData.whyJoin.trim().length < 20) {
      setFormError("Please provide a meaningful answer for why you wish to join (at least 20 characters).");
      return;
    }

    setSubmitting(true);

    try {
      const savedApp = await submitApplication(session.id, formData);
      onApplicationSubmitted(savedApp);
    } catch (err: any) {
      setFormError(err.message || "Failed to submit application. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-4xl mx-auto relative"
    >
      <AnimatePresence>
        {formError && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-6 right-6 left-6 sm:left-auto z-[100] bg-rose-500 text-white px-6 py-3.5 rounded-xl shadow-[4px_4px_0_#0D0D0D] border-2 border-[#0D0D0D] font-extrabold flex items-center gap-3"
          >
            <XCircle className="w-5 h-5 shrink-0" />
            <span className="text-xs sm:text-sm">{formError}</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-10 shadow-[10px_10px_0_#0D0D0D] relative overflow-hidden">
        {/* Step Progress Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#0D0D0D] flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#F2A516]" /> Step {step} of 3
            </span>
            <span className="text-xs sm:text-sm font-extrabold text-[#F2A516] uppercase bg-[#0D0D0D] px-3 py-1 rounded-full shadow-[2px_2px_0_#FFEFB4]">
              {step === 1 && "Personal & Academic Info"}
              {step === 2 && "Domain Selection & Links"}
              {step === 3 && "Essays & Review"}
            </span>
          </div>

          {/* Progress Bar Track */}
          <div className="w-full bg-[#0D0D0D]/10 rounded-full h-3 p-0.5 border border-[#0D0D0D]">
            <div
              className="bg-[#F2A516] h-full rounded-full transition-all duration-300 shadow-[1px_1px_0_#0D0D0D]"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
        </div>

        {formError && (
          <div className="mb-6 bg-red-100 border-2 border-red-500 text-red-900 text-xs sm:text-sm font-bold p-4 rounded-2xl shadow-[3px_3px_0_#0D0D0D]">
            {formError}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <AnimatePresence mode="wait">
            {/* STEP 1: Personal & Academic Details */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="border-b-2 border-[#0D0D0D]/10 pb-4 mb-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] uppercase tracking-tight flex items-center gap-2">
                    <User className="w-6 h-6 text-[#F2A516]" /> Personal & Academic Credentials
                  </h3>
                  <p className="text-xs sm:text-sm text-[#333333] font-medium">
                    Provide your official details as registered with SRM Institute of Science & Technology.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0D0D0D] uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alex Morgan"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D0D0D] uppercase mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="john@gmail.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0D0D0D] uppercase mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2.5 text-sm font-semibold text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-[#0D0D0D] uppercase mb-1">
                      Department / Course *
                    </label>
                    <select
                      value={formData.department}
                      onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                      className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2.5 text-sm font-bold text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D] truncate max-w-full"
                    >
                      {DEPARTMENTS.map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-[#0D0D0D] uppercase mb-1">
                      Year of Study *
                    </label>
                    <select
                      value={formData.year}
                      onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                      className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2.5 text-sm font-bold text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D] truncate max-w-full"
                    >
                      {YEARS.map((yr) => (
                        <option key={yr} value={yr}>
                          {yr}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 2: Domains & Portfolio Links */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="border-b-2 border-[#0D0D0D]/10 pb-4 mb-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] uppercase tracking-tight flex items-center gap-2">
                    <Layers className="w-6 h-6 text-[#F2A516]" /> Choose Domains & Work Showcases
                  </h3>
                  <p className="text-xs sm:text-sm text-[#333333] font-medium">
                    Select up to 2 domains you are interested in joining.
                  </p>
                </div>

                {/* Domain Selector Grid */}
                <div>
                  <label className="block text-xs font-bold text-[#0D0D0D] uppercase mb-3">
                    Target Domains (Click to Select) *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {DOMAINS_LIST.map((domain) => {
                      const selected = formData.domains.includes(domain.name);
                      const IconComp = DOMAIN_ICONS[domain.iconName] || Code;
                      return (
                        <button
                          key={domain.id}
                          type="button"
                          onClick={() => toggleDomain(domain.name)}
                          className={`p-4 rounded-2xl border-2 border-[#0D0D0D] text-left transition-all duration-200 cursor-pointer flex items-start gap-3 ${selected
                              ? "bg-[#F2A516] text-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D]"
                              : "bg-[#FFEFB4] text-[#0D0D0D] hover:bg-[#FFF2C6] shadow-[2px_2px_0_#0D0D0D]"
                            }`}
                        >
                          <div
                            className={`p-2 rounded-xl border border-[#0D0D0D] ${selected ? "bg-[#0D0D0D] text-[#FFEFB4]" : "bg-[#FFF2C6] text-[#0D0D0D]"
                              }`}
                          >
                            <IconComp className="w-5 h-5" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <h4 className="font-extrabold text-sm uppercase">{domain.name}</h4>
                              {selected && (
                                <div className="flex items-center gap-1.5 sm:gap-2">
                                  <span className="text-[9px] sm:text-[10px] bg-[#0D0D0D] text-[#FFEFB4] px-1.5 sm:px-2 py-0.5 rounded-md font-bold whitespace-nowrap">
                                    {formData.domains.indexOf(domain.name) === 0 ? "1st Choice" : "2nd Choice"}
                                  </span>
                                  <CheckCircle className="w-4 h-4 text-[#0D0D0D] shrink-0" />
                                </div>
                              )}
                            </div>
                            <p className="text-[11px] font-medium mt-0.5 opacity-90 leading-snug">
                              {domain.description}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Primary Domain Select */}
                {formData.domains.length > 1 && (
                  <div>
                    <label className="block text-xs font-bold text-[#0D0D0D] uppercase mb-1 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-[#F2A516]" /> Primary Domain Preference
                    </label>
                    <select
                      value={formData.primaryDomain}
                      onChange={(e) => setFormData({ ...formData, primaryDomain: e.target.value })}
                      className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2.5 text-sm font-bold text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D] truncate max-w-full"
                    >
                      {formData.domains.map((dom) => (
                        <option key={dom} value={dom}>
                          {dom}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Profiles & Links */}
                <div className="pt-2">
                  <h4 className="text-xs font-extrabold text-[#0D0D0D] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <LinkIcon className="w-4 h-4 text-[#F2A516]" /> Online Portfolios & Profiles
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[11px] font-bold text-[#0D0D0D] uppercase mb-1">
                        GitHub Profile URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://github.com/yourusername"
                        value={formData.githubUrl}
                        onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                        className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2 text-xs font-semibold text-[#0D0D0D] shadow-[2px_2px_0_#0D0D0D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#0D0D0D] uppercase mb-1">
                        LinkedIn Profile URL
                      </label>
                      <input
                        type="url"
                        placeholder="https://linkedin.com/in/yourprofile"
                        value={formData.linkedinUrl}
                        onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                        className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2 text-xs font-semibold text-[#0D0D0D] shadow-[2px_2px_0_#0D0D0D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#0D0D0D] uppercase mb-1">
                        Personal Portfolio / Figma
                      </label>
                      <input
                        type="url"
                        placeholder="https://yourportfolio.dev"
                        value={formData.portfolioUrl}
                        onChange={(e) => setFormData({ ...formData, portfolioUrl: e.target.value })}
                        className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2 text-xs font-semibold text-[#0D0D0D] shadow-[2px_2px_0_#0D0D0D]"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-[#0D0D0D] uppercase mb-1">
                        Resume Google Drive Link
                      </label>
                      <input
                        type="url"
                        placeholder="https://drive.google.com/file/..."
                        value={formData.resumeUrl}
                        onChange={(e) => setFormData({ ...formData, resumeUrl: e.target.value })}
                        className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-4 py-2 text-xs font-semibold text-[#0D0D0D] shadow-[2px_2px_0_#0D0D0D]"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* STEP 3: Essays & Final Submission */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-5"
              >
                <div className="border-b-2 border-[#0D0D0D]/10 pb-4 mb-4">
                  <h3 className="text-xl sm:text-2xl font-extrabold text-[#0D0D0D] uppercase tracking-tight flex items-center gap-2">
                    <FileText className="w-6 h-6 text-[#F2A516]" /> Statement & Past Experience
                  </h3>
                  <p className="text-xs sm:text-sm text-[#333333] font-medium">
                    Help us get to know your motivation, passion, and project highlights.
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D0D0D] uppercase mb-1">
                    Why do you want to join CodeKrafters? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Tell us what drives you, what you hope to learn, and how you want to contribute to the community..."
                    value={formData.whyJoin}
                    onChange={(e) => setFormData({ ...formData, whyJoin: e.target.value })}
                    className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl p-4 text-xs sm:text-sm font-semibold text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#0D0D0D] uppercase mb-1">
                    Highlight any past projects, hackathons, or design work
                  </label>
                  <textarea
                    rows={3}
                    placeholder="List tech stacks, links to repositories, awards, or previous team experience..."
                    value={formData.pastExperience}
                    onChange={(e) => setFormData({ ...formData, pastExperience: e.target.value })}
                    className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl p-4 text-xs sm:text-sm font-semibold text-[#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D]"
                  />
                </div>

                {/* Application Review Box */}
                <div className="bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-2xl p-4 text-xs space-y-2 shadow-[3px_3px_0_#0D0D0D]">
                  <h4 className="font-extrabold text-[#0D0D0D] uppercase flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-[#F2A516]" /> Application Summary Review
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-semibold text-[#333333]">
                    <div><span className="text-[#0D0D0D] font-bold">Applicant:</span> {formData.fullName}</div>
                    <div><span className="text-[#0D0D0D] font-bold">Year:</span> {formData.year}</div>
                    <div className="col-span-2"><span className="text-[#0D0D0D] font-bold">Applied Domains:</span> {formData.domains.join(", ")}</div>
                    <div><span className="text-[#0D0D0D] font-bold">Dept:</span> {formData.department}</div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form Actions Footer */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:justify-between pt-8 border-t-2 border-[#0D0D0D]/10 mt-6">
            {step > 1 ? (
              <button
                type="button"
                onClick={handlePrevStep}
                className="bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] px-5 py-3 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm uppercase flex items-center justify-center gap-2 border-2 border-[#0D0D0D] shadow-[3px_3px_0_#F2A516] cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" /> Previous
              </button>
            ) : (
              <div className="hidden sm:block" />
            )}

            {step < 3 ? (
              <button
                type="button"
                onClick={handleNextStep}
                className="bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] px-6 py-3 sm:py-2.5 rounded-full font-bold text-xs sm:text-sm uppercase flex items-center justify-center gap-2 border-2 border-[#0D0D0D] shadow-[3px_3px_0_#F2A516] hover:translate-y-[-2px] transition-all cursor-pointer"
              >
                Next Step <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={submitting}
                className="bg-[#F2A516] text-[#0D0D0D] hover:bg-[#F2B200] px-6 sm:px-8 py-3.5 sm:py-3 rounded-full font-extrabold text-[11px] sm:text-sm uppercase tracking-wide flex items-center justify-center gap-2 border-3 border-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D] hover:translate-y-[-2px] transition-all cursor-pointer disabled:opacity-50"
              >
                <span className="truncate">{submitting ? "Submitting..." : "Submit Application"}</span>
                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 shrink-0" />
              </button>
            )}
          </div>
        </form>
      </div>
    </motion.div>
  );
}
