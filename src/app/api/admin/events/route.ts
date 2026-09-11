import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/session";
export async function GET(request: Request) {
  try {
    const session = await getSession();
    
    let query = supabaseAdmin
      .from("event_postings")
      .select("*")
      .order("created_at", { ascending: false });

    // If not authenticated or just an applicant, only show APPROVED.
    if (!session || session.role === "APPLICANT") {
      query = query.eq("status", "APPROVED");
    } else if (session.role === "DOMAIN_ADMIN") {
      // Domain admin sees their pending and all approved
      query = query.or(`status.eq.APPROVED,created_by_id.eq.${session.id}`);
    }
    // President sees all (no filter needed)

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching events:", error);
      return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }

    return NextResponse.json({ events: data });
  } catch (error) {
    console.error("GET Events Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role === "APPLICANT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { category, title, description, image_url } = body;

    if (!category || !title || !image_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    let status = 'PENDING';
    
    if (session.role === "PRESIDENT" || session.role === "VICE_PRESIDENT") {
      status = 'APPROVED';
    } else if (session.role === "DOMAIN_ADMIN") {
      // Only content, creatives, pr can create
      const domainNorm = (session.domain_id || "").toLowerCase().replace(/[^a-z0-9]/g, "");
      const allowedDomains = ["content", "creatives", "prmanagement"];
      if (!allowedDomains.includes(domainNorm)) {
         return NextResponse.json({ error: "Your domain cannot create events" }, { status: 403 });
      }
      status = 'PENDING';
    }

    const { data, error } = await supabaseAdmin
      .from("event_postings")
      .insert([
        { category, title, description, image_url, status, created_by_id: session.id, approved_by_id: (session.role === "PRESIDENT" || session.role === "VICE_PRESIDENT") ? session.id : null }
      ])
      .select()
      .single();

    if (error) {
      console.error("Error inserting event:", error);
      return NextResponse.json({ error: "Failed to add event" }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data });
  } catch (error) {
    console.error("POST Event Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role === "APPLICANT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { id, category, title, description, image_url } = body;

    if (!id || !category || !title || !image_url) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("event_postings")
      .update({ category, title, description, image_url })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Error updating event:", error);
      return NextResponse.json({ error: "Failed to update event" }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data });
  } catch (error) {
    console.error("PUT Event Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "PRESIDENT" && session.role !== "VICE_PRESIDENT")) {
      return NextResponse.json({ error: "Only President or Vice President can approve events" }, { status: 403 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("event_postings")
      .update({ status, approved_by_id: status === "APPROVED" ? session.id : null })
      .eq("id", id)
      .select().single();

    if (error) {
      console.error("Error approving event:", error);
      return NextResponse.json({ error: "Failed to approve event" }, { status: 500 });
    }

    return NextResponse.json({ success: true, event: data });
  } catch (error) {
    console.error("PATCH Event Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getSession();
    if (!session || session.role === "APPLICANT") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing event ID" }, { status: 400 });
    }

    const { error } = await supabaseAdmin
      .from("event_postings")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting event:", error);
      return NextResponse.json({ error: "Failed to delete event" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE Event Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
