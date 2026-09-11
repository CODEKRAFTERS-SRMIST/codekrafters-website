import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getLiveRecruitmentSettings, saveLiveRecruitmentSettings } from "@/lib/recruitment-settings";

export async function GET() {
  const settings = await getLiveRecruitmentSettings();
  return NextResponse.json({
    success: true,
    settings,
  });
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { adminId, current_phase, tasks_visible } = body;

    if (!adminId) {
      return NextResponse.json({ error: "Missing adminId" }, { status: 400 });
    }

    // Verify admin privileges
    const { data: user } = await supabaseAdmin
      .from("users")
      .select("role")
      .eq("id", adminId)
      .maybeSingle();

    if (!user || (user.role !== "PRESIDENT" && user.role !== "DOMAIN_ADMIN")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

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
