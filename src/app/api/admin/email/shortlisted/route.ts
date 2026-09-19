import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";
import { sendShortlistEmail, sendBatchEmails } from "@/lib/email";
import { generateShortlistEmailHtml } from "@/lib/email-templates";

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
      (session.role !== "PRESIDENT" &&
        session.role !== "VICE_PRESIDENT" &&
        session.role !== "DOMAIN_ADMIN")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const adminLimit = await checkRateLimit(session.id, "email_service");
    if (!adminLimit.success) {
      return NextResponse.json(
        { error: "Email broadcast limit reached. Please wait before sending more emails.", retryAfter: adminLimit.retryAfter },
        { status: 429, headers: { "Retry-After": String(adminLimit.retryAfter || 60) } }
      );
    }

    const body = await request.json().catch(() => ({}));
    const {
      applicationId,
      domain,
      subject,
      customMessage,
      interviewDate,
      interviewTime,
      meetingLink,
      venue,
      batch,
      batchOffset = 0,
      batchLimit,
      excludeEmails = [],
    } = body;

    // Batch sending mode for all shortlisted applicants in a domain
    if (batch) {
      const targetDomain =
        session.role === "DOMAIN_ADMIN" ? session.domain_id : domain;

      const query = supabaseAdmin
        .from("applications")
        .select("id, full_name, email, primary_domain, domains, status, submitted_at")
        .eq("status", "Shortlisted")
        .order("submitted_at", { ascending: true });

      const { data: candidates, error } = await query;
      if (error) throw error;

      const excludeSet = new Set(
        (Array.isArray(excludeEmails) ? excludeEmails : []).map((e: string) =>
          e.trim().toLowerCase()
        )
      );

      // Filter by domain and exclusions
      const filtered = (candidates || []).filter((c) => {
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
          message: "No shortlisted candidates found for the selected domain.",
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
          message: "No shortlisted candidates remaining in this offset range.",
        });
      }

      const batchItems = batchSlice.map((candidate) => {
        const domainName =
          targetDomain && targetDomain !== "ALL"
            ? targetDomain
            : candidate.primary_domain || "CodeKrafters";

        const { subject: genSubject, html } = generateShortlistEmailHtml({
          candidateName: candidate.full_name,
          domainName,
          subject,
          customMessage,
          interviewDate,
          interviewTime,
          meetingLink,
          venue,
        });

        return {
          to: candidate.email,
          subject: genSubject,
          html,
        };
      });

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
    }

    // Single candidate sending mode
    if (!applicationId) {
      return NextResponse.json(
        { error: "Application ID is required for individual emails." },
        { status: 400 }
      );
    }

    const { data: appData, error: appError } = await supabaseAdmin
      .from("applications")
      .select("*")
      .eq("id", applicationId)
      .single();

    if (appError || !appData) {
      return NextResponse.json(
        { error: "Candidate application not found." },
        { status: 404 }
      );
    }

    // Domain Admin authorization check: candidate must belong to admin's domain
    if (session.role === "DOMAIN_ADMIN" && session.domain_id) {
      const adminNorm = session.domain_id.toLowerCase().replace(/[^a-z0-9]/g, "");
      const matchesDomain = (d: string) =>
        d && d.toLowerCase().replace(/[^a-z0-9]/g, "") === adminNorm;
      const belongs =
        (appData.domains && appData.domains.some(matchesDomain)) ||
        matchesDomain(appData.primary_domain);

      if (!belongs) {
        return NextResponse.json(
          {
            error:
              "Forbidden: You do not have permission to email candidates outside your domain.",
          },
          { status: 403 }
        );
      }
    }

    const domainName =
      domain || appData.primary_domain || "CodeKrafters Recruitment";

    const emailResult = await sendShortlistEmail(appData.email, {
      candidateName: appData.full_name,
      domainName,
      subject,
      customMessage,
      interviewDate,
      interviewTime,
      meetingLink,
      venue,
    });

    if (!emailResult.success) {
      return NextResponse.json(
        { error: emailResult.error || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: emailResult.messageId,
      simulated: emailResult.simulated,
      recipient: appData.email,
    });
  } catch (error: any) {
    console.error("Shortlist email error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process shortlist email request" },
      { status: 500 }
    );
  }
}
