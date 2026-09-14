import { z } from "zod";

export const loginSchema = z
  .object({
    email: z.string().email("Invalid email format"),
    password: z.string().min(1, "Password cannot be empty").optional(),
    role: z.enum(["APPLICANT", "ADMIN"]),
  })
  .strict();

export const signupSchema = z
  .object({
    email: z.string().email("Invalid email format").max(255),
    password: z.string().min(6, "Password must be at least 6 characters").max(128),
    fullName: z.string().min(1, "Full name is required").max(100).optional(),
    agreedToTerms: z.boolean().optional(),
  })
  .strict();

export const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "Old password is required"),
    newPassword: z.string().min(6, "New password must be at least 6 characters").max(128),
  })
  .strict();

export const applicationPostSchema = z
  .object({
    userId: z.string().min(1, "User ID is required").optional(),
    fullName: z.string().min(1, "Full name is required").max(100),
    email: z.string().email("Invalid email format").max(255).optional(),
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
    // Invisible bot honeypot - bots fill this, real users do not
    website_hp: z.string().max(0, "Bot detected").optional().or(z.literal("")),
  })
  .strict();

export const applicationPatchSchema = z
  .object({
    id: z.string().uuid("Invalid application ID"),
    status: z
      .enum([
        "Applied",
        "Task Ongoing",
        "Task Completed",
        "Under Review",
        "Shortlisted",
        "Interview Scheduled",
        "Accepted",
        "Rejected",
      ])
      .optional(),
    adminNotes: z.string().max(5000).optional(),
    rating: z.number().min(0).max(10).optional(),
    taskSubmissionUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  })
  .strict();

export const eventPostSchema = z
  .object({
    category: z.string().min(1, "Category is required").max(100),
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().max(5000).optional().or(z.literal("")),
    image_url: z.string().url("Must be a valid image URL").max(1000),
  })
  .strict();

export const eventPutSchema = z
  .object({
    id: z.string().uuid("Invalid event ID"),
    category: z.string().min(1, "Category is required").max(100),
    title: z.string().min(1, "Title is required").max(255),
    description: z.string().max(5000).optional().or(z.literal("")),
    image_url: z.string().url("Must be a valid image URL").max(1000),
  })
  .strict();

export const eventPatchSchema = z
  .object({
    id: z.string().uuid("Invalid event ID"),
    status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
  })
  .strict();

export const recruitmentSettingsPatchSchema = z
  .object({
    current_phase: z.number().int().min(1).max(4).optional(),
    tasks_visible: z.boolean().optional(),
  })
  .strict();

export const userRolePatchSchema = z
  .object({
    targetUserId: z.string().uuid("Invalid target user ID"),
    role: z.enum(["APPLICANT", "DOMAIN_ADMIN", "VICE_PRESIDENT", "PRESIDENT"]),
    domain_id: z.string().max(100).nullable().optional(),
  })
  .strict();
