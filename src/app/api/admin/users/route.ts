import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/session";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "PRESIDENT" && session.role !== "VICE_PRESIDENT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .select("id, email, full_name, role, domain_id, created_at")
      .order("created_at", { ascending: false });

    if (error) return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });

    const formattedUsers = (data || []).map((u: any) => ({
      id: u.id,
      email: u.email,
      fullName: u.full_name || u.fullName || u.email.split("@")[0],
      role: u.role,
      domain_id: u.domain_id,
      created_at: u.created_at,
    }));

    return NextResponse.json({ users: formattedUsers });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "PRESIDENT" && session.role !== "VICE_PRESIDENT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const { targetUserId, role, domain_id } = body;

    if (!targetUserId || !role) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ role, domain_id: role === "DOMAIN_ADMIN" ? domain_id : null })
      .eq("id", targetUserId)
      .select().single();

    if (error) return NextResponse.json({ error: "Failed to update user" }, { status: 500 });

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
