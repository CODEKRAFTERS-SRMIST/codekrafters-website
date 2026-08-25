import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(1, "Password cannot be empty").optional(),
  role: z.enum(["APPLICANT", "ADMIN"]),
}).strict();

export const applicationPostSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  fullName: z.string().min(1, "Full name is required").max(100),
  email: z.string().email("Invalid email format").max(255),
  phone: z.string().min(10, "Phone number is too short").max(20),
  department: z.string().min(1, "Department is required").max(100),
  year: z.string().min(1, "Year is required").max(20),
  domains: z.array(z.string()).min(1, "At least one domain is required"),
  primaryDomain: z.string().min(1, "Primary domain is required"),
  // URLs can be empty strings if not provided
  githubUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedinUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  portfolioUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  resumeUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  whyJoin: z.string().min(1, "This field is required").max(2000),
  pastExperience: z.string().max(2000).optional().or(z.literal("")),
}).strict();

export const applicationPatchSchema = z.object({
  id: z.string().uuid("Invalid application ID"),
  status: z.enum(["Under Review", "Shortlisted", "Interview Scheduled", "Accepted", "Rejected"]).optional(),
  adminNotes: z.string().max(5000).optional(),
  rating: z.number().min(0).max(10).optional(),
}).strict();
