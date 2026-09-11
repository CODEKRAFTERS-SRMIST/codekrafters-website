import { NextResponse } from "next/server";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase";
import { setSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const ip = getIpFromRequest(request);
    const body = await request.json();
    
    const { email, password, fullName } = body;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and Password are required" }, { status: 400 });
    }

    // Rate Limit IP
    const ipLimit = await checkRateLimit(ip, 'auth_ip');
    
    if (!ipLimit.success) {
      return NextResponse.json(
        { error: "Too many attempts. Please try again later.", retryAfter: ipLimit.retryAfter },
        { status: 429, headers: { 'Retry-After': String(ipLimit.retryAfter) } }
      );
    }

    const { data: existingUser } = await supabaseAdmin.from('users').select('email').eq('email', email.toLowerCase()).maybeSingle();
    
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Insert new user
    const { data: newUser, error: insertError } = await supabaseAdmin
      .from('users')
      .insert([{
        email: email.toLowerCase(),
        password_hash,
        full_name: fullName || email.split("@")[0],
        role: "APPLICANT"
      }])
      .select()
      .single();

    if (insertError) {
      console.error("Signup insert error:", insertError);
      return NextResponse.json({ error: insertError.message || "Failed to create account." }, { status: 500 });
    }

    // Automatically set secure session cookie upon registration
    await setSession({
      id: newUser.id,
      role: newUser.role,
      domain_id: newUser.domain_id || null,
    });

    return NextResponse.json({
      success: true,
      user: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.role,
        fullName: newUser.full_name || fullName || newUser.email.split("@")[0]
      },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again later." }, { status: 500 });
  }
}
