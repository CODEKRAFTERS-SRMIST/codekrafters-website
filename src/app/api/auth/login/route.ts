import { NextResponse } from "next/server";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";
import { supabase } from "@/lib/supabase";

export async function POST(request: Request) {
  try {
    const ip = getIpFromRequest(request);
    const body = await request.json();
    
    const { email, password, fullName, action } = body;

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

    if (action === "SIGN_UP") {
      // Check if user already exists in either table
      const { data: existingUser } = await supabase.from('users').select('email').eq('email', email.toLowerCase()).maybeSingle();
      const { data: existingAdmin } = await supabase.from('admins').select('email').eq('email', email.toLowerCase()).maybeSingle();

      if (existingUser || existingAdmin) {
        return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
      }

      // Insert new user
      const { data: newUser, error: insertError } = await supabase
        .from('users')
        .insert([{ email: email.toLowerCase(), password, fullName: fullName || email.split("@")[0], role: "APPLICANT" }])
        .select()
        .single();

      if (insertError) {
        return NextResponse.json({ error: "Failed to create account." }, { status: 500 });
      }

      return NextResponse.json({
        success: true,
        user: { id: newUser.id, email: newUser.email, role: newUser.role, fullName: newUser.fullName },
      });
    } else {
      // SIGN_IN
      // First check admins
      const { data: admin } = await supabase.from('admins').select('*').eq('email', email.toLowerCase()).maybeSingle();
      if (admin) {
        if (admin.password !== password) {
           return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }
        return NextResponse.json({
          success: true,
          user: { id: admin.id, email: admin.email, role: "ADMIN", admin_level: admin.admin_level || "LEAD", fullName: admin.fullName || "Admin" },
        });
      }

      // Then check regular users
      const { data: user } = await supabase.from('users').select('*').eq('email', email.toLowerCase()).maybeSingle();
      if (user) {
        if (user.password !== password) {
           return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
        }
        return NextResponse.json({
          success: true,
          user: { id: user.id, email: user.email, role: user.role, fullName: user.fullName },
        });
      }

      return NextResponse.json({ error: "Account not found. Please sign up." }, { status: 404 });
    }
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again later." }, { status: 500 });
  }
}
