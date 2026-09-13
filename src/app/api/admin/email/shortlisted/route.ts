import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";
import { sendShortlistEmail } from "@/lib/email";

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
    } = body;

    // Batch sending mode for all shortlisted applicants in a domain
    if (batch) {
      const targetDomain =
        session.role === "DOMAIN_ADMIN" ? session.domain_id : domain;

      const query = supabaseAdmin
        .from("applications")
        .select("id, full_name, email, primary_domain, domains, status")
        .eq("status", "Shortlisted");

      const { data: candidates, error } = await query;
      if (error) throw error;

      // Filter by domain
      const filtered = (candidates || []).filter((c) => {
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
          message: "No shortlisted candidates found for the selected domain.",
        });
      }

      const results = [];
      for (const candidate of filtered) {
        const domainName =
          targetDomain && targetDomain !== "ALL"
            ? targetDomain
            : candidate.primary_domain || "CodeKrafters";

        const res = await sendShortlistEmail(candidate.email, {
          candidateName: candidate.full_name,
          domainName,
          subject,
          customMessage,
          interviewDate,
          interviewTime,
          meetingLink,
          venue,
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
