import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { Application } from "@/types/join";
import { checkRateLimit, getIpFromRequest } from "@/lib/rate-limit";
import { applicationPostSchema, applicationPatchSchema } from "@/lib/validations";
import { getLiveRecruitmentSettings } from "@/lib/recruitment-settings";

// Helper to convert snake_case DB row to camelCase frontend type
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
    phone: row.phone,
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
    adminNotes: row.admin_notes,
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

  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  try {
    const settings = await getLiveRecruitmentSettings();
    let query = supabaseAdmin.from("applications").select("*").order("submitted_at", { ascending: false });

    if (userId || email) {
      if (userId && email) {
        query = query.or(`user_id.eq.${userId},email.ilike.${email}`);
      } else if (userId) {
        query = query.eq("user_id", userId);
      } else {
        query = query.ilike("email", email!);
      }
    }

    const { data, error } = await query;
    if (error) throw error;

    const mappedApplications = (data || []).map((row: any) => {
      let app = mapAppFromDB(row);

      // Dynamic automatic status progression:
      // 1. If timeline in Phase 2 & tasks active, 'Applied' auto-becomes 'Task Ongoing'
      if (app.status === "Applied" && (settings.current_phase >= 2 || settings.tasks_visible)) {
        app.status = "Task Ongoing";
      }
      // 2. If deadline passed (Phase 3+) and was 'Task Ongoing', auto-becomes 'Task Completed'
      else if (app.status === "Task Ongoing" && settings.current_phase >= 3) {
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
  const limit = await checkRateLimit(ip, 'public');
  if (!limit.success) {
    return NextResponse.json({ error: "Too Many Requests" }, { status: 429, headers: { 'Retry-After': String(limit.retryAfter || 60) } });
  }

  try {
    const body = await request.json();
    
    const parsed = applicationPostSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation Error", details: parsed.error.format() }, { status: 400 });
    }
    
    const validatedData = parsed.data;
    
    // Check if exists
    const { data: existing } = await supabaseAdmin
      .from("applications")
      .select("id")
      .or(`user_id.eq.${validatedData.userId},email.ilike.${validatedData.email}`)
      .maybeSingle();

    if (existing) {
      // Update instead
      const { data, error } = await supabaseAdmin
        .from("applications")
        .update({
          full_name: validatedData.fullName,
          phone: validatedData.phone,
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
        phone: validatedData.phone,
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
    const body = await request.json();
    
    const parsed = applicationPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation Error", details: parsed.error.format() }, { status: 400 });
    }
    
    const { id, status, adminNotes, rating, taskSubmissionUrl } = parsed.data;

    const updates: any = { updated_at: new Date().toISOString() };
    if (status !== undefined) updates.status = status;
    if (adminNotes !== undefined) updates.admin_notes = adminNotes;
    if (rating !== undefined) updates.rating = rating;
    if (taskSubmissionUrl !== undefined) {
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
      // If error was due to missing task_submission_url column in Supabase, retry storing in admin_notes
      if (taskSubmissionUrl !== undefined) {
        delete updates.task_submission_url;
        delete updates.task_submitted_at;
        const currentNotes = adminNotes || "";
        updates.admin_notes = `${currentNotes}\n[Task Submission: ${taskSubmissionUrl}]`.trim();

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
