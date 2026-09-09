import { Application, ApplicantFormData, ApplicationStatus } from "@/types/join";

const STORAGE_KEY = "codekrafters_join_applications_v1";

export function safeUrl(url?: string): string {
  if (!url || typeof url !== "string") return "";
  const trimmed = url.trim();
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  if (trimmed.startsWith("www.")) {
    return `https://${trimmed}`;
  }
  return "";
}

export async function fetchApplications(userId?: string, email?: string): Promise<Application[]> {
  let url = "/api/applications";
  if (userId || email) {
    const params = new URLSearchParams();
    if (userId) params.append("userId", userId);
    if (email) params.append("email", email);
    url += `?${params.toString()}`;
  }

  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to fetch applications");
  return data.applications || [];
}

export async function submitApplication(userId: string, formData: ApplicantFormData): Promise<Application> {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ userId, ...formData }),
  });

  const data = await res.json();
  if (!res.ok) {
    const detailsStr = data.details ? (typeof data.details === 'object' ? JSON.stringify(data.details) : data.details) : "";
    throw new Error(detailsStr ? `${data.error}: ${detailsStr}` : (data.error || "Failed to submit application"));
  }
  return data.application;
}

export async function updateApplicationStatus(
  appId: string,
  status: ApplicationStatus,
  adminNotes?: string,
  rating?: number
): Promise<Application> {
  const res = await fetch("/api/applications", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      id: appId,
      status,
      adminNotes,
      rating,
    }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update application");
  return data.application;
}

export function exportApplicationsToCSV(applications: Application[]): void {
  if (applications.length === 0) return;

  const headers = [
    "Application ID",
    "Full Name",
    "Email",
    "Phone",
    "Department",
    "Year",
    "Primary Domain",
    "All Domains",
    "Status",
    "Rating",
    "GitHub URL",
    "LinkedIn URL",
    "Portfolio URL",
    "Resume URL",
    "Submitted At",
    "Admin Notes",
  ];

  const csvRows = [
    headers.join(","),
    ...applications.map((app) =>
      [
        `"${app.id}"`,
        `"${app.fullName.replace(/"/g, '""')}"`,
        `"${app.email}"`,
        `"${app.phone}"`,
        `"${app.department}"`,
        `"${app.year}"`,
        `"${app.primaryDomain}"`,
        `"${app.domains.join("; ")}"`,
        `"${app.status}"`,
        `"${app.rating || "N/A"}"`,
        `"${app.githubUrl || ""}"`,
        `"${app.linkedinUrl || ""}"`,
        `"${app.portfolioUrl || ""}"`,
        `"${app.resumeUrl || ""}"`,
        `"${new Date(app.submittedAt).toLocaleString()}"`,
        `"${(app.adminNotes || "").replace(/"/g, '""')}"`,
      ].join(",")
    ),
  ];

  const csvString = csvRows.join("\n");
  const blob = new Blob([csvString], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", `codekrafters_applications_${new Date().toISOString().split("T")[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
