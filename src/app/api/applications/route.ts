import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Application } from "@/types/join";
import { checkRateLimit, getIpFromRequest } from "@/lib/rate-limit";
import { applicationPostSchema, applicationPatchSchema } from "@/lib/validations";
import { getLiveRecruitmentSettings } from "@/lib/recruitment-settings";
import { getSession } from "@/lib/session";
import { encryptField, decryptField } from "@/lib/encryption";

// Helper to convert snake_case DB row to camelCase frontend type with transparent decryption
function mapAppFromDB(row: any): Application {
  let taskSubUrl = row.task_submission_url;
  if (!taskSubUrl && row.admin_notes && row.admin_notes.includes("[Task Submission:")) {
    const match = row.admin_notes.match(/\[Task Submission:\s*([^\]]+)\]/);
    if (match) taskSubUrl = match[1].trim();
  }

  return {
    id: row.id,
    userId: row.user_id,
    fullName: row.full_name,
    email: row.email,
    phone: decryptField(row.phone),
    department: row.department,
    year: row.year,
    domains: row.domains,
    primaryDomain: row.primary_domain,
    githubUrl: row.github_url,
    linkedinUrl: row.linkedin_url,
    portfolioUrl: row.portfolio_url,
    resumeUrl: row.resume_url,
    whyJoin: row.why_join,
    pastExperience: row.past_experience,
    status: row.status,
    adminNotes: decryptField(row.admin_notes),
    rating: row.rating,
    taskSubmissionUrl: taskSubUrl,
    taskSubmittedAt: row.task_submitted_at,
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: Request) {
  const ip = getIpFromRequest(request);
  const limit = await checkRateLimit(ip, 'authenticated');
  if (!limit.success) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter || 60) } });
  }

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const requestedUserId = searchParams.get("userId");
  const requestedEmail = searchParams.get("email");

  try {
    const settings = await getLiveRecruitmentSettings();
    let query = supabaseAdmin.from("applications").select("*").order("submitted_at", { ascending: false });

    if (session.role === "PRESIDENT" || session.role === "VICE_PRESIDENT") {
      // Global admins can query any user/email or all
      if (requestedUserId || requestedEmail) {
        if (requestedUserId && requestedEmail) {
          query = query.or(`user_id.eq.${requestedUserId},email.ilike.${requestedEmail}`);
        } else if (requestedUserId) {
          query = query.eq("user_id", requestedUserId);
        } else {
          query = query.ilike("email", requestedEmail!);
        }
      }
    } else if (session.role === "DOMAIN_ADMIN" && session.domain_id) {
      // Domain admin: can query their own application or candidates for their assigned domain
      if (requestedUserId && requestedUserId === session.id) {
        query = query.eq("user_id", session.id);
      }
      // Domain filtering will be enforced on the results to ensure strict domain isolation
    } else {
      // Regular applicants can strictly ONLY view their own application
      query = query.eq("user_id", session.id);
    }

    const { data, error } = await query;
    if (error) throw error;

    let rows = data || [];

    // Enforce domain isolation for DOMAIN_ADMIN
    if (session.role === "DOMAIN_ADMIN" && session.domain_id) {
      const adminNorm = session.domain_id.toLowerCase().replace(/[^a-z0-9]/g, "");
      const matchesDomain = (d: string) => d && d.toLowerCase().replace(/[^a-z0-9]/g, "") === adminNorm;

      rows = rows.filter((r: any) => {
        // Allow seeing own application or applicants within their domain
        if (r.user_id === session.id) return true;
        return (r.domains && r.domains.some(matchesDomain)) || matchesDomain(r.primary_domain);
      });
    }

    const mappedApplications = rows.map((row: any) => {
      const app = mapAppFromDB(row);

      // Dynamic automatic status progression:
      if (app.status === "Applied" && (settings.current_phase >= 2 || settings.tasks_visible)) {
        app.status = "Task Ongoing";
      } else if (app.status === "Task Ongoing" && settings.current_phase >= 3) {
        app.status = "Task Completed";
      }

      return app;
    });

    return NextResponse.json({ success: true, applications: mappedApplications });
  } catch (err: any) {
    console.error("GET Applications Error:", err);
    return NextResponse.json({ error: "An unexpected error occurred while fetching applications." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const ip = getIpFromRequest(request);
  const ipLimit = await checkRateLimit(ip, 'auth_strict');
  if (!ipLimit.success) {
    return NextResponse.json({ error: "Too Many Requests. Please wait before submitting again." }, { status: 429, headers: { 'Retry-After': String(ipLimit.retryAfter || 60) } });
  }

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userLimit = await checkRateLimit(session.id, 'auth_strict');
    if (!userLimit.success) {
      return NextResponse.json({ error: "Submission rate limit reached for your account." }, { status: 429, headers: { 'Retry-After': String(userLimit.retryAfter || 60) } });
    }

    // Verify authenticated user from database
    const { data: authUser, error: userError } = await supabaseAdmin
      .from("users")
      .select("id, email")
      .eq("id", session.id)
      .single();

    if (userError || !authUser) {
      return NextResponse.json({ error: "Unauthorized: User account not found" }, { status: 401 });
    }

    const body = await request.json();

    const parsed = applicationPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation Error", details: parsed.error.format() }, { status: 400 });
    }

    const validatedData = parsed.data;

    // Server enforces the verified user ID and verified account email
    validatedData.userId = authUser.id;
    validatedData.email = authUser.email;

    // Check if application exists for this user
    const { data: existing } = await supabaseAdmin
      .from("applications")
      .select("id")
      .or(`user_id.eq.${validatedData.userId},email.ilike.${validatedData.email}`)
      .maybeSingle();

    if (existing) {
      // Update existing application
      const { data, error } = await supabaseAdmin
        .from("applications")
        .update({
          full_name: validatedData.fullName,
          phone: encryptField(validatedData.phone),
          department: validatedData.department,
          year: validatedData.year,
          primary_domain: validatedData.primaryDomain,
          domains: validatedData.domains,
          github_url: validatedData.githubUrl,
          linkedin_url: validatedData.linkedinUrl,
          portfolio_url: validatedData.portfolioUrl,
          resume_url: validatedData.resumeUrl,
          why_join: validatedData.whyJoin,
          past_experience: validatedData.pastExperience,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, application: mapAppFromDB(data) });
    }

    const { data, error } = await supabaseAdmin
      .from("applications")
      .insert({
        user_id: validatedData.userId,
        full_name: validatedData.fullName,
        email: validatedData.email,
        phone: encryptField(validatedData.phone),
        department: validatedData.department,
        year: validatedData.year,
        primary_domain: validatedData.primaryDomain,
        domains: validatedData.domains,
        github_url: validatedData.githubUrl,
        linkedin_url: validatedData.linkedinUrl,
        portfolio_url: validatedData.portfolioUrl,
        resume_url: validatedData.resumeUrl,
        why_join: validatedData.whyJoin,
        past_experience: validatedData.pastExperience,
        status: "Applied",
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, application: mapAppFromDB(data) }, { status: 201 });
  } catch (err: any) {
    console.error("POST Application Error:", err);
    return NextResponse.json({ error: "An unexpected error occurred while submitting the application." }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const ip = getIpFromRequest(request);
  const limit = await checkRateLimit(ip, 'authenticated');
  if (!limit.success) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter || 60) } });
  }

  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    const parsed = applicationPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation Error", details: parsed.error.format() }, { status: 400 });
    }

    const { id, status, adminNotes, rating, taskSubmissionUrl } = parsed.data;

    // Fetch target application to verify ownership, domain authorization, and current status
    const { data: targetApp, error: fetchErr } = await supabaseAdmin
      .from("applications")
      .select("user_id, primary_domain, domains, status")
      .eq("id", id)
      .single();

    if (fetchErr || !targetApp) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const isGlobalAdmin = session.role === "PRESIDENT" || session.role === "VICE_PRESIDENT";
    const isDomainAdmin = session.role === "DOMAIN_ADMIN";
    const isApplicantSelf = targetApp.user_id === session.id;

    // Allow applicant to transition their own application to "Task Completed"
    // only if currently in "Applied" or "Task Ongoing" (cannot overwrite Rejected, Shortlisted, Accepted)
    const isAllowedSelfTransition = targetApp.status === "Applied" || targetApp.status === "Task Ongoing";
    const isSelfTaskCompletion =
      isApplicantSelf &&
      status === "Task Completed" &&
      adminNotes === undefined &&
      rating === undefined &&
      isAllowedSelfTransition;

    // Non-admins cannot update administrative evaluation fields
    if (!isGlobalAdmin && !isDomainAdmin && !isSelfTaskCompletion) {
      if (status !== undefined || adminNotes !== undefined || rating !== undefined) {
        return NextResponse.json({ error: "Forbidden: Admin only fields" }, { status: 403 });
      }
    }

    // If applicant is self-reporting task completion, verify tasks are actively unlocked
    if (isSelfTaskCompletion) {
      const settings = await getLiveRecruitmentSettings();
      if (!settings.tasks_visible) {
        return NextResponse.json({ error: "Task submissions are currently locked or closed." }, { status: 403 });
      }
    }

    // Domain Admins can only evaluate candidates within their assigned domain
    if (isDomainAdmin) {
      const adminNorm = (session.domain_id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const matchesDomain = (d: string) => d && d.toLowerCase().replace(/[^a-z0-9]/g, "") === adminNorm;
      const belongs = (targetApp.domains && targetApp.domains.some(matchesDomain)) || matchesDomain(targetApp.primary_domain);

      if (!belongs && targetApp.user_id !== session.id) {
        return NextResponse.json({ error: "Forbidden: Candidate is outside your assigned domain" }, { status: 403 });
      }
    }

    // Regular applicants must own the application they are updating
    if (!isGlobalAdmin && !isDomainAdmin && targetApp.user_id !== session.id) {
      return NextResponse.json({ error: "Forbidden: Not your application" }, { status: 403 });
    }

    const updates: any = { updated_at: new Date().toISOString() };
    if (status !== undefined) updates.status = status;
    if (status === "Task Completed") {
      updates.task_submitted_at = new Date().toISOString();
    }
    if (adminNotes !== undefined) updates.admin_notes = encryptField(adminNotes);
    if (rating !== undefined) updates.rating = rating;
    if (taskSubmissionUrl !== undefined && taskSubmissionUrl !== null && taskSubmissionUrl !== "") {
      updates.task_submission_url = taskSubmissionUrl;
      updates.task_submitted_at = new Date().toISOString();
      if (!status) {
        updates.status = "Task Completed";
      }
    }

    try {
      const { data, error } = await supabaseAdmin
        .from("applications")
        .update(updates)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ success: true, application: mapAppFromDB(data) });
    } catch (primaryErr: any) {
      // If error was due to missing task_submission_url or task_submitted_at column in Supabase, retry
      if (updates.task_submission_url !== undefined || updates.task_submitted_at !== undefined) {
        delete updates.task_submission_url;
        delete updates.task_submitted_at;
        const currentNotes = adminNotes || "";
        if (taskSubmissionUrl) {
          updates.admin_notes = encryptField(`${currentNotes}\n[Task Submission: ${taskSubmissionUrl}]`.trim());
        }

        const { data: retryData, error: retryError } = await supabaseAdmin
          .from("applications")
          .update(updates)
          .eq("id", id)
          .select()
          .single();

        if (retryError) throw retryError;
        return NextResponse.json({ success: true, application: mapAppFromDB(retryData) });
      }
      throw primaryErr;
    }
  } catch (err: any) {
    console.error("PATCH Application Error:", err);
    return NextResponse.json({ error: "An unexpected error occurred while updating the application." }, { status: 500 });
  }
}
