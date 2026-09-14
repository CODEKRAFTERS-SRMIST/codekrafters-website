export type UserRole = "PRESIDENT" | "VICE_PRESIDENT" | "DOMAIN_ADMIN" | "APPLICANT";

export type ApplicationStatus =
  | "Applied"
  | "Task Ongoing"
  | "Task Completed"
  | "Under Review"
  | "Shortlisted"
  | "Interview Scheduled"
  | "Accepted"
  | "Rejected";

export interface RecruitmentDomain {
  id: string;
  name: string;
  category: "Technical" | "Non-Technical" | "Creative";
  description: string;
  iconName: string;
}

export interface Application {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  domains: string[];
  primaryDomain: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  whyJoin: string;
  pastExperience: string;
  status: ApplicationStatus;
  adminNotes?: string;
  rating?: number;
  taskSubmissionUrl?: string;
  taskSubmittedAt?: string;
  submittedAt: string;
  updatedAt?: string;
}

export interface ApplicantFormData {
  fullName: string;
  email: string;
  phone: string;
  department: string;
  year: string;
  domains: string[];
  primaryDomain: string;
  githubUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  resumeUrl: string;
  whyJoin: string;
  pastExperience: string;
  website_hp?: string;
}

export interface FilterOptions {
  domain: string;
  year: string;
  department: string;
  status: string;
  search: string;
}

export interface UserSession {
  email: string;
  role: UserRole;
  domain_id?: string;
  fullName?: string;
  id: string;
}

export const DOMAINS_LIST: RecruitmentDomain[] = [
  {
    id: "web3",
    name: "Web3",
    category: "Technical",
    description: "Blockchain, Smart Contracts, DeFi, and decentralized applications.",
    iconName: "Code",
  },
  {
    id: "web-dev",
    name: "WebDevelopment",
    category: "Technical",
    description: "Frontend (React/Next.js), Backend (Node/Go), APIs, and more.",
    iconName: "Code",
  },
  {
    id: "cyber-security",
    name: "Cybersecurity",
    category: "Technical",
    description: "DevOps, Pentesting, CTFs, and Cloud Infrastructure.",
    iconName: "Shield",
  },
  {
    id: "cp",
    name: "Competitive Programming",
    category: "Technical",
    description: "Data Structures, Algorithms, and problem-solving.",
    iconName: "Cpu",
  },
  {
    id: "pr-management",
    name: "PR & Management",
    category: "Non-Technical",
    description: "Social media management, outreach, and community engagement.",
    iconName: "Megaphone",
  },
  {
    id: "creatives",
    name: "Creatives",
    category: "Creative",
    description: "UI/UX, Figma design systems, wireframing, and graphic design.",
    iconName: "Palette",
  },
  {
    id: "content",
    name: "Content",
    category: "Non-Technical",
    description: "Writing blogs, event descriptions, and technical documentation.",
    iconName: "FileText",
  },
];

export const DEPARTMENTS = [
  "Artificial Intelligence (AI)",
  "Biotechnology",
  "Civil Engineering",
  "Computer Science and Business System",
  "Computer Science and Engineering (CSE)",
  "CSE with Artificial Intelligence and Machine Learning (AIML)",
  "CSE with Big Data Analytics (BDA)",
  "CSE with Cloud Computing (CC)",
  "CSE with Cyber Security (CS)",
  "CSE with Gaming Technology (GT)",
  "CSE with Internet of Things (IOT)",
  "Electrical and Electronics Engineering (EEE)",
  "Electronics and Communication Engineering (ECE)",
  "Electronics and Communication Engineering with specialization in Data Science",
  "Information Technology (IT)",
  "Mechanical Engineering",
];

export const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year"];
