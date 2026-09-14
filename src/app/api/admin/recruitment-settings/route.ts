import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getLiveRecruitmentSettings, saveLiveRecruitmentSettings } from "@/lib/recruitment-settings";
import { getSession } from "@/lib/session";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";
import { recruitmentSettingsPatchSchema } from "@/lib/validations";

export async function GET(request: Request) {
  const ip = getIpFromRequest(request);
  const ipLimit = await checkRateLimit(ip, "public");
  if (!ipLimit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please slow down." },
      { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter || 60) } }
    );
  }

  const settings = await getLiveRecruitmentSettings();
  return NextResponse.json({
    success: true,
    settings,
  });
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
      return NextResponse.json({ error: "Unauthorized: Global administrative access required" }, { status: 403 });
    }

    const body = await request.json();
    const parsed = recruitmentSettingsPatchSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation Error", details: parsed.error.format() }, { status: 400 });
    }

    const { current_phase, tasks_visible } = parsed.data;

    const currentSettings = await getLiveRecruitmentSettings();
    const newPhase = typeof current_phase === "number" ? current_phase : currentSettings.current_phase;
    const newTasksVisible = typeof tasks_visible === "boolean" ? tasks_visible : (newPhase === 2);

    const updatedSettings = await saveLiveRecruitmentSettings(newPhase, newTasksVisible);

    // Automated status progression:
    // When Phase 2 (Task launch) is active or tasks are unlocked:
    // Applications with status 'Applied' automatically update to 'Task Ongoing'
    if (newPhase === 2 || newTasksVisible) {
      try {
        await supabaseAdmin
          .from("applications")
          .update({ status: "Task Ongoing", updated_at: new Date().toISOString() })
          .eq("status", "Applied");
      } catch (err) {
        console.warn("Could not batch update Applied -> Task Ongoing:", err);
      }
    }

    // When Phase 3 (Evaluation & Deadline over) starts or submissions are closed:
    // Applications in 'Task Ongoing' automatically update to 'Task Completed'
    if (newPhase >= 3 || (!newTasksVisible && newPhase > 2)) {
      try {
        await supabaseAdmin
          .from("applications")
          .update({ status: "Task Completed", updated_at: new Date().toISOString() })
          .eq("status", "Task Ongoing");
      } catch (err) {
        console.warn("Could not batch update Task Ongoing -> Task Completed:", err);
      }
    }

    return NextResponse.json({
      success: true,
      settings: updatedSettings,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || "Failed to update recruitment settings" },
      { status: 500 }
    );
  }
}
