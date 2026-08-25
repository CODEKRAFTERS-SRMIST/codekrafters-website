import { NextResponse } from "next/server";
import { UserRole } from "@/types/join";
import { supabase } from "@/lib/supabase";
import { checkRateLimit, getIpFromRequest } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validations";

export async function POST(request: Request) {
  try {
    const ip = getIpFromRequest(request);
    const body = await request.json();
    
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation Error", details: parsed.error.format() }, { status: 400 });
    }
    
    const { email, password, role } = parsed.data;

    // Rate Limit IP + Account combination (stricter limit with exponential backoff)
    const ipLimit = await checkRateLimit(ip, 'auth_ip');
    const emailLimit = await checkRateLimit(email.toLowerCase(), 'auth_email');
    
    if (!ipLimit.success || !emailLimit.success) {
      const retryAfter = Math.max(ipLimit.retryAfter || 60, emailLimit.retryAfter || 60);
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later.", retryAfter },
        { status: 429, headers: { 'Retry-After': String(retryAfter) } }
      );
    }

    if (role === "ADMIN") {
      // Validate Admin against Supabase
      const { data: admin, error } = await supabase
        .from("admins")
        .select("*")
        .eq("email", email)
        .eq("password", password)
        .single();

      if (error || !admin) {
        return NextResponse.json(
          { error: "Invalid admin email or password." },
          { status: 401 }
        );
      }

      return NextResponse.json({
        success: true,
        user: {
          id: admin.id,
          email: admin.email,
          role: "ADMIN",
          fullName: "CodeKrafters Admin",
        },
      });
    }

    // Applicant Login / General User
    return NextResponse.json({
      success: true,
      user: {
        id: `usr-${Buffer.from(email.toLowerCase()).toString("base64").substring(0, 10)}`,
        email: email.toLowerCase(),
        role: "APPLICANT",
      },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "An unexpected error occurred. Please try again later." }, { status: 500 });
  }
}
