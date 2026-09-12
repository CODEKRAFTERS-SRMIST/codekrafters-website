import { NextResponse } from "next/server";
import { getSession, clearSession, invalidateUserSessions } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    const session = await getSession();
    if (session?.id) {
      await invalidateUserSessions(session.id);
    }

    await clearSession();
    try {
      const supabase = await createClient();
      await supabase.auth.signOut();
    } catch (e) {
      // Ignore if supabase client fails
    }
    return NextResponse.json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return NextResponse.json({ error: "Failed to log out" }, { status: 500 });
  }
}
