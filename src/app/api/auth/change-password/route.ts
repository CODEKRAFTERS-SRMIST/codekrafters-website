import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    const body = await request.json();
    const { userId, oldPassword, newPassword } = body;

    if (!session || session.id !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!userId || !oldPassword || !newPassword) {
      return NextResponse.json(
        { error: "User ID, old password and new password are required." },
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters." },
        { status: 400 }
      );
    }

    // Fetch user
    const { data: user, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("id, password_hash")
      .eq("id", userId)
      .maybeSingle();

    if (fetchError || !user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const storedHash = user.password_hash;
    if (!storedHash) {
      return NextResponse.json(
        { error: "Account has no password set." },
        { status: 400 }
      );
    }

    // Verify old password
    let isValid = false;
    if (
      storedHash.startsWith("$2a$") ||
      storedHash.startsWith("$2b$") ||
      storedHash.startsWith("$2y$")
    ) {
      isValid = await bcrypt.compare(oldPassword, storedHash);
    } else {
      // Plain-text legacy
      isValid = storedHash === oldPassword;
    }

    if (!isValid) {
      return NextResponse.json(
        { error: "Current password is incorrect." },
        { status: 401 }
      );
    }

    // Hash new password
    const salt = await bcrypt.genSalt(12);
    const newHash = await bcrypt.hash(newPassword, salt);

    // Update DB
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ password_hash: newHash })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update password. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
