import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";
import {
  sendFinalSelectionEmail,
  sendCustomBroadcastEmail,
} from "@/lib/email";

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
      templateType,
      applicationId,
      batch,
      domain,
      candidateEmail,
      candidateName,
      subject,
      message,
      onboardingLink,
      actionText,
      actionUrl,
    } = body;

    // Batch Selection Offer mode (strictly Accepted candidates only)
    if (templateType === "SELECTION" && batch) {
      const query = supabaseAdmin
        .from("applications")
        .select("*")
        .eq("status", "Accepted");

      const { data: acceptedApps, error } = await query;
      if (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

      let targets = acceptedApps || [];

      // Filter by domain
      if (domain && domain !== "ALL") {
        const targetNorm = domain.toLowerCase().replace(/[^a-z0-9]/g, "");
        const matchesDomain = (d: string) =>
          d && d.toLowerCase().replace(/[^a-z0-9]/g, "") === targetNorm;
        targets = targets.filter(
          (a) =>
            (a.domains && a.domains.some(matchesDomain)) ||
            matchesDomain(a.primary_domain)
        );
      }

      // Domain Admin role scoping
      if (session.role === "DOMAIN_ADMIN" && session.domain_id) {
        const adminNorm = session.domain_id.toLowerCase().replace(/[^a-z0-9]/g, "");
        const matchesDomain = (d: string) =>
          d && d.toLowerCase().replace(/[^a-z0-9]/g, "") === adminNorm;
        targets = targets.filter(
          (a) =>
            (a.domains && a.domains.some(matchesDomain)) ||
            matchesDomain(a.primary_domain)
        );
      }

      if (targets.length === 0) {
        return NextResponse.json(
          { error: "No accepted candidates found for the selected domain." },
          { status: 400 }
        );
      }

      const results = await Promise.allSettled(
        targets.map((app) =>
          sendFinalSelectionEmail(app.email, {
            candidateName: app.full_name || "Candidate",
            domainName: app.primary_domain || domain || "CodeKrafters",
            customMessage: message,
            onboardingLink,
          })
        )
      );

      const sentCount = results.filter((r) => r.status === "fulfilled" && (r.value as any).success).length;
      return NextResponse.json({ success: true, sentCount, totalTargets: targets.length });
    }

    let targetEmail = candidateEmail;
    let targetName = candidateName;
    let targetDomain = domain;

    if (applicationId) {
      const { data: appData, error } = await supabaseAdmin
        .from("applications")
        .select("*")
        .eq("id", applicationId)
        .single();

      if (error || !appData) {
        return NextResponse.json(
          { error: "Candidate application not found." },
          { status: 404 }
        );
      }

      // STRICT VALIDATION: Selection email ONLY for Accepted status
      if (templateType === "SELECTION" && appData.status !== "Accepted") {
        return NextResponse.json(
          { error: `Cannot send selection offer: Candidate status is "${appData.status}". Only candidates with status "Accepted" can receive this email.` },
          { status: 400 }
        );
      }

      targetEmail = appData.email;
      targetName = appData.full_name;
      targetDomain = domain || appData.primary_domain;

      // Domain Admin access check
      if (session.role === "DOMAIN_ADMIN" && session.domain_id) {
        const adminNorm = session.domain_id.toLowerCase().replace(/[^a-z0-9]/g, "");
        const matchesDomain = (d: string) =>
          d && d.toLowerCase().replace(/[^a-z0-9]/g, "") === adminNorm;
        const belongs =
          (appData.domains && appData.domains.some(matchesDomain)) ||
          matchesDomain(appData.primary_domain);

        if (!belongs) {
          return NextResponse.json(
            { error: "Forbidden: Candidate is outside your assigned domain." },
            { status: 403 }
          );
        }
      }
    }

    if (!targetEmail) {
      return NextResponse.json(
        { error: "Recipient email is required." },
        { status: 400 }
      );
    }

    let result;
    if (templateType === "SELECTION") {
      result = await sendFinalSelectionEmail(targetEmail, {
        candidateName: targetName || "Candidate",
        domainName: targetDomain || "CodeKrafters",
        customMessage: message,
        onboardingLink,
      });
    } else {
      // General Custom Announcement
      result = await sendCustomBroadcastEmail(targetEmail, {
        candidateName: targetName,
        title: subject || "Update from CodeKrafters",
        message: message || "",
        actionText,
        actionUrl,
      });
    }

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      simulated: result.simulated,
    });
  } catch (error: any) {
    console.error("Custom email error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to send email" },
      { status: 500 }
    );
  }
}
