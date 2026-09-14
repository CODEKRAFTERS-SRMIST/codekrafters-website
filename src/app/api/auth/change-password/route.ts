import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase";
import { getSession } from "@/lib/session";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";
import { changePasswordSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const ip = getIpFromRequest(request);
    const ipLimit = await checkRateLimit(ip, "auth_strict");
    if (!ipLimit.success) {
      return NextResponse.json(
        { error: "Too many password update attempts. Please try again later.", retryAfter: ipLimit.retryAfter },
        { status: 429, headers: { "Retry-After": String(ipLimit.retryAfter || 60) } }
      );
    }

    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userLimit = await checkRateLimit(session.id, "auth_strict");
    if (!userLimit.success) {
      return NextResponse.json(
        { error: "Too many password update attempts for this account. Please try again later.", retryAfter: userLimit.retryAfter },
        { status: 429, headers: { "Retry-After": String(userLimit.retryAfter || 60) } }
      );
    }

    const body = await request.json();
    const parsed = changePasswordSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation Error", details: parsed.error.format() },
        { status: 400 }
      );
    }
    
    const { oldPassword, newPassword } = parsed.data;
    const userId = session.id;

    // Fetch user
    const { data: user, error: fetchError } = await supabaseAdmin
      .from("users")
      .select("id, password_hash, token_version, role, domain_id, email, full_name")
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

    // Verify old password strictly using bcrypt (never allow plaintext comparisons)
    let isValid = false;
    if (
      storedHash.startsWith("$2a$") ||
      storedHash.startsWith("$2b$") ||
      storedHash.startsWith("$2y$")
    ) {
      isValid = await bcrypt.compare(oldPassword, storedHash);
    } else {
      // Reject any non-bcrypt / unhashed / OAuth placeholder values
      isValid = false;
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
    const nextVersion = (user.token_version || 1) + 1;

    // Update DB with new password and incremented token_version
    const { error: updateError } = await supabaseAdmin
      .from("users")
      .update({ password_hash: newHash, token_version: nextVersion })
      .eq("id", userId);

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update password. Please try again." },
        { status: 500 }
      );
    }

    // Reissue fresh session with new version for this device
    const { setSession } = await import("@/lib/session");
    await setSession({
      id: user.id,
      email: user.email,
      fullName: user.full_name || (user.email ? user.email.split("@")[0] : "User"),
      role: user.role,
      domain_id: user.domain_id,
      version: nextVersion,
    });

    return NextResponse.json({ success: true, message: "Password changed successfully." });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json(
      { error: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
