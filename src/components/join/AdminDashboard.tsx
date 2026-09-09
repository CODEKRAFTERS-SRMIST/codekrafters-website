"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Application, ApplicationStatus, FilterOptions, UserSession, DOMAINS_LIST, DEPARTMENTS, YEARS } from "@/types/join";
import {
  fetchApplications,
  updateApplicationStatus,
  exportApplicationsToCSV,
  safeUrl,
} from "@/lib/api";
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  Users,
  CheckCircle,
  Clock,
  Star,
  ExternalLink,
  Github,
  Linkedin,
  FileText,
  X,
  Sparkles,
  LogOut,
  Edit3,
  ChevronDown,
  Layers,
} from "lucide-react";

interface AdminDashboardProps {
  session: UserSession;
  onLogout: () => void;
}

export function AdminDashboard({ session, onLogout }: AdminDashboardProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  useEffect(() => {
    fetchApplications()
      .then((apps) => setApplications(apps))
      .catch((e) => console.error(e))
      .finally(() => setLoading(false));
  }, []);

  // Filters State
  const [filters, setFilters] = useState<FilterOptions>({
    domain: "ALL",
    year: "ALL",
    department: "ALL",
    status: "ALL",
    search: "",
  });

  // Candidate Inspector / Status Modal state
  const [editingNotes, setEditingNotes] = useState("");
  const [editingRating, setEditingRating] = useState<number>(0);
  const [editingStatus, setEditingStatus] = useState<ApplicationStatus>("Under Review");
  const [savingStatus, setSavingStatus] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter Computation
  const filteredApplications = useMemo(() => {
    return applications.filter((app) => {
      // Domain filter
      if (filters.domain !== "ALL") {
        if (!app.domains.includes(filters.domain) && app.primaryDomain !== filters.domain) {
          return false;
        }
      }

      // Year filter
      if (filters.year !== "ALL" && app.year !== filters.year) {
        return false;
      }

      // Department filter
      if (filters.department !== "ALL" && app.department !== filters.department) {
        return false;
      }

      // Status filter
      if (filters.status !== "ALL" && app.status !== filters.status) {
        return false;
      }

      // Search query filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesName = app.fullName.toLowerCase().includes(query);
        const matchesEmail = app.email.toLowerCase().includes(query);
        const matchesPhone = app.phone.includes(query);
        if (!matchesName && !matchesEmail && !matchesPhone) {
          return false;
        }
      }

      return true;
    });
  }, [applications, filters]);

  // Statistics counters
  const stats = useMemo(() => {
    const total = applications.length;
    const underReview = applications.filter((a) => a.status === "Under Review").length;
    const shortlisted = applications.filter((a) => a.status === "Shortlisted").length;
    const accepted = applications.filter((a) => a.status === "Accepted").length;
    const interviewed = applications.filter((a) => a.status === "Interview Scheduled").length;

    return { total, underReview, shortlisted, interviewed, accepted };
  }, [applications]);

  const openInspector = (app: Application) => {
    setSelectedApp(app);
    setEditingStatus(app.status);
    setEditingNotes(app.adminNotes || "");
    setEditingRating(app.rating || 0);
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSaveInspector = async () => {
    if (!selectedApp) return;
    setSavingStatus(true);

    try {
      const updated = await updateApplicationStatus(
        selectedApp.id,
        editingStatus,
        editingNotes,
        editingRating
      );

      if (updated) {
        setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)));
        setSelectedApp(updated);
        showToast("Application successfully updated!");
      }
    } catch (err) {
      console.error("Failed to save:", err);
      showToast("Failed to save changes.");
    } finally {
      setSavingStatus(false);
    }
  };

  const handleExportCSV = () => {
    exportApplicationsToCSV(filteredApplications);
  };

  return (
    <div className="w-full mx-auto space-y-6 relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, y: 50 }}
            className="fixed bottom-6 right-6 z-[60] bg-emerald-500 text-white px-6 py-3 rounded-xl shadow-[4px_4px_0_#0D0D0D] border-2 border-[#0D0D0D] font-extrabold flex items-center gap-2"
          >
            <CheckCircle className="w-5 h-5" />
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header Bar */}
      <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 shadow-[8px_8px_0_#0D0D0D] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#F2A516] border-2 border-[#0D0D0D] rounded-2xl shadow-[3px_3px_0_#0D0D0D]">
            <ShieldCheck className="w-7 h-7 text-[#0D0D0D]" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#0D0D0D] text-[#FFEFB4] text-[10px] font-extrabold uppercase rounded-full shadow-[2px_2px_0_#F2A516] mb-1">
              <Sparkles className="w-3 h-3 text-[#F2A516]" /> CodeKrafters Admin Core
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#0D0D0D] tracking-tight">
              Recruitment Dashboard
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <button
            onClick={handleExportCSV}
            className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F2A516] text-[#0D0D0D] font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-full border-2 border-[#0D0D0D] shadow-[3px_3px_0_#0D0D0D] hover:translate-y-[-2px] transition-all cursor-pointer"
          >
            <Download className="w-4 h-4" /> Export CSV ({filteredApplications.length})
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#0D0D0D] text-[#FFEFB4] text-xs font-bold hover:text-[#F2A516] border-2 border-[#0D0D0D] shadow-[3px_3px_0_#F2A516] cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Exit Admin
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D0D0D]"></div>
        </div>
      ) : (
        <>
          {/* KPI Stats Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-2xl p-4 shadow-[4px_4px_0_#0D0D0D]">
          <div className="text-xs font-extrabold text-[#333333] uppercase">Total Applications</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] mt-1">{stats.total}</div>
        </div>

        <div className="bg-blue-100 border-2 border-[#0D0D0D] rounded-2xl p-4 shadow-[4px_4px_0_#0D0D0D]">
          <div className="text-xs font-extrabold text-blue-900 uppercase">Under Review</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-blue-950 mt-1">{stats.underReview}</div>
        </div>

        <div className="bg-purple-100 border-2 border-[#0D0D0D] rounded-2xl p-4 shadow-[4px_4px_0_#0D0D0D]">
          <div className="text-xs font-extrabold text-purple-900 uppercase">Shortlisted</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-purple-950 mt-1">{stats.shortlisted}</div>
        </div>

        <div className="bg-emerald-100 border-2 border-[#0D0D0D] rounded-2xl p-4 shadow-[4px_4px_0_#0D0D0D]">
          <div className="text-xs font-extrabold text-emerald-900 uppercase">Interviewed</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-emerald-950 mt-1">{stats.interviewed}</div>
        </div>

        <div className="bg-[#F2A516] border-2 border-[#0D0D0D] rounded-2xl p-4 shadow-[4px_4px_0_#0D0D0D] col-span-2 sm:col-span-1">
          <div className="text-xs font-extrabold text-[#0D0D0D] uppercase">Accepted Team</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#0D0D0D] mt-1">{stats.accepted}</div>
        </div>
      </div>

      {/* Filters & Control Panel */}
      <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-5 shadow-[8px_8px_0_#0D0D0D] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#0D0D0D]/10 pb-3">
          <h3 className="font-extrabold text-sm uppercase text-[#0D0D0D] flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#F2A516]" /> Application Filters & Search
          </h3>
          <button
            onClick={() =>
              setFilters({ domain: "ALL", year: "ALL", department: "ALL", status: "ALL", search: "" })
            }
            className="text-xs font-bold text-[#0D0D0D] hover:underline"
          >
            Reset Filters
          </button>
        </div>

        {/* Search bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3.5 text-[#0D0D0D]/60" />
          <input
            type="text"
            placeholder="Search applicants by Name, Email, or Phone..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm font-semibold text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:ring-2 focus:ring-[#F2A516] shadow-[3px_3px_0_#0D0D0D]"
          />
        </div>

        {/* Dropdown Filters Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Domain Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#0D0D0D] uppercase mb-1">
              Filter by Domain
            </label>
            <select
              value={filters.domain}
              onChange={(e) => setFilters({ ...filters, domain: e.target.value })}
              className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-3 py-2 text-xs font-bold text-[#0D0D0D] focus:outline-none shadow-[2px_2px_0_#0D0D0D]"
            >
              <option value="ALL">All Domains ({applications.length})</option>
              {DOMAINS_LIST.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Year Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#0D0D0D] uppercase mb-1">
              Filter by Year of Study
            </label>
            <select
              value={filters.year}
              onChange={(e) => setFilters({ ...filters, year: e.target.value })}
              className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-3 py-2 text-xs font-bold text-[#0D0D0D] focus:outline-none shadow-[2px_2px_0_#0D0D0D]"
            >
              <option value="ALL">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#0D0D0D] uppercase mb-1">
              Filter by Course / Department
            </label>
            <select
              value={filters.department}
              onChange={(e) => setFilters({ ...filters, department: e.target.value })}
              className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-3 py-2 text-xs font-bold text-[#0D0D0D] focus:outline-none shadow-[2px_2px_0_#0D0D0D]"
            >
              <option value="ALL">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <label className="block text-[11px] font-bold text-[#0D0D0D] uppercase mb-1">
              Filter by Application Status
            </label>
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-3 py-2 text-xs font-bold text-[#0D0D0D] focus:outline-none shadow-[2px_2px_0_#0D0D0D]"
            >
              <option value="ALL">All Statuses</option>
              <option value="Under Review">Under Review</option>
              <option value="Shortlisted">Shortlisted</option>
              <option value="Interview Scheduled">Interview Scheduled</option>
              <option value="Accepted">Accepted</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table / Cards */}
      <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 shadow-[8px_8px_0_#0D0D0D]">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-base uppercase text-[#0D0D0D]">
            Applicant Submissions ({filteredApplications.length})
          </h3>
          <span className="text-xs font-bold text-[#333333]">
            Click any candidate row to open inspector & score
          </span>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="text-center py-12 bg-[#FFEFB4] rounded-2xl border-2 border-[#0D0D0D]">
            <Users className="w-10 h-10 text-[#0D0D0D]/40 mx-auto mb-2" />
            <h4 className="font-extrabold text-[#0D0D0D] uppercase">No Matching Candidates Found</h4>
            <p className="text-xs text-[#333333] mt-1">Try resetting your active domain, year, or search filters.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#0D0D0D] text-[11px] font-extrabold uppercase text-[#0D0D0D] bg-[#FFF2C6] whitespace-nowrap">
                  <th className="p-3 rounded-l-xl">Applicant</th>
                  <th className="p-3">Year / Dept</th>
                  <th className="p-3">Primary Domain</th>
                  <th className="p-3">All Applied Domains</th>
                  <th className="p-3">Rating</th>
                  <th className="p-3">Status</th>
                  <th className="p-3 text-right rounded-r-xl">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y border-[#0D0D0D]/10 text-xs">
                {filteredApplications.map((app) => (
                  <tr
                    key={app.id}
                    onClick={() => openInspector(app)}
                    className="hover:bg-[#FFF2C6]/60 transition-colors cursor-pointer"
                  >
                    <td className="p-3">
                      <div className="font-extrabold text-[#0D0D0D] text-sm">{app.fullName}</div>
                      <div className="text-[11px] text-[#333333] font-medium">{app.email}</div>
                    </td>

                    <td className="p-3 font-semibold text-[#0D0D0D]">
                      <span className="bg-[#0D0D0D] text-[#FFEFB4] px-2 py-0.5 rounded text-[10px] font-bold">
                        {app.year}
                      </span>
                      <div className="text-[11px] mt-1 text-[#333333] truncate max-w-[140px]">
                        {app.department}
                      </div>
                    </td>

                    <td className="p-3">
                      <span className="bg-[#F2A516] text-[#0D0D0D] px-2.5 py-1 rounded-full font-extrabold text-[11px] border border-[#0D0D0D] shadow-[1px_1px_0_#0D0D0D] inline-block whitespace-nowrap">
                        {app.primaryDomain}
                      </span>
                    </td>

                    <td className="p-3">
                      <div className="flex flex-wrap gap-1 max-w-[200px]">
                        {app.domains.map((d) => (
                          <span
                            key={d}
                            className="bg-[#FFEFB4] border border-[#0D0D0D] text-[#0D0D0D] px-1.5 py-0.5 rounded text-[10px] font-semibold whitespace-nowrap"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3">
                      {app.rating ? (
                        <div className="flex items-center gap-0.5 font-bold text-[#0D0D0D]">
                          <Star className="w-3.5 h-3.5 fill-[#F2A516] text-[#F2A516]" />
                          <span>{app.rating}/5</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Unrated</span>
                      )}
                    </td>

                    <td className="p-3">
                      <span
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] border border-[#0D0D0D] whitespace-nowrap ${app.status === "Accepted"
                            ? "bg-[#F2A516] text-[#0D0D0D]"
                            : app.status === "Shortlisted"
                              ? "bg-purple-200 text-purple-900"
                              : app.status === "Interview Scheduled"
                                ? "bg-emerald-200 text-emerald-900"
                                : app.status === "Under Review"
                                  ? "bg-amber-200 text-amber-900"
                                  : app.status === "Rejected"
                                    ? "bg-rose-200 text-rose-900"
                                    : "bg-blue-200 text-blue-900"
                          }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          openInspector(app);
                        }}
                        className="p-2 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] rounded-xl border border-[#0D0D0D] font-bold text-[11px] shadow-[2px_2px_0_#F2A516]"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Candidate Inspector Modal Drawer */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 lg:p-10 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-10 max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-[12px_12px_0_#0D0D0D] relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] cursor-pointer shadow-[2px_2px_0_#F2A516] z-10"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Column: Candidate Info */}
                <div className="space-y-8">
                  {/* Modal Header */}
                  <div className="border-b-2 border-[#0D0D0D]/10 pb-6 pr-12">
                    <h2 className="text-3xl sm:text-4xl font-black uppercase text-[#0D0D0D] tracking-tight">
                      {selectedApp.fullName}
                    </h2>
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <p className="text-sm text-[#333333] font-bold bg-white px-3 py-1 rounded-lg border-2 border-[#0D0D0D]">
                        {selectedApp.email}
                      </p>
                      <p className="text-sm text-[#333333] font-bold bg-white px-3 py-1 rounded-lg border-2 border-[#0D0D0D]">
                        {selectedApp.phone}
                      </p>
                    </div>
                  </div>

                  {/* Academic & Domain info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white border-2 border-[#0D0D0D] rounded-2xl shadow-[3px_3px_0_#0D0D0D]">
                      <span className="font-extrabold uppercase text-[10px] text-[#F2A516] tracking-wider block mb-1">
                        Academic Details
                      </span>
                      <div className="font-black text-[#0D0D0D] text-lg leading-tight">
                        {selectedApp.year} <br />
                        <span className="text-sm font-bold text-[#333333]">{selectedApp.department}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-white border-2 border-[#0D0D0D] rounded-2xl shadow-[3px_3px_0_#0D0D0D]">
                      <span className="font-extrabold uppercase text-[10px] text-[#F2A516] tracking-wider block mb-2">
                        Applied Domains
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.domains.map((d) => (
                          <span
                            key={d}
                            className="bg-[#0D0D0D] text-[#FFEFB4] px-3 py-1 rounded-lg text-[11px] font-extrabold border border-[#0D0D0D]"
                          >
                            {d}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Work Links & Portfolios */}
                  <div>
                    <h4 className="text-sm font-black uppercase text-[#0D0D0D] mb-3 flex items-center gap-2">
                      <ExternalLink className="w-5 h-5 text-[#F2A516]" /> Portfolios & External Links
                    </h4>
                    
                    {!(safeUrl(selectedApp.githubUrl) || safeUrl(selectedApp.linkedinUrl) || safeUrl(selectedApp.portfolioUrl) || safeUrl(selectedApp.resumeUrl)) ? (
                      <p className="text-sm text-gray-500 font-bold italic bg-white p-4 rounded-xl border border-dashed border-gray-300">
                        No external links or portfolios provided.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-3">
                        {safeUrl(selectedApp.githubUrl) && (
                          <a
                            href={safeUrl(selectedApp.githubUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#0D0D0D] hover:bg-[#F2A516] rounded-xl border-2 border-[#0D0D0D] font-bold shadow-[3px_3px_0_#0D0D0D] transition-colors"
                          >
                            <Github className="w-4 h-4" /> GitHub
                          </a>
                        )}

                        {safeUrl(selectedApp.linkedinUrl) && (
                          <a
                            href={safeUrl(selectedApp.linkedinUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#0D0D0D] hover:bg-[#F2A516] rounded-xl border-2 border-[#0D0D0D] font-bold shadow-[3px_3px_0_#0D0D0D] transition-colors"
                          >
                            <Linkedin className="w-4 h-4" /> LinkedIn
                          </a>
                        )}

                        {safeUrl(selectedApp.portfolioUrl) && (
                          <a
                            href={safeUrl(selectedApp.portfolioUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] rounded-xl border-2 border-[#0D0D0D] font-bold shadow-[3px_3px_0_#F2A516] transition-colors"
                          >
                            Portfolio / Web <ExternalLink className="w-4 h-4" />
                          </a>
                        )}

                        {safeUrl(selectedApp.resumeUrl) && (
                          <a
                            href={safeUrl(selectedApp.resumeUrl)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-2.5 bg-white text-[#0D0D0D] hover:bg-[#F2A516] rounded-xl border-2 border-[#0D0D0D] font-bold shadow-[3px_3px_0_#0D0D0D] transition-colors"
                          >
                            <FileText className="w-4 h-4" /> Resume Document
                          </a>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Right Column: Text Answers & Admin Panel */}
                <div className="space-y-8 flex flex-col h-full">
                  {/* Why Join Statement */}
                  <div>
                    <h4 className="text-sm font-black uppercase text-[#0D0D0D] mb-2">
                      Why Join CodeKrafters?
                    </h4>
                    <div className="bg-white border-2 border-[#0D0D0D] p-5 rounded-2xl shadow-[4px_4px_0_#0D0D0D]">
                      <p className="text-sm font-medium text-[#111] leading-relaxed whitespace-pre-wrap">
                        {selectedApp.whyJoin}
                      </p>
                    </div>
                  </div>

                  {/* Past Experience */}
                  {selectedApp.pastExperience && (
                    <div>
                      <h4 className="text-sm font-black uppercase text-[#0D0D0D] mb-2">
                        Past Projects & Experience
                      </h4>
                      <div className="bg-white border-2 border-[#0D0D0D] p-5 rounded-2xl shadow-[4px_4px_0_#0D0D0D]">
                        <p className="text-sm font-medium text-[#111] leading-relaxed whitespace-pre-wrap">
                          {selectedApp.pastExperience}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="flex-grow"></div>

                  {/* Admin Evaluation & Status Updater Box */}
                  <div className="bg-[#FFF2C6] border-3 border-[#0D0D0D] p-6 sm:p-8 rounded-3xl space-y-6 shadow-[6px_6px_0_#0D0D0D]">
                    <h4 className="text-base font-black uppercase flex items-center gap-2 border-b-2 border-[#0D0D0D]/10 pb-4 text-[#0D0D0D]">
                      <Edit3 className="w-5 h-5 text-[#F2A516]" /> Admin Evaluation Panel
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-extrabold uppercase mb-2 text-[#0D0D0D]">
                          Update Application Status
                        </label>
                        <select
                          value={editingStatus}
                          onChange={(e) => setEditingStatus(e.target.value as ApplicationStatus)}
                          className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl p-3 text-sm font-black text-[#0D0D0D] cursor-pointer"
                        >
                          <option value="Under Review">Under Review</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview Scheduled">Interview Scheduled</option>
                          <option value="Accepted">Accepted</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-extrabold uppercase mb-2 text-[#0D0D0D]">
                          Candidate Rating (Out of 5)
                        </label>
                        <div className="flex items-center gap-1.5 pt-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setEditingRating(star)}
                              className="cursor-pointer hover:scale-110 transition-transform"
                            >
                              <Star
                                className={`w-8 h-8 ${star <= editingRating
                                    ? "fill-[#F2A516] text-[#F2A516]"
                                    : "text-gray-400"
                                  }`}
                              />
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-extrabold uppercase mb-2 text-[#0D0D0D]">
                        Internal Notes / Comments
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Add reviewer comments, interview performance notes..."
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl p-4 text-sm font-medium text-[#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:border-[#F2A516] transition-colors"
                      />
                    </div>

                    <button
                      onClick={handleSaveInspector}
                      disabled={savingStatus}
                      className="w-full bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] py-4 rounded-xl font-black text-sm uppercase tracking-wider shadow-[4px_4px_0_#F2A516] hover:translate-y-[-2px] hover:shadow-[6px_6px_0_#F2A516] transition-all cursor-pointer"
                    >
                      {savingStatus ? "Saving Changes..." : "Save Evaluation"}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </>
      )}
    </div>
  );
}
