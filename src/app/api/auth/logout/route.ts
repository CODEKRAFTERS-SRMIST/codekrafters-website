import { NextResponse } from "next/server";
import { clearSession } from "@/lib/session";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  try {
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
