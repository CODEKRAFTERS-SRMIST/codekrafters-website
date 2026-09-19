import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";
import { sendBatchEmails, BatchEmailItem } from "@/lib/email";
import { generateTasksLiveEmailHtml } from "@/lib/email-templates";

export async function POST(request: Request) {
  try {
    const ip = getIpFromRequest(request);
    const ipLimit = await checkRateLimit(ip, "email_service");
    if (!ipLimit.success) {
      return NextResponse.json(
        { error: "Too many email requests. Please wait before sending again.", retryAfter: ipLimit.retryAfter },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter || 60) } }
      );
    }

    const session = await getSession();
    if (
      !session ||
      (session.role !== "PRESIDENT" && session.role !== "VICE_PRESIDENT")
    ) {
      return NextResponse.json(
        { error: "Forbidden: Tasks Live email broadcast can only be sent by the President or Vice President." },
        { status: 403 }
      );
    }

    const adminLimit = await checkRateLimit(session.id, "email_service");
    if (!adminLimit.success) {
      return NextResponse.json(
        { error: "Email broadcast limit reached. Please wait before broadcasting.", retryAfter: adminLimit.retryAfter },
        { status: 429, headers: { "Retry-After": String(adminLimit.retryAfter || 60) } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      domain,
      customMessage,
      deadline,
      batchOffset = 0,
      batchLimit,
      excludeEmails = [],
    } = body;

    const targetDomain = domain;

    // Fetch all applicants with deterministic ordering (submitted_at ascending)
    const { data: candidates, error } = await supabaseAdmin
      .from("applications")
      .select("id, full_name, email, primary_domain, domains, status, submitted_at")
      .order("submitted_at", { ascending: true });

    if (error) throw error;

    const excludeSet = new Set(
      (Array.isArray(excludeEmails) ? excludeEmails : []).map((e: string) =>
        e.trim().toLowerCase()
      )
    );

    // Filter by domain and exclude rejected or specifically excluded candidates
    const filtered = (candidates || []).filter((c) => {
      if (c.status === "Rejected") return false;
      if (excludeSet.has((c.email || "").toLowerCase())) return false;

      if (!targetDomain || targetDomain === "ALL") return true;
      const norm = targetDomain.toLowerCase().replace(/[^a-z0-9]/g, "");
      const matchesDomain = (d: string) =>
        d && d.toLowerCase().replace(/[^a-z0-9]/g, "") === norm;
      return (
        (c.domains && c.domains.some(matchesDomain)) ||
        matchesDomain(c.primary_domain)
      );
    });

    const totalPool = filtered.length;

    if (totalPool === 0) {
      return NextResponse.json({
        success: true,
        sentCount: 0,
        totalPool: 0,
        totalTargeted: 0,
        message: "No eligible applicants found for this broadcast.",
      });
    }

    // Apply offset and batch slice
    const startIndex = Math.max(0, parseInt(String(batchOffset), 10) || 0);
    const sliceLimit =
      batchLimit !== undefined && batchLimit !== null && Number(batchLimit) > 0
        ? parseInt(String(batchLimit), 10)
        : totalPool;

    const batchSlice = filtered.slice(startIndex, startIndex + sliceLimit);

    if (batchSlice.length === 0) {
      return NextResponse.json({
        success: true,
        sentCount: 0,
        totalPool,
        totalTargeted: 0,
        message: "No candidates remaining in this offset range.",
      });
    }

    // Prepare batch items
    const batchItems: BatchEmailItem[] = batchSlice.map((candidate) => {
      const { subject, html } = generateTasksLiveEmailHtml({
        candidateName: candidate.full_name,
        domains: candidate.domains || [candidate.primary_domain],
        deadline: deadline || "24 September (11:59 PM)",
        customMessage,
      });

      return {
        to: candidate.email,
        subject,
        html,
      };
    });

    // Execute batch send via Resend Batch API
    const batchResult = await sendBatchEmails(batchItems, 50);

    const nextOffset = startIndex + batchSlice.length;
    const hasMore = nextOffset < totalPool;

    return NextResponse.json({
      success: batchResult.success,
      sentCount: batchResult.totalSent,
      failedCount: batchResult.totalFailed,
      totalTargeted: batchSlice.length,
      totalPool,
      batchOffset: startIndex,
      batchLimit: sliceLimit,
      nextOffset,
      hasMore,
      simulated: batchResult.simulated,
      sentRecipients: batchSlice.map((c) => ({
        name: c.full_name,
        email: c.email,
      })),
      errors: batchResult.errors,
    });
  } catch (error: any) {
    console.error("Tasks live broadcast email error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to broadcast tasks-live announcement" },
      { status: 500 }
    );
  }
}

