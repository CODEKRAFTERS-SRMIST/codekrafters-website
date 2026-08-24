import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Application } from "@/types/join";

// Helper to convert snake_case DB row to camelCase frontend type
function mapAppFromDB(row: any): Application {
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
    submittedAt: row.submitted_at,
    updatedAt: row.updated_at,
  };
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const email = searchParams.get("email");

  try {
    let query = supabase.from("applications").select("*").order("submitted_at", { ascending: false });

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

    return NextResponse.json({ success: true, applications: (data || []).map(mapAppFromDB) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if exists
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .or(`user_id.eq.${body.userId},email.ilike.${body.email}`)
      .single();

    if (existing) {
      // Update instead
      const { data, error } = await supabase
        .from("applications")
        .update({
          full_name: body.fullName,
          phone: body.phone,
          department: body.department,
          year: body.year,
          primary_domain: body.primaryDomain,
          domains: body.domains,
          github_url: body.githubUrl,
          linkedin_url: body.linkedinUrl,
          portfolio_url: body.portfolioUrl,
          resume_url: body.resumeUrl,
          why_join: body.whyJoin,
          past_experience: body.pastExperience,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();
      if (error) throw error;
      return NextResponse.json({ success: true, application: mapAppFromDB(data) });
    }

    const { data, error } = await supabase
      .from("applications")
      .insert({
        user_id: body.userId,
        full_name: body.fullName,
        email: body.email,
        phone: body.phone,
        department: body.department,
        year: body.year,
        primary_domain: body.primaryDomain,
        domains: body.domains,
        github_url: body.githubUrl,
        linkedin_url: body.linkedinUrl,
        portfolio_url: body.portfolioUrl,
        resume_url: body.resumeUrl,
        why_join: body.whyJoin,
        past_experience: body.pastExperience,
        status: "Under Review",
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, application: mapAppFromDB(data) }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to submit application" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, adminNotes, rating } = body;

    const updates: any = { updated_at: new Date().toISOString() };
    if (status !== undefined) updates.status = status;
    if (adminNotes !== undefined) updates.admin_notes = adminNotes;
    if (rating !== undefined) updates.rating = rating;

    const { data, error } = await supabase
      .from("applications")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json({ success: true, application: mapAppFromDB(data) });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update application" }, { status: 500 });
  }
}
