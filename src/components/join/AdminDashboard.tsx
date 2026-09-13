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
  CheckCircle2,
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
  Settings,
  Lock,
  Unlock,
  Eye,
  EyeOff,
  Save,
  Calendar,
  ArrowLeft,
  Mail,
  Send,
} from "lucide-react";
import { RECRUITMENT_TIMELINE_STEPS } from "@/data/recruitmentTasks";
import { SendEmailModal, EmailModalMode } from "./SendEmailModal";

interface AdminDashboardProps {
  session: UserSession;
  onLogout: () => void;
}

export function AdminDashboard({ session, onLogout }: AdminDashboardProps) {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);

  const [activeTab, setActiveTab] = useState<"APPLICATIONS" | "USERS" | "SETTINGS" | "EMAIL_CENTER">("APPLICATIONS");
  const [systemUsers, setSystemUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // User Management filtering & search state
  const [userRoleFilter, setUserRoleFilter] = useState<"ALL" | "DOMAIN_ADMIN" | "APPLICANT" | "EXECUTIVE">("ALL");
  const [userDomainFilter, setUserDomainFilter] = useState<string>("ALL");
  const [userSearchQuery, setUserSearchQuery] = useState<string>("");

  // Recruitment Phase & Task Gating State
  const [currentPhase, setCurrentPhase] = useState<number>(1);
  const [tasksVisible, setTasksVisible] = useState<boolean>(false);
  const [savingSettings, setSavingSettings] = useState<boolean>(false);
  const [settingsSavedToast, setSettingsSavedToast] = useState<string | null>(null);

  // Email Modal State
  const [emailModalOpen, setEmailModalOpen] = useState<boolean>(false);
  const [emailModalMode, setEmailModalMode] = useState<EmailModalMode>("SHORTLIST_INDIVIDUAL");
  const [emailTargetApp, setEmailTargetApp] = useState<Application | null>(null);

  // Candidate Inspector Tab State
  const [inspectorTab, setInspectorTab] = useState<"PROFILE" | "ANSWERS" | "TASK" | "EVALUATION">("PROFILE");

  useEffect(() => {
    fetch("/api/admin/recruitment-settings")
      .then((r) => r.json())
      .then((d) => {
        if (d?.settings) {
          setCurrentPhase(Number(d.settings.current_phase) || 1);
          setTasksVisible(Boolean(d.settings.tasks_visible));
        }
      })
      .catch((e) => console.warn(e));
  }, []);

  const handleUpdateRecruitmentSettings = async (phase: number, visible: boolean) => {
    setSavingSettings(true);
    try {
      const res = await fetch("/api/admin/recruitment-settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          current_phase: phase,
          tasks_visible: visible,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCurrentPhase(phase);
        setTasksVisible(visible);
        setSettingsSavedToast("Recruitment Phase & Task Access Updated!");
        setTimeout(() => setSettingsSavedToast(null), 3500);
      } else {
        alert(data.error || "Failed to update settings");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSavingSettings(false);
    }
  };

  const [authError, setAuthError] = useState<string | null>(null);

  const loadApplications = async () => {
    setLoading(true);
    try {
      const apps = await fetchApplications();
      setApplications(apps);
      setAuthError(null);
    } catch (e: any) {
      console.error("fetchApplications error:", e);
      if (e?.message?.toLowerCase().includes("unauthorized") || e?.message?.toLowerCase().includes("forbidden") || e?.message?.toLowerCase().includes("401") || e?.message?.toLowerCase().includes("403")) {
        setAuthError("Server session expired or unauthorized. Please re-login to refresh credentials.");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadApplications();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch(`/api/admin/users`);
      const data = await res.json();
      if (res.ok) {
        setSystemUsers(data.users || []);
        setAuthError(null);
      } else if (res.status === 401 || res.status === 403) {
        setAuthError("Server session expired or unauthorized. Please re-login to refresh credentials.");
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingUsers(false);
    }
  };

  useEffect(() => {
    if (activeTab === "USERS" && (session.role === "PRESIDENT" || session.role === "VICE_PRESIDENT")) {
      fetchUsers();
    }
  }, [activeTab, session.role]);

  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      if (params.get("tab")?.toUpperCase() === "USERS" && (session.role === "PRESIDENT" || session.role === "VICE_PRESIDENT")) {
        setActiveTab("USERS");
      }
    } catch (e) {}
  }, [session.role]);

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
      // Enforce Domain Admin restriction
      if (session.role === "DOMAIN_ADMIN" && session.domain_id) {
        const adminNorm = session.domain_id.toLowerCase().replace(/[^a-z0-9]/g, "");
        const matchesDomain = (d: string) => d && d.toLowerCase().replace(/[^a-z0-9]/g, "") === adminNorm;
        if (!app.domains.some(matchesDomain) && !matchesDomain(app.primaryDomain)) {
          return false;
        }
      }

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
  }, [applications, filters, session]);

  // Statistics counters
  const stats = useMemo(() => {
    const total = filteredApplications.length;
    const applied = filteredApplications.filter((a) => a.status === "Applied").length;
    const taskOngoing = filteredApplications.filter((a) => a.status === "Task Ongoing").length;
    const taskCompleted = filteredApplications.filter((a) => a.status === "Task Completed").length;
    const underReview = filteredApplications.filter((a) => a.status === "Under Review").length;
    const shortlisted = filteredApplications.filter((a) => a.status === "Shortlisted").length;
    const accepted = filteredApplications.filter((a) => a.status === "Accepted").length;
    const interviewed = filteredApplications.filter((a) => a.status === "Interview Scheduled").length;

    return { total, applied, taskOngoing, taskCompleted, underReview, shortlisted, interviewed, accepted };
  }, [filteredApplications]);

  const openInspector = (app: Application, tab: "PROFILE" | "ANSWERS" | "TASK" | "EVALUATION" = "PROFILE") => {
    setSelectedApp(app);
    setEditingStatus(app.status);
    setEditingNotes(app.adminNotes || "");
    setEditingRating(app.rating || 0);
    setInspectorTab(tab);
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

  // Filtered System Users based on role, domain, and name/email search
  const filteredUsers = useMemo(() => {
    return systemUsers.filter((u) => {
      // Role filter
      if (userRoleFilter === "EXECUTIVE") {
        if (u.role !== "PRESIDENT" && u.role !== "VICE_PRESIDENT") return false;
      } else if (userRoleFilter !== "ALL" && u.role !== userRoleFilter) {
        return false;
      }

      // Domain filter
      if (userDomainFilter !== "ALL" && u.domain_id !== userDomainFilter) {
        return false;
      }

      // Search by name and email ID
      if (userSearchQuery.trim()) {
        const query = userSearchQuery.toLowerCase().trim();
        const fullName = (u.fullName || u.full_name || "").toLowerCase();
        const email = (u.email || "").toLowerCase();
        if (!fullName.includes(query) && !email.includes(query)) {
          return false;
        }
      }

      return true;
    });
  }, [systemUsers, userRoleFilter, userDomainFilter, userSearchQuery]);

  const userCounts = useMemo(() => {
    const total = systemUsers.length;
    const domainAdmins = systemUsers.filter((u) => u.role === "DOMAIN_ADMIN").length;
    const applicants = systemUsers.filter((u) => u.role === "APPLICANT").length;
    const executive = systemUsers.filter((u) => u.role === "PRESIDENT" || u.role === "VICE_PRESIDENT").length;
    return { total, domainAdmins, applicants, executive };
  }, [systemUsers]);

  const handleRoleChange = async (userId: string, newRole: string, newDomainId?: string) => {
    setSystemUsers((prev) =>
      prev.map((u) =>
        u.id === userId
          ? {
              ...u,
              role: newRole,
              domain_id:
                newRole === "DOMAIN_ADMIN"
                  ? newDomainId !== undefined
                    ? newDomainId
                    : u.domain_id
                  : null,
            }
          : u
      )
    );

    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          adminId: session.id,
          targetUserId: userId,
          role: newRole,
          domain_id: newRole === "DOMAIN_ADMIN" ? newDomainId : null,
        }),
      });
      if (res.ok) {
        showToast("User updated successfully");
        fetchUsers();
      } else {
        const data = await res.json();
        showToast(data.error || "Failed to update user");
        fetchUsers();
      }
    } catch (err) {
      showToast("Error updating user");
      fetchUsers();
    }
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
              <Sparkles className="w-3 h-3 text-[#F2A516]" /> {session.role === "PRESIDENT" ? "President Dashboard" : session.role === "VICE_PRESIDENT" ? "Vice President Dashboard" : "Domain Admin Dashboard"}
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold uppercase text-[#0D0D0D] tracking-tight">
              Recruitment Center
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          {/* Send Emails / Email Center Button */}
          <button
            type="button"
            onClick={() => {
              setEmailModalMode("SHORTLIST_BATCH");
              setEmailTargetApp(null);
              setEmailModalOpen(true);
            }}
            className="flex items-center gap-2 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-full border-2 border-[#0D0D0D] shadow-[3px_3px_0_#F2A516] hover:translate-y-[-2px] transition-all cursor-pointer"
          >
            <Mail className="w-4 h-4 text-[#F2A516]" /> Email Candidates ✉️
          </button>

          {activeTab === "APPLICATIONS" && (
            <button
              onClick={handleExportCSV}
              className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-[#F2A516] text-[#0D0D0D] font-extrabold text-xs sm:text-sm px-4 py-2.5 rounded-full border-2 border-[#0D0D0D] shadow-[3px_3px_0_#0D0D0D] hover:translate-y-[-2px] transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" /> Export CSV ({filteredApplications.length})
            </button>
          )}

          {/* Back to Profile */}
          <button
            onClick={() => (window.location.href = "/profile")}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#FFF2C6] text-[#0D0D0D] text-xs font-bold hover:bg-[#F2A516] border-2 border-[#0D0D0D] shadow-[3px_3px_0_#0D0D0D] cursor-pointer hover:translate-y-[-1px] transition-all"
          >
            <ArrowLeft className="w-4 h-4" /> Profile
          </button>

          <button
            onClick={onLogout}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-full bg-[#0D0D0D] text-[#FFEFB4] text-xs font-bold hover:text-[#F2A516] border-2 border-[#0D0D0D] shadow-[3px_3px_0_#F2A516] cursor-pointer"
          >
            <LogOut className="w-4 h-4" /> Exit Admin
          </button>
        </div>
      </div>

      {authError && (
        <div className="bg-amber-100 border-3 border-amber-600 rounded-2xl p-4 shadow-[4px_4px_0_#0D0D0D] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-black text-xs sm:text-sm uppercase text-amber-950">Session Expired or Unauthorized</h4>
              <p className="text-xs font-bold text-amber-900 mt-0.5">{authError}</p>
            </div>
          </div>
          <button
            onClick={() => {
              onLogout();
              window.location.href = "/login?redirect=/join&reauth=true";
            }}
            className="px-4 py-2 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] border-2 border-[#0D0D0D] rounded-xl font-black text-xs uppercase shadow-[2px_2px_0_#F2A516] cursor-pointer whitespace-nowrap"
          >
            Re-Login Now ➔
          </button>
        </div>
      )}

      <div className="flex overflow-x-auto whitespace-nowrap gap-2 sm:gap-4 border-b-2 border-[#0D0D0D] pb-2 custom-scrollbar">
        <button
          onClick={() => setActiveTab("APPLICATIONS")}
          className={`font-extrabold text-sm sm:text-base px-4 py-2 rounded-t-xl transition-colors shrink-0 cursor-pointer ${activeTab === "APPLICATIONS" ? "bg-[#0D0D0D] text-[#FFEFB4]" : "text-[#0D0D0D] hover:bg-[#0D0D0D]/10"}`}
        >
          Applications ({filteredApplications.length})
        </button>

        {(session.role === "PRESIDENT" || session.role === "VICE_PRESIDENT") && (
          <button
            onClick={() => setActiveTab("USERS")}
            className={`font-extrabold text-sm sm:text-base px-4 py-2 rounded-t-xl transition-colors shrink-0 cursor-pointer ${activeTab === "USERS" ? "bg-[#0D0D0D] text-[#FFEFB4]" : "text-[#0D0D0D] hover:bg-[#0D0D0D]/10"}`}
          >
            User Management
          </button>
        )}

        {(session.role === "PRESIDENT" || session.role === "VICE_PRESIDENT") && (
          <button
            onClick={() => setActiveTab("SETTINGS")}
            className={`font-extrabold text-sm sm:text-base px-4 py-2 rounded-t-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${activeTab === "SETTINGS" ? "bg-[#0D0D0D] text-[#FFEFB4]" : "text-[#0D0D0D] hover:bg-[#0D0D0D]/10"}`}
          >
            <Settings className="w-4 h-4" /> Phase & Task Controls
          </button>
        )}

        <button
          onClick={() => setActiveTab("EMAIL_CENTER")}
          className={`font-extrabold text-sm sm:text-base px-4 py-2 rounded-t-xl transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer ${activeTab === "EMAIL_CENTER" ? "bg-[#0D0D0D] text-[#FFEFB4]" : "text-[#0D0D0D] hover:bg-[#0D0D0D]/10"}`}
        >
          <Mail className="w-4 h-4 text-[#F2A516]" /> Email Center & Broadcasts
        </button>
      </div>

      {activeTab === "USERS" ? (
        <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 shadow-[8px_8px_0_#0D0D0D] space-y-6">
          {/* Header Row: Title & Search Bar */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b-2 border-[#0D0D0D]/10 pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-extrabold text-base sm:text-lg uppercase text-[#0D0D0D]">System Users</h3>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-black bg-[#0D0D0D] text-[#FFEFB4]">
                  {filteredUsers.length} of {systemUsers.length}
                </span>
              </div>
              <p className="text-xs font-semibold text-[#555555] mt-0.5">
                Filter and manage roles, search users, and assign domain administrative permissions.
              </p>
            </div>

            {/* Search Bar for Name and Email */}
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#0D0D0D]/50 pointer-events-none" />
              <input
                type="text"
                placeholder="Search by name or email..."
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-white text-[#0D0D0D] font-bold text-xs sm:text-sm border-2 border-[#0D0D0D] rounded-xl shadow-[3px_3px_0_#0D0D0D] placeholder-[#0D0D0D]/40 focus:outline-none focus:ring-2 focus:ring-[#F2A516]"
              />
              {userSearchQuery && (
                <button
                  type="button"
                  onClick={() => setUserSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#0D0D0D]/60 hover:text-[#0D0D0D] cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>

          {/* Filters Bar: Role Pills & Domain Filter */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-[#FFF2C6] p-3.5 rounded-2xl border-2 border-[#0D0D0D] shadow-[2px_2px_0_#0D0D0D]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-black uppercase text-[#0D0D0D] flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-[#F2A516]" /> Role:
              </span>

              <button
                type="button"
                onClick={() => setUserRoleFilter("ALL")}
                className={`px-3 py-1.5 rounded-xl border-2 border-[#0D0D0D] font-extrabold text-xs transition-all cursor-pointer ${
                  userRoleFilter === "ALL"
                    ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[2px_2px_0_#F2A516]"
                    : "bg-white text-[#0D0D0D] hover:bg-white/80 shadow-[2px_2px_0_#0D0D0D]"
                }`}
              >
                All ({userCounts.total})
              </button>

              <button
                type="button"
                onClick={() => setUserRoleFilter("DOMAIN_ADMIN")}
                className={`px-3 py-1.5 rounded-xl border-2 border-[#0D0D0D] font-extrabold text-xs transition-all cursor-pointer ${
                  userRoleFilter === "DOMAIN_ADMIN"
                    ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[2px_2px_0_#F2A516]"
                    : "bg-white text-[#0D0D0D] hover:bg-white/80 shadow-[2px_2px_0_#0D0D0D]"
                }`}
              >
                Domain Admins ({userCounts.domainAdmins})
              </button>

              <button
                type="button"
                onClick={() => setUserRoleFilter("APPLICANT")}
                className={`px-3 py-1.5 rounded-xl border-2 border-[#0D0D0D] font-extrabold text-xs transition-all cursor-pointer ${
                  userRoleFilter === "APPLICANT"
                    ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[2px_2px_0_#F2A516]"
                    : "bg-white text-[#0D0D0D] hover:bg-white/80 shadow-[2px_2px_0_#0D0D0D]"
                }`}
              >
                Applicants ({userCounts.applicants})
              </button>

              <button
                type="button"
                onClick={() => setUserRoleFilter("EXECUTIVE")}
                className={`px-3 py-1.5 rounded-xl border-2 border-[#0D0D0D] font-extrabold text-xs transition-all cursor-pointer ${
                  userRoleFilter === "EXECUTIVE"
                    ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[2px_2px_0_#F2A516]"
                    : "bg-white text-[#0D0D0D] hover:bg-white/80 shadow-[2px_2px_0_#0D0D0D]"
                }`}
              >
                Presidents / VPs ({userCounts.executive})
              </button>
            </div>

            {/* Domain Filter & Reset */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs font-black uppercase text-[#0D0D0D]">Domain:</span>
              <select
                value={userDomainFilter}
                onChange={(e) => setUserDomainFilter(e.target.value)}
                className="bg-white text-black font-bold border-2 border-[#0D0D0D] rounded-xl px-3 py-1.5 text-xs shadow-[2px_2px_0_#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#F2A516] cursor-pointer"
                style={{ colorScheme: "light", color: "#000000" }}
              >
                <option value="ALL">All Domains</option>
                {DOMAINS_LIST.map((d) => (
                  <option key={d.id} value={d.name}>
                    {d.name}
                  </option>
                ))}
              </select>

              {(userRoleFilter !== "ALL" || userDomainFilter !== "ALL" || userSearchQuery) && (
                <button
                  type="button"
                  onClick={() => {
                    setUserRoleFilter("ALL");
                    setUserDomainFilter("ALL");
                    setUserSearchQuery("");
                  }}
                  className="px-2.5 py-1.5 rounded-xl border border-dashed border-[#0D0D0D] text-[11px] font-extrabold text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-[#FFEFB4] transition-all cursor-pointer"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {loadingUsers ? (
            <div className="flex justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D0D0D]"></div>
            </div>
          ) : filteredUsers.length === 0 ? (
            /* Empty State */
            <div className="text-center py-12 bg-white border-2 border-dashed border-[#0D0D0D]/30 rounded-2xl p-6">
              <Users className="w-10 h-10 text-gray-400 mx-auto mb-3" />
              <p className="font-black text-sm text-[#0D0D0D] uppercase">No matching users found</p>
              <p className="text-xs text-gray-600 font-medium mt-1">
                {userSearchQuery
                  ? `No users found matching "${userSearchQuery}" in name or email.`
                  : "No users match your selected role or domain filter."}
              </p>
              <button
                type="button"
                onClick={() => {
                  setUserRoleFilter("ALL");
                  setUserDomainFilter("ALL");
                  setUserSearchQuery("");
                }}
                className="mt-4 px-4 py-2 bg-[#F2A516] text-[#0D0D0D] font-extrabold text-xs rounded-xl border-2 border-[#0D0D0D] shadow-[2px_2px_0_#0D0D0D] hover:translate-y-[-1px] transition-all cursor-pointer"
              >
                Clear Filters & Search
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-[#0D0D0D] text-[11px] font-extrabold uppercase text-[#0D0D0D] bg-[#FFF2C6]">
                    <th className="p-3">User</th>
                    <th className="p-3">Current Role</th>
                    <th className="p-3">Assigned Domain</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-[#0D0D0D]/10 text-xs">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-white/40 transition-colors">
                      <td className="p-3 font-bold text-[#0D0D0D]">
                        {(u.fullName || u.full_name) || "N/A"}
                        <br />
                        <span className="text-[10px] font-medium text-gray-600">{u.email}</span>
                      </td>
                      <td className="p-3">
                        <select
                          value={u.role}
                          onChange={(e) => {
                            const newRole = e.target.value;
                            handleRoleChange(
                              u.id,
                              newRole,
                              newRole === "DOMAIN_ADMIN" ? (u.domain_id || "") : undefined
                            );
                          }}
                          className="bg-white text-black font-bold border-2 border-[#0D0D0D] rounded-lg px-2.5 py-1.5 text-xs shadow-[2px_2px_0_#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#F2A516] cursor-pointer"
                          style={{ colorScheme: "light", color: "#000000" }}
                        >
                          <option value="APPLICANT" className="text-black bg-white font-medium" style={{ color: "#000000", backgroundColor: "#ffffff" }}>Applicant</option>
                          <option value="DOMAIN_ADMIN" className="text-black bg-white font-medium" style={{ color: "#000000", backgroundColor: "#ffffff" }}>Domain Admin</option>
                          <option value="VICE_PRESIDENT" className="text-black bg-white font-medium" style={{ color: "#000000", backgroundColor: "#ffffff" }}>Vice President</option>
                          <option value="PRESIDENT" className="text-black bg-white font-medium" style={{ color: "#000000", backgroundColor: "#ffffff" }}>President</option>
                        </select>
                      </td>
                      <td className="p-3">
                        {u.role === "DOMAIN_ADMIN" ? (
                          <select
                            value={u.domain_id || ""}
                            onChange={(e) => handleRoleChange(u.id, "DOMAIN_ADMIN", e.target.value)}
                            className={`bg-white text-black font-bold border-2 ${!u.domain_id ? "border-amber-500 ring-2 ring-amber-400/50" : "border-[#0D0D0D]"} rounded-lg px-2.5 py-1.5 text-xs shadow-[2px_2px_0_#0D0D0D] focus:outline-none focus:ring-2 focus:ring-[#F2A516] cursor-pointer`}
                            style={{ colorScheme: "light", color: "#000000" }}
                          >
                            <option value="" className="text-gray-500 bg-white" style={{ color: "#666666", backgroundColor: "#ffffff" }}>Select Domain...</option>
                            {DOMAINS_LIST.map((d) => (
                              <option key={d.id} value={d.name} className="text-black bg-white font-medium" style={{ color: "#000000", backgroundColor: "#ffffff" }}>
                                {d.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-gray-400 font-bold">—</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === "SETTINGS" ? (
        <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0_#0D0D0D] space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b-2 border-[#0D0D0D]/10 pb-4">
            <div>
              <h3 className="font-black text-lg uppercase text-[#0D0D0D] flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#F2A516]" /> Recruitment Phase & Task Access Manager
              </h3>
              <p className="text-xs font-semibold text-[#555555] mt-0.5">
                Control the active recruitment milestone displayed on candidate dashboards and manage access to domain task briefings.
              </p>
            </div>
            {settingsSavedToast && (
              <span className="px-3 py-1 bg-emerald-100 text-emerald-900 border border-emerald-800 rounded-full text-xs font-black animate-pulse">
                ✓ {settingsSavedToast}
              </span>
            )}
          </div>

          {/* Current Active Status Callout */}
          <div className="p-4 bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-2xl flex flex-wrap items-center justify-between gap-3 shadow-[2px_2px_0_#0D0D0D]">
            <div>
              <span className="text-[10px] font-black uppercase text-gray-700 block">Current Active Phase</span>
              <span className="text-sm font-black uppercase text-[#0D0D0D]">
                Phase {currentPhase}: {RECRUITMENT_TIMELINE_STEPS.find((s) => s.phaseNumber === currentPhase)?.phase.replace(/^Phase \d+: /, "") || "Active Phase"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-extrabold text-[#0D0D0D]">Task Links:</span>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${tasksVisible ? "bg-emerald-100 text-emerald-900 border-emerald-800" : "bg-amber-100 text-amber-900 border-amber-800"}`}>
                {tasksVisible ? "Unlocked & Visible" : "Locked / Hidden"}
              </span>
            </div>
          </div>

          {/* Phase Selector Grid */}
          <div>
            <label className="block text-xs font-black uppercase text-[#0D0D0D] mb-3">
              Select Active Recruitment Phase:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {RECRUITMENT_TIMELINE_STEPS.map((step) => {
                const isSelected = currentPhase === step.phaseNumber;
                return (
                  <button
                    key={step.phaseNumber}
                    type="button"
                    onClick={() => {
                      // Automatically recommend tasksVisible true when switching to Phase 2
                      const nextVisible = step.phaseNumber === 2 ? true : false;
                      handleUpdateRecruitmentSettings(step.phaseNumber, nextVisible);
                    }}
                    className={`p-4 rounded-2xl border-2 border-[#0D0D0D] text-left transition-all cursor-pointer ${
                      isSelected
                        ? "bg-[#F2A516] text-[#0D0D0D] shadow-[4px_4px_0_#0D0D0D] ring-2 ring-[#0D0D0D]"
                        : "bg-white text-[#0D0D0D] hover:bg-[#FFF2C6] shadow-[2px_2px_0_#0D0D0D]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-md ${isSelected ? "bg-[#0D0D0D] text-[#FFEFB4]" : "bg-[#0D0D0D]/10 text-[#0D0D0D]"}`}>
                        {step.date}
                      </span>
                      {isSelected && <CheckCircle className="w-4 h-4 text-[#0D0D0D]" />}
                    </div>
                    <h5 className="font-black text-xs uppercase mb-1">{step.phase}</h5>
                    <p className="text-[11px] font-medium text-[#444444] leading-tight">{step.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Manual Task Visibility Override */}
          <div className="p-5 bg-white border-2 border-[#0D0D0D] rounded-2xl shadow-[3px_3px_0_#0D0D0D] space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h4 className="font-black text-xs uppercase text-[#0D0D0D] flex items-center gap-1.5">
                  {tasksVisible ? <Unlock className="w-4 h-4 text-emerald-700" /> : <Lock className="w-4 h-4 text-amber-700" />}
                  Domain Task Briefing & Submission Link Access Override
                </h4>
                <p className="text-[11px] font-semibold text-gray-600 mt-0.5">
                  Toggle whether applicants can see the &quot;View Task Briefing&quot; and &quot;Submit Task&quot; buttons, or enforce emergency hide for all users.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  disabled={savingSettings}
                  onClick={() => handleUpdateRecruitmentSettings(currentPhase, !tasksVisible)}
                  className={`px-4 py-2 rounded-xl border-2 border-[#0D0D0D] text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-[2px_2px_0_#0D0D0D] ${
                    tasksVisible
                      ? "bg-rose-100 text-rose-900 hover:bg-rose-200"
                      : "bg-emerald-100 text-emerald-900 hover:bg-emerald-200"
                  }`}
                >
                  {tasksVisible ? (
                    <>
                      <EyeOff className="w-4 h-4" /> Hide Tasks For All Users
                    </>
                  ) : (
                    <>
                      <Eye className="w-4 h-4" /> Unlock Tasks For All Users
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="text-[11px] font-bold text-gray-500 bg-[#FFEFB4] p-3 rounded-xl border border-[#0D0D0D]/20">
              💡 <strong>Expected Behavior:</strong> In Phase 1, tasks are locked so candidates focus on completing registrations. On 17 September (Phase 2), domain task links are unlocked. On 24 September (Phase 3), task submission links automatically close.
            </div>
          </div>

          {/* Broadcast Tasks Live Announcement Email Card */}
          <div className="p-5 bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-2xl shadow-[3px_3px_0_#0D0D0D] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="p-3 bg-[#0D0D0D] text-[#FFEFB4] rounded-2xl border border-[#0D0D0D] shadow-[2px_2px_0_#F2A516] shrink-0">
                <Mail className="w-6 h-6 text-[#F2A516]" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="font-black text-sm uppercase text-[#0D0D0D]">
                    Broadcast &quot;Tasks Are Live&quot; Announcement Email
                  </h4>
                  <span className="px-2 py-0.5 bg-[#F2A516] text-[#0D0D0D] text-[10px] font-black uppercase rounded">
                    Resend
                  </span>
                </div>
                <p className="text-xs font-semibold text-gray-700 mt-1">
                  Notify all registered applicants that domain task problem statements and submission links are officially live.
                </p>
              </div>
            </div>

          </div>
        </div>
      ) : activeTab === "EMAIL_CENTER" ? (
        <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 sm:p-8 shadow-[8px_8px_0_#0D0D0D] space-y-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b-2 border-[#0D0D0D]/10 pb-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="font-black text-xl uppercase text-[#0D0D0D] flex items-center gap-2">
                  <Mail className="w-6 h-6 text-[#F2A516]" /> Recruitment Email Communications Center
                </h3>
                <span className="px-3 py-1 bg-[#F2A516] text-[#0D0D0D] text-xs font-black uppercase rounded-lg border border-[#0D0D0D] shadow-[1px_1px_0_#0D0D0D]">
                  Resend API
                </span>
              </div>
              <p className="text-xs font-semibold text-[#444444] mt-1">
                Dispatch automated and customized neo-brutalist emails to applicants, shortlisted interviewees, and newly accepted members.
              </p>
            </div>

            <div className="flex items-center gap-2 bg-white px-3.5 py-2 rounded-xl border-2 border-[#0D0D0D] shadow-[2px_2px_0_#0D0D0D] self-start sm:self-auto">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-black text-[#0D0D0D]">
                Sender: <span className="text-[#333333] font-bold">support@codekraftersrmp.in</span>
              </span>
            </div>
          </div>

          {/* Quick Action Email Dispatch Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Card 1: Broadcast Tasks Live */}
            <div className="bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-2xl p-5 shadow-[4px_4px_0_#0D0D0D] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase bg-[#0D0D0D] text-[#FFEFB4] px-2.5 py-1 rounded-md">
                    Phase 2 Announcement
                  </span>
                  <Sparkles className="w-4 h-4 text-[#F2A516]" />
                </div>
                <h4 className="font-black text-base uppercase text-[#0D0D0D] mb-1">
                  Broadcast Tasks Live Notice
                </h4>
                <p className="text-xs font-medium text-[#444444] mb-4">
                  Notify all registered applicants that domain task problem statements and submission links are officially live on the portal.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEmailModalMode("TASKS_LIVE_BROADCAST");
                  setEmailTargetApp(null);
                  setEmailModalOpen(true);
                }}
                className="w-full py-2.5 px-3 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0_#F2A516] flex items-center justify-center gap-1.5 cursor-pointer hover:translate-y-[-1px] transition-all"
              >
                <Send className="w-3.5 h-3.5 text-[#F2A516]" /> Compose Task Announcement ➔
              </button>
            </div>

            {/* Card 2: Shortlist & Interview Batch */}
            <div className="bg-purple-100 border-2 border-[#0D0D0D] rounded-2xl p-5 shadow-[4px_4px_0_#0D0D0D] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase bg-purple-900 text-purple-100 px-2.5 py-1 rounded-md">
                    {stats.shortlisted} Shortlisted
                  </span>
                  <Calendar className="w-4 h-4 text-purple-900" />
                </div>
                <h4 className="font-black text-base uppercase text-[#0D0D0D] mb-1">
                  Email Shortlisted Candidates
                </h4>
                <p className="text-xs font-medium text-[#444444] mb-4">
                  Send interview invitations with Google Meet link, date, time slot, and round guidelines to all shortlisted applicants.
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEmailModalMode("SHORTLIST_BATCH");
                  setEmailTargetApp(null);
                  setEmailModalOpen(true);
                }}
                className="w-full py-2.5 px-3 bg-purple-900 text-white hover:bg-purple-950 rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0_#0D0D0D] flex items-center justify-center gap-1.5 cursor-pointer hover:translate-y-[-1px] transition-all"
              >
                <Mail className="w-3.5 h-3.5 text-purple-300" /> Send Shortlist Invites ({stats.shortlisted}) ➔
              </button>
            </div>

            {/* Card 3: Custom Announcement / Offer */}
            <div className="bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-2xl p-5 shadow-[4px_4px_0_#0D0D0D] flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-black uppercase bg-[#F2A516] text-[#0D0D0D] px-2.5 py-1 rounded-md border border-[#0D0D0D]">
                    {stats.accepted} Accepted Members
                  </span>
                  <CheckCircle className="w-4 h-4 text-[#0D0D0D]" />
                </div>
                <h4 className="font-black text-base uppercase text-[#0D0D0D] mb-1">
                  Official Selection Offers
                </h4>
                <p className="text-xs font-medium text-[#444444] mb-4">
                  Send official membership acceptance letters with onboarding links strictly to accepted candidates ({stats.accepted} accepted).
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEmailModalMode("SELECTION_OFFER");
                  setEmailTargetApp(null);
                  setEmailModalOpen(true);
                }}
                className="w-full py-2.5 px-3 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] rounded-xl font-black text-xs uppercase tracking-wider shadow-[2px_2px_0_#F2A516] flex items-center justify-center gap-1.5 cursor-pointer hover:translate-y-[-1px] transition-all"
              >
                <Send className="w-3.5 h-3.5 text-[#F2A516]" /> Send Acceptance Offers ({stats.accepted}) ➔
              </button>
            </div>
          </div>

          {/* Email Templates Gallery & Live Preview Launcher */}
          <div className="p-5 bg-white border-2 border-[#0D0D0D] rounded-2xl shadow-[4px_4px_0_#0D0D0D] space-y-4">
            <div className="flex items-center justify-between border-b border-[#0D0D0D]/10 pb-3">
              <h4 className="font-black text-sm uppercase text-[#0D0D0D] flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#F2A516]" /> Configured Email Templates (Neo-Brutalist Theme)
              </h4>
              <span className="text-xs font-bold text-gray-500">
                Templates styled with CodeKrafters gold & dark aesthetic
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="p-3.5 bg-[#FFF2C6] rounded-xl border border-[#0D0D0D] flex flex-col justify-between">
                <div>
                  <h5 className="font-black text-xs uppercase text-[#0D0D0D] mb-1">1. Shortlist & Interview</h5>
                  <p className="text-[11px] text-gray-600 mb-3">Interview slot, calendar time, Google Meet link & instructions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmailModalMode("SHORTLIST_BATCH");
                    setEmailTargetApp(null);
                    setEmailModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] text-[11px] font-black rounded-lg uppercase cursor-pointer"
                >
                  Preview Template
                </button>
              </div>

              <div className="p-3.5 bg-[#FFF2C6] rounded-xl border border-[#0D0D0D] flex flex-col justify-between">
                <div>
                  <h5 className="font-black text-xs uppercase text-[#0D0D0D] mb-1">2. Domain Tasks Live</h5>
                  <p className="text-[11px] text-gray-600 mb-3">Announcement that domain problem statements and portals are open.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmailModalMode("TASKS_LIVE_BROADCAST");
                    setEmailTargetApp(null);
                    setEmailModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] text-[11px] font-black rounded-lg uppercase cursor-pointer"
                >
                  Preview Template
                </button>
              </div>

              <div className="p-3.5 bg-[#FFF2C6] rounded-xl border border-[#0D0D0D] flex flex-col justify-between">
                <div>
                  <h5 className="font-black text-xs uppercase text-[#0D0D0D] mb-1">3. Selection Offer Letter</h5>
                  <p className="text-[11px] text-gray-600 mb-3">Formal club acceptance congratulations, welcome pack, onboarding link.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmailModalMode("SELECTION_OFFER");
                    setEmailTargetApp(null);
                    setEmailModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] text-[11px] font-black rounded-lg uppercase cursor-pointer"
                >
                  Preview Template
                </button>
              </div>

              <div className="p-3.5 bg-[#FFF2C6] rounded-xl border border-[#0D0D0D] flex flex-col justify-between">
                <div>
                  <h5 className="font-black text-xs uppercase text-[#0D0D0D] mb-1">4. Custom Broadcast</h5>
                  <p className="text-[11px] text-gray-600 mb-3">General domain communications, deadlines, and direct updates.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEmailModalMode("CUSTOM_UPDATE");
                    setEmailTargetApp(null);
                    setEmailModalOpen(true);
                  }}
                  className="px-2.5 py-1.5 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] text-[11px] font-black rounded-lg uppercase cursor-pointer"
                >
                  Preview Template
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : loading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0D0D0D]"></div>
        </div>
      ) : (
        <>
          {/* KPI Stats Analytics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-3.5">
        <div className="bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-2xl p-3.5 shadow-[3px_3px_0_#0D0D0D]">
          <div className="text-[11px] font-extrabold text-[#333333] uppercase">Total</div>
          <div className="text-2xl font-extrabold text-[#0D0D0D] mt-0.5">{stats.total}</div>
        </div>

        <div className="bg-slate-100 border-2 border-[#0D0D0D] rounded-2xl p-3.5 shadow-[3px_3px_0_#0D0D0D]">
          <div className="text-[11px] font-extrabold text-slate-800 uppercase">Applied</div>
          <div className="text-2xl font-extrabold text-slate-900 mt-0.5">{stats.applied}</div>
        </div>

        <div className="bg-amber-100 border-2 border-[#0D0D0D] rounded-2xl p-3.5 shadow-[3px_3px_0_#0D0D0D]">
          <div className="text-[11px] font-extrabold text-amber-900 uppercase">Task Ongoing</div>
          <div className="text-2xl font-extrabold text-amber-950 mt-0.5">{stats.taskOngoing}</div>
        </div>

        <div className="bg-teal-100 border-2 border-[#0D0D0D] rounded-2xl p-3.5 shadow-[3px_3px_0_#0D0D0D]">
          <div className="text-[11px] font-extrabold text-teal-900 uppercase">Task Done</div>
          <div className="text-2xl font-extrabold text-teal-950 mt-0.5">{stats.taskCompleted}</div>
        </div>

        <div className="bg-[#FFF2C6] border-2 border-[#0D0D0D] rounded-2xl p-3.5 shadow-[3px_3px_0_#0D0D0D]">
          <div className="text-[11px] font-extrabold text-[#0D0D0D] uppercase">Under Review</div>
          <div className="text-2xl font-extrabold text-[#0D0D0D] mt-0.5">{stats.underReview}</div>
        </div>

        <div className="bg-purple-100 border-2 border-[#0D0D0D] rounded-2xl p-3.5 shadow-[3px_3px_0_#0D0D0D]">
          <div className="text-[11px] font-extrabold text-purple-900 uppercase">Shortlisted</div>
          <div className="text-2xl font-extrabold text-purple-950 mt-0.5">{stats.shortlisted}</div>
        </div>

        <div className="bg-[#F2A516] border-2 border-[#0D0D0D] rounded-2xl p-3.5 shadow-[3px_3px_0_#0D0D0D] col-span-2 sm:col-span-1">
          <div className="text-[11px] font-extrabold text-[#0D0D0D] uppercase">Accepted</div>
          <div className="text-2xl font-extrabold text-[#0D0D0D] mt-0.5">{stats.accepted}</div>
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
              className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-3 py-2 text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0_#0D0D0D] cursor-pointer"
              style={{ colorScheme: "light", color: "#000000" }}
            >
              <option value="ALL" className="text-black bg-white">All Domains</option>
              {DOMAINS_LIST.map((d) => (
                <option key={d.id} value={d.name} className="text-black bg-white">
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
              className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-3 py-2 text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0_#0D0D0D] cursor-pointer"
              style={{ colorScheme: "light", color: "#000000" }}
            >
              <option value="ALL" className="text-black bg-white">All Years</option>
              {YEARS.map((y) => (
                <option key={y} value={y} className="text-black bg-white">
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
              className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-3 py-2 text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0_#0D0D0D] cursor-pointer"
              style={{ colorScheme: "light", color: "#000000" }}
            >
              <option value="ALL" className="text-black bg-white">All Departments</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept} className="text-black bg-white">
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
              className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl px-3 py-2 text-xs font-bold text-black focus:outline-none shadow-[2px_2px_0_#0D0D0D] cursor-pointer"
              style={{ colorScheme: "light", color: "#000000" }}
            >
              <option value="ALL" className="text-black bg-white">All Statuses</option>
              <option value="Applied" className="text-black bg-white">Applied</option>
              <option value="Task Ongoing" className="text-black bg-white">Task Ongoing</option>
              <option value="Task Completed" className="text-black bg-white">Task Completed</option>
              <option value="Under Review" className="text-black bg-white">Under Review</option>
              <option value="Shortlisted" className="text-black bg-white">Shortlisted</option>
              <option value="Interview Scheduled" className="text-black bg-white">Interview Scheduled</option>
              <option value="Accepted" className="text-black bg-white">Accepted</option>
              <option value="Rejected" className="text-black bg-white">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table / Cards */}
      <div className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-6 shadow-[8px_8px_0_#0D0D0D]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="font-extrabold text-base uppercase text-[#0D0D0D]">
              Applicant Submissions ({filteredApplications.length})
            </h3>
            <span className="text-xs font-bold text-[#333333]">
              Click any candidate row to open inspector & score
            </span>
          </div>

          {/* Batch Email to Shortlisted Action (Always Visible) */}
          <button
            type="button"
            onClick={() => {
              setEmailModalMode("SHORTLIST_BATCH");
              setEmailTargetApp(null);
              setEmailModalOpen(true);
            }}
            className="px-4 py-2 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] border-2 border-[#0D0D0D] rounded-xl font-black text-xs uppercase shadow-[2px_2px_0_#F2A516] flex items-center gap-1.5 cursor-pointer hover:translate-y-[-1px] transition-all self-start sm:self-auto"
          >
            <Mail className="w-3.5 h-3.5 text-[#F2A516]" /> Email Shortlisted Candidates ({stats.shortlisted}) ➔
          </button>
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
                        className={`px-2.5 py-1 rounded-full font-bold text-[11px] border border-[#0D0D0D] whitespace-nowrap ${
                          app.status === "Accepted"
                            ? "bg-[#F2A516] text-[#0D0D0D]"
                            : app.status === "Shortlisted"
                              ? "bg-purple-200 text-purple-900"
                              : app.status === "Interview Scheduled"
                                ? "bg-emerald-200 text-emerald-900"
                                : app.status === "Under Review"
                                  ? "bg-amber-200 text-amber-900"
                                  : app.status === "Task Completed"
                                    ? "bg-teal-200 text-teal-950"
                                    : app.status === "Task Ongoing"
                                      ? "bg-amber-100 text-amber-950"
                                      : app.status === "Applied"
                                        ? "bg-slate-200 text-slate-800"
                                        : app.status === "Rejected"
                                          ? "bg-rose-200 text-rose-900"
                                          : "bg-blue-200 text-blue-900"
                        }`}
                      >
                        {app.status}
                      </span>
                    </td>

                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setEmailModalMode(
                              app.status === "Accepted"
                                ? "SELECTION_OFFER"
                                : "SHORTLIST_INDIVIDUAL"
                            );
                            setEmailTargetApp(app);
                            setEmailModalOpen(true);
                          }}
                          className="px-2.5 py-1.5 bg-[#F2A516] text-[#0D0D0D] hover:bg-[#F2A516]/90 rounded-xl border border-[#0D0D0D] font-black text-[11px] shadow-[2px_2px_0_#0D0D0D] flex items-center gap-1 cursor-pointer whitespace-nowrap hover:translate-y-[-1px] transition-all"
                          title="Send Email / Interview Invite"
                        >
                          <Mail className="w-3.5 h-3.5" /> Email
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            openInspector(app);
                          }}
                          className="p-1.5 px-3 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] rounded-xl border border-[#0D0D0D] font-bold text-[11px] shadow-[2px_2px_0_#F2A516] cursor-pointer hover:translate-y-[-1px] transition-all"
                        >
                          Inspect
                        </button>
                      </div>
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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 lg:p-8 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-[#f9f7e5] border-3 border-[#0D0D0D] rounded-3xl p-5 sm:p-8 max-w-5xl w-full max-h-[92vh] flex flex-col shadow-[12px_12px_0_#0D0D0D] relative overflow-hidden"
            >
              {/* Sticky Top Header Bar */}
              <div className="border-b-2 border-[#0D0D0D] pb-4 mb-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Left: Name & Contact Badges */}
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-2xl sm:text-3xl font-black uppercase text-[#0D0D0D] tracking-tight">
                        {selectedApp.fullName}
                      </h2>
                      <span
                        className={`px-3 py-1 rounded-full font-black text-xs border border-[#0D0D0D] whitespace-nowrap ${
                          selectedApp.status === "Accepted"
                            ? "bg-[#F2A516] text-[#0D0D0D]"
                            : selectedApp.status === "Shortlisted"
                            ? "bg-purple-200 text-purple-900"
                            : selectedApp.status === "Interview Scheduled"
                            ? "bg-emerald-200 text-emerald-900"
                            : selectedApp.status === "Under Review"
                            ? "bg-amber-200 text-amber-900"
                            : selectedApp.status === "Task Completed"
                            ? "bg-teal-200 text-teal-950"
                            : selectedApp.status === "Task Ongoing"
                            ? "bg-amber-100 text-amber-950"
                            : selectedApp.status === "Applied"
                            ? "bg-slate-200 text-slate-800"
                            : selectedApp.status === "Rejected"
                            ? "bg-rose-200 text-rose-900"
                            : "bg-blue-200 text-blue-900"
                        }`}
                      >
                        {selectedApp.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <div className="flex items-center gap-1.5 bg-white px-2.5 py-1 rounded-lg border border-[#0D0D0D]">
                        <span className="text-xs font-bold text-[#333333]">📧 {selectedApp.email}</span>
                        <button
                          type="button"
                          onClick={() => {
                            setEmailModalMode(
                              selectedApp.status === "Accepted"
                                ? "SELECTION_OFFER"
                                : "SHORTLIST_INDIVIDUAL"
                            );
                            setEmailTargetApp(selectedApp);
                            setEmailModalOpen(true);
                          }}
                          className="ml-1 px-2 py-0.5 bg-[#F2A516] text-[#0D0D0D] hover:bg-[#0D0D0D] hover:text-[#FFEFB4] rounded text-[10px] font-black border border-[#0D0D0D] transition-colors cursor-pointer"
                          title="Direct Email Candidate"
                        >
                          ✉️ Email
                        </button>
                      </div>
                      <span className="text-xs font-bold text-[#333333] bg-white px-2.5 py-1 rounded-lg border border-[#0D0D0D]">
                        📞 {selectedApp.phone}
                      </span>
                      <span className="text-xs font-black bg-[#0D0D0D] text-[#FFEFB4] px-2.5 py-1 rounded-lg">
                        {selectedApp.year} • {selectedApp.primaryDomain}
                      </span>
                    </div>
                  </div>

                  {/* Right: Quick Action Buttons (Always Visible at Top!) */}
                  <div className="flex items-center gap-2.5 self-start md:self-center">
                    {/* Send Email Button */}
                    <button
                      type="button"
                      onClick={() => {
                        setEmailModalMode(
                          selectedApp.status === "Accepted"
                            ? "SELECTION_OFFER"
                            : "SHORTLIST_INDIVIDUAL"
                        );
                        setEmailTargetApp(selectedApp);
                        setEmailModalOpen(true);
                      }}
                      className="px-4 py-2.5 bg-[#F2A516] text-[#0D0D0D] hover:bg-[#F2A516]/90 border-2 border-[#0D0D0D] rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0_#0D0D0D] flex items-center gap-1.5 cursor-pointer hover:translate-y-[-1px] transition-all"
                    >
                      <Mail className="w-4 h-4" />
                      {selectedApp.status === "Accepted"
                        ? "Send Offer Letter"
                        : "Send Shortlist / Interview Invite"}
                    </button>

                    {/* Save Changes Button */}
                    <button
                      type="button"
                      onClick={handleSaveInspector}
                      disabled={savingStatus}
                      className="px-4 py-2.5 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] border-2 border-[#0D0D0D] rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0_#F2A516] flex items-center gap-1.5 cursor-pointer hover:translate-y-[-1px] transition-all"
                    >
                      <Save className="w-4 h-4" />
                      {savingStatus ? "Saving..." : "Save Status"}
                    </button>

                    {/* Close Modal Button */}
                    <button
                      type="button"
                      onClick={() => setSelectedApp(null)}
                      className="p-2 rounded-xl bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] border border-[#0D0D0D] cursor-pointer shadow-[2px_2px_0_#F2A516]"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Sub-Tabs Navigation Bar with Styled Horizontal Scroll */}
                <div className="flex overflow-x-auto whitespace-nowrap gap-2 mt-4 pt-2 border-t border-[#0D0D0D]/10 pb-1.5 custom-scrollbar">
                  <button
                    type="button"
                    onClick={() => setInspectorTab("PROFILE")}
                    className={`px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      inspectorTab === "PROFILE"
                        ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[2px_2px_0_#F2A516]"
                        : "bg-white text-[#0D0D0D] hover:bg-[#FFF2C6] border border-[#0D0D0D]/30"
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5" /> 1. Profile & Portfolios
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectorTab("ANSWERS")}
                    className={`px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      inspectorTab === "ANSWERS"
                        ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[2px_2px_0_#F2A516]"
                        : "bg-white text-[#0D0D0D] hover:bg-[#FFF2C6] border border-[#0D0D0D]/30"
                    }`}
                  >
                    <Edit3 className="w-3.5 h-3.5" /> 2. Written Answers (Why Join & Projects)
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectorTab("TASK")}
                    className={`px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      inspectorTab === "TASK"
                        ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[2px_2px_0_#F2A516]"
                        : "bg-white text-[#0D0D0D] hover:bg-[#FFF2C6] border border-[#0D0D0D]/30"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" /> 3. Domain Task Solution
                    {selectedApp.taskSubmissionUrl && (
                      <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block ml-0.5"></span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => setInspectorTab("EVALUATION")}
                    className={`px-4 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-1.5 transition-all cursor-pointer shrink-0 ${
                      inspectorTab === "EVALUATION"
                        ? "bg-[#0D0D0D] text-[#FFEFB4] shadow-[2px_2px_0_#F2A516]"
                        : "bg-white text-[#0D0D0D] hover:bg-[#FFF2C6] border border-[#0D0D0D]/30"
                    }`}
                  >
                    <Star className="w-3.5 h-3.5 text-[#F2A516]" /> 4. Evaluation & Notes
                  </button>
                </div>
              </div>

              {/* Scrollable Tab Content Container */}
              <div className="overflow-y-auto max-h-[60vh] pr-2 space-y-6 custom-scrollbar">
                {/* TAB 1: Profile & Portfolios */}
                {inspectorTab === "PROFILE" && (
                  <div className="space-y-6">
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

                    {/* Portfolios & Links */}
                    <div className="p-5 bg-white border-2 border-[#0D0D0D] rounded-2xl shadow-[3px_3px_0_#0D0D0D]">
                      <h4 className="text-xs font-black uppercase text-[#0D0D0D] mb-3 flex items-center gap-2">
                        <ExternalLink className="w-4 h-4 text-[#F2A516]" /> Portfolios & External Links
                      </h4>
                      {!(safeUrl(selectedApp.githubUrl) || safeUrl(selectedApp.linkedinUrl) || safeUrl(selectedApp.portfolioUrl) || safeUrl(selectedApp.resumeUrl)) ? (
                        <p className="text-xs text-gray-500 font-bold italic bg-gray-50 p-4 rounded-xl border border-dashed border-gray-300">
                          No external links or portfolios provided.
                        </p>
                      ) : (
                        <div className="flex flex-wrap gap-3">
                          {safeUrl(selectedApp.githubUrl) && (
                            <a
                              href={safeUrl(selectedApp.githubUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-white text-[#0D0D0D] hover:bg-[#F2A516] rounded-xl border-2 border-[#0D0D0D] font-bold text-xs shadow-[2px_2px_0_#0D0D0D] transition-colors"
                            >
                              <Github className="w-4 h-4" /> GitHub
                            </a>
                          )}

                          {safeUrl(selectedApp.linkedinUrl) && (
                            <a
                              href={safeUrl(selectedApp.linkedinUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-white text-[#0D0D0D] hover:bg-[#F2A516] rounded-xl border-2 border-[#0D0D0D] font-bold text-xs shadow-[2px_2px_0_#0D0D0D] transition-colors"
                            >
                              <Linkedin className="w-4 h-4" /> LinkedIn
                            </a>
                          )}

                          {safeUrl(selectedApp.portfolioUrl) && (
                            <a
                              href={safeUrl(selectedApp.portfolioUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] rounded-xl border-2 border-[#0D0D0D] font-bold text-xs shadow-[2px_2px_0_#F2A516] transition-colors"
                            >
                              Portfolio / Web <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {safeUrl(selectedApp.resumeUrl) && (
                            <a
                              href={safeUrl(selectedApp.resumeUrl)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-4 py-2 bg-white text-[#0D0D0D] hover:bg-[#F2A516] rounded-xl border-2 border-[#0D0D0D] font-bold text-xs shadow-[2px_2px_0_#0D0D0D] transition-colors"
                            >
                              <FileText className="w-4 h-4" /> Resume Document
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* TAB 2: Written Answers (Why Join & Projects) with Clean Scroll */}
                {inspectorTab === "ANSWERS" && (
                  <div className="space-y-6">
                    {/* Why Join */}
                    <div className="bg-white border-2 border-[#0D0D0D] p-5 sm:p-6 rounded-2xl shadow-[4px_4px_0_#0D0D0D]">
                      <h4 className="text-xs font-black uppercase text-[#0D0D0D] mb-3 flex items-center gap-2 border-b border-[#0D0D0D]/10 pb-2">
                        <Sparkles className="w-4 h-4 text-[#F2A516]" /> Why Join CodeKrafters?
                      </h4>
                      <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        <p className="text-sm font-medium text-[#111] leading-relaxed whitespace-pre-wrap">
                          {selectedApp.whyJoin}
                        </p>
                      </div>
                    </div>

                    {/* Past Experience */}
                    <div className="bg-white border-2 border-[#0D0D0D] p-5 sm:p-6 rounded-2xl shadow-[4px_4px_0_#0D0D0D]">
                      <h4 className="text-xs font-black uppercase text-[#0D0D0D] mb-3 flex items-center gap-2 border-b border-[#0D0D0D]/10 pb-2">
                        <Edit3 className="w-4 h-4 text-[#F2A516]" /> Past Projects & Experience
                      </h4>
                      <div className="max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                        {selectedApp.pastExperience ? (
                          <p className="text-sm font-medium text-[#111] leading-relaxed whitespace-pre-wrap">
                            {selectedApp.pastExperience}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-400 italic">No past experience description provided.</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 3: Domain Task Solution */}
                {inspectorTab === "TASK" && (
                  <div className="space-y-6">
                    {selectedApp.taskSubmissionUrl ? (
                      <div className="bg-teal-50 border-2 border-teal-800 p-6 rounded-2xl shadow-[4px_4px_0_#0D0D0D] space-y-4">
                        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-teal-800/20 pb-3">
                          <h4 className="text-sm font-black uppercase text-teal-950 flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-teal-700" /> Domain Challenge Repository / Solution
                          </h4>
                          {selectedApp.taskSubmittedAt && (
                            <span className="text-xs font-bold text-teal-900 bg-white px-3 py-1 rounded-lg border border-teal-800">
                              Submitted: {new Date(selectedApp.taskSubmittedAt).toLocaleString()}
                            </span>
                          )}
                        </div>

                        <div>
                          <span className="text-[11px] font-black uppercase text-teal-900 block mb-1">
                            Live Project / GitHub URL:
                          </span>
                          <a
                            href={selectedApp.taskSubmissionUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm font-black text-blue-700 hover:underline break-all inline-flex items-center gap-1.5 bg-white p-3 rounded-xl border border-teal-800 w-full"
                          >
                            {selectedApp.taskSubmissionUrl}
                            <ExternalLink className="w-4 h-4 shrink-0" />
                          </a>
                        </div>
                      </div>
                    ) : (
                      <div className="bg-[#FFF2C6] border-2 border-dashed border-[#0D0D0D]/40 p-8 rounded-2xl text-center">
                        <CheckCircle2 className="w-10 h-10 text-[#0D0D0D]/40 mx-auto mb-2" />
                        <h4 className="font-extrabold text-[#0D0D0D] uppercase text-sm">No Task Solution Submitted Yet</h4>
                        <p className="text-xs text-gray-600 mt-1">Candidate has not submitted a repository link for this recruitment challenge.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 4: Evaluation & Scoring */}
                {inspectorTab === "EVALUATION" && (
                  <div className="bg-[#FFF2C6] border-3 border-[#0D0D0D] p-6 rounded-2xl space-y-6 shadow-[4px_4px_0_#0D0D0D]">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-extrabold uppercase mb-2 text-[#0D0D0D]">
                          Update Application Status
                        </label>
                        <select
                          value={editingStatus}
                          onChange={(e) => setEditingStatus(e.target.value as ApplicationStatus)}
                          className="w-full bg-[#FFEFB4] border-2 border-[#0D0D0D] rounded-xl p-3 text-sm font-black text-black cursor-pointer"
                          style={{ colorScheme: "light", color: "#000000" }}
                        >
                          <option value="Applied" className="text-black bg-white">Applied</option>
                          <option value="Task Ongoing" className="text-black bg-white">Task Ongoing</option>
                          <option value="Task Completed" className="text-black bg-white">Task Completed</option>
                          <option value="Under Review" className="text-black bg-white">Under Review</option>
                          <option value="Shortlisted" className="text-black bg-white">Shortlisted</option>
                          <option value="Interview Scheduled" className="text-black bg-white">Interview Scheduled</option>
                          <option value="Accepted" className="text-black bg-white">Accepted</option>
                          <option value="Rejected" className="text-black bg-white">Rejected</option>
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
                                className={`w-8 h-8 ${
                                  star <= editingRating
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

                    <div className="flex flex-col sm:flex-row gap-3 pt-2 border-t border-[#0D0D0D]/10">
                      <button
                        type="button"
                        onClick={handleSaveInspector}
                        disabled={savingStatus}
                        className="flex-1 bg-[#0D0D0D] text-[#FFEFB4] hover:text-[#F2A516] py-3.5 rounded-xl font-black text-xs sm:text-sm uppercase tracking-wider shadow-[3px_3px_0_#F2A516] hover:translate-y-[-1px] transition-all cursor-pointer text-center"
                      >
                        {savingStatus ? "Saving Changes..." : "Save Evaluation Changes"}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setEmailModalMode(
                            editingStatus === "Accepted"
                              ? "SELECTION_OFFER"
                              : "SHORTLIST_INDIVIDUAL"
                          );
                          setEmailTargetApp(selectedApp);
                          setEmailModalOpen(true);
                        }}
                        className="px-5 py-3.5 bg-[#F2A516] text-[#0D0D0D] hover:bg-[#F2A516]/90 border-2 border-[#0D0D0D] rounded-xl font-black text-xs uppercase tracking-wider shadow-[3px_3px_0_#0D0D0D] flex items-center justify-center gap-2 cursor-pointer hover:translate-y-[-1px] transition-all whitespace-nowrap"
                      >
                        <Mail className="w-4 h-4" />
                        {editingStatus === "Accepted"
                          ? "Send Offer Email"
                          : "Send Shortlist / Interview Email"}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
        </>
      )}

      {/* Send Email Modal Drawer */}
      <SendEmailModal
        isOpen={emailModalOpen}
        onClose={() => {
          setEmailModalOpen(false);
          setEmailTargetApp(null);
        }}
        mode={emailModalMode}
        candidate={emailTargetApp}
        targetDomain={
          session.role === "DOMAIN_ADMIN" && session.domain_id
            ? session.domain_id
            : filters.domain !== "ALL"
            ? filters.domain
            : "ALL"
        }
        batchCount={
          emailModalMode === "SHORTLIST_BATCH"
            ? stats.shortlisted
            : emailModalMode === "SELECTION_OFFER"
            ? stats.accepted
            : stats.total
        }
        onSuccess={(msg) => showToast(msg)}
      />
    </div>
  );
}
