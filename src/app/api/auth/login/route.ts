import { NextResponse } from "next/server";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase";
import { setSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const ip = getIpFromRequest(request);
    const body = await request.json();
    
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and Password are required" }, { status: 400 });
    }

    // Rate Limit IP + Account combination
    const ipLimit = await checkRateLimit(ip, 'auth_ip');
    const emailLimit = await checkRateLimit(email.toLowerCase(), 'auth_email');
    
    if (!ipLimit.success || !emailLimit.success) {
      const retryAfter = Math.max(ipLimit.retryAfter || 60, emailLimit.retryAfter || 60);
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later.", retryAfter },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const { data: user, error: userError } = await supabaseAdmin
      .from('users')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();
    
    if (userError) {
      console.error("Database user fetch error:", userError);
      return NextResponse.json({ error: userError.message || "Database connection error." }, { status: 500 });
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const storedPassword = user.password_hash || user.password;
    if (!storedPassword) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    let isValid = false;
    if (storedPassword.startsWith("$2a$") || storedPassword.startsWith("$2b$") || storedPassword.startsWith("$2y$")) {
      isValid = await bcrypt.compare(password, storedPassword);
    }

    if (!isValid) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    // Set secure JWT session
    await setSession({
      id: user.id,
      role: user.role,
      domain_id: user.domain_id,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        domain_id: user.domain_id,
        fullName: user.full_name || user.fullName || user.email.split("@")[0],
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again later." }, { status: 500 });
  }
}
