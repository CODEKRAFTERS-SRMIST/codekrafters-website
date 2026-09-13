import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";
import { sendTasksLiveEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const ip = getIpFromRequest(request);
    const rateLimit = await checkRateLimit(ip, "authenticated");
    if (!rateLimit.success) {
      return NextResponse.json(
        { error: "Too many email requests. Please try again in a few moments." },
        { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter || 60) } }
      );
    }

    const session = await getSession();
    if (
      !session ||
      (session.role !== "PRESIDENT" &&
        session.role !== "VICE_PRESIDENT" &&
        session.role !== "DOMAIN_ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await request.json().catch(() => ({}));
    const { domain, customMessage, deadline } = body;

    const targetDomain =
      session.role === "DOMAIN_ADMIN" ? session.domain_id : domain;

    // Fetch all active applicants
    const { data: candidates, error } = await supabaseAdmin
      .from("applications")
      .select("id, full_name, email, primary_domain, domains, status");

    if (error) throw error;

    // Filter by domain if specified or if user is Domain Admin
    const filtered = (candidates || []).filter((c) => {
      // Exclude rejected candidates if any
      if (c.status === "Rejected") return false;

      if (!targetDomain || targetDomain === "ALL") return true;
      const norm = targetDomain.toLowerCase().replace(/[^a-z0-9]/g, "");
      const matchesDomain = (d: string) =>
        d && d.toLowerCase().replace(/[^a-z0-9]/g, "") === norm;
      return (
        (c.domains && c.domains.some(matchesDomain)) ||
        matchesDomain(c.primary_domain)
      );
    });

    if (filtered.length === 0) {
      return NextResponse.json({
        success: true,
        sentCount: 0,
        message: "No applicants found for the tasks-live announcement.",
      });
    }

    const results = [];
    for (const candidate of filtered) {
      const res = await sendTasksLiveEmail(candidate.email, {
        candidateName: candidate.full_name,
        domains: candidate.domains || [candidate.primary_domain],
        deadline: deadline || "24 September (11:59 PM)",
        customMessage,
      });

      results.push({
        email: candidate.email,
        success: res.success,
        error: res.error,
      });
    }

    const successCount = results.filter((r) => r.success).length;

    return NextResponse.json({
      success: true,
      sentCount: successCount,
      totalTargeted: filtered.length,
      results,
    });
  } catch (error: any) {
    console.error("Tasks live broadcast email error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to broadcast tasks-live announcement" },
      { status: 500 }
    );
  }
}
