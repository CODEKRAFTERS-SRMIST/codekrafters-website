import { supabaseAdmin } from "@/lib/supabase";

// In-memory fallback state so settings work seamlessly even before DB migrations
let memorySettings = {
  current_phase: 1,
  tasks_visible: false,
  updated_at: new Date().toISOString(),
};

export async function getLiveRecruitmentSettings() {
  try {
    const { data, error } = await supabaseAdmin
      .from("recruitment_settings")
      .select("current_phase, tasks_visible, updated_at")
      .eq("id", "current_cycle")
      .maybeSingle();

    if (!error && data) {
      memorySettings = {
        current_phase: Number(data.current_phase) || 1,
        tasks_visible: Boolean(data.tasks_visible),
        updated_at: data.updated_at || new Date().toISOString(),
      };
    }
  } catch (e) {
    // fallback to memorySettings
  }
  return memorySettings;
}

export async function saveLiveRecruitmentSettings(newPhase: number, newTasksVisible: boolean) {
  memorySettings = {
    current_phase: newPhase,
    tasks_visible: newTasksVisible,
    updated_at: new Date().toISOString(),
  };

  // Attempt DB upsert
  try {
    await supabaseAdmin.from("recruitment_settings").upsert({
      id: "current_cycle",
      current_phase: newPhase,
      tasks_visible: newTasksVisible,
      updated_at: new Date().toISOString(),
    });
  } catch (dbErr) {
    console.warn("Could not persist recruitment settings to DB table, using memory state:", dbErr);
  }

  return memorySettings;
}
