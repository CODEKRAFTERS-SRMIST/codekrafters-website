import { NextResponse } from "next/server";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";
import { supabaseAdmin } from "@/lib/supabase";
import { setSession } from "@/lib/session";
import { signupSchema } from "@/lib/validations";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const ip = getIpFromRequest(request);
    const body = await request.json();

    const parsed = signupSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation Error", details: parsed.error.format() }, { status: 400 });
    }
    
    const { email, password, fullName, agreedToTerms } = parsed.data;

    if (agreedToTerms === false) {
      return NextResponse.json({ error: "You must accept the Terms of Service and Privacy Policy to create an account." }, { status: 400 });
    }

    // Rate Limit IP and Email
    const ipLimit = await checkRateLimit(ip, 'auth_ip');
    const emailLimit = await checkRateLimit(email.toLowerCase(), 'auth_email');
    
    if (!ipLimit.success || !emailLimit.success) {
      const retryAfter = Math.max(ipLimit.retryAfter || 60, emailLimit.retryAfter || 60);
      return NextResponse.json(
        { error: "Too many attempts. Please try again later.", retryAfter },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const { data: existingUser } = await supabaseAdmin.from('users').select('email').eq('email', email.toLowerCase()).maybeSingle();
    
    if (existingUser) {
      return NextResponse.json({ 
        error: "Unable to complete registration. If you already have an account, please sign in." 
      }, { status: 400 });
    }

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

    // Automatically set secure session cookie upon registration with token version
    await setSession({
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.full_name || fullName || newUser.email.split("@")[0],
      role: newUser.role,
      domain_id: newUser.domain_id || null,
      version: newUser.token_version || 1,
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
