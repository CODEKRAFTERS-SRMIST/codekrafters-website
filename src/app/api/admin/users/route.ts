import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";
import { userRolePatchSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const ip = getIpFromRequest(request);
    const ipLimit = await checkRateLimit(ip, "authenticated");
    if (!ipLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter || 60) } }
      );
    }

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
    const ip = getIpFromRequest(request);
    const ipLimit = await checkRateLimit(ip, "authenticated");
    if (!ipLimit.success) {
      return NextResponse.json(
        { error: "Too many requests. Please slow down." },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter || 60) } }
      );
    }

    const session = await getSession();
    if (!session || (session.role !== "PRESIDENT" && session.role !== "VICE_PRESIDENT")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = userRolePatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation Error", details: parsed.error.format() }, { status: 400 });
    }

    const { targetUserId, role, domain_id } = parsed.data;

    // Only current PRESIDENT can assign the PRESIDENT role
    if (role === "PRESIDENT" && session.role !== "PRESIDENT") {
      return NextResponse.json({ error: "Forbidden: Only the President can promote another user to President" }, { status: 403 });
    }

    const cleanDomainId = role === "DOMAIN_ADMIN" ? (domain_id ? domain_id.trim() : null) : null;

    const { data, error } = await supabaseAdmin
      .from("users")
      .update({ role, domain_id: cleanDomainId })
      .eq("id", targetUserId)
      .select()
      .single();

    if (error) {
      console.error("Error updating user role:", error);
      return NextResponse.json({ error: error.message || "Failed to update user" }, { status: 500 });
    }

    // Invalidate target user's active session to force re-authentication with new privileges
    const { invalidateUserSessions } = await import("@/lib/session");
    await invalidateUserSessions(targetUserId);

    return NextResponse.json({ success: true, user: data });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
