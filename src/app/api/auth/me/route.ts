import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { supabaseAdmin } from "@/lib/supabase";

export async function GET(request: Request) {
  try {
    const session = await getSession();
    if (!session?.id) {
      return NextResponse.json({ authenticated: false, user: null }, { status: 401 });
    }

    // Default values from cryptographically verified JWE cookie
    let fullName = session.fullName || (session.email ? session.email.split("@")[0] : "User");
    let email = session.email || "";
    let role = session.role || "APPLICANT";
    let domainId = session.domain_id || null;

    try {
      const { data: user } = await supabaseAdmin
        .from("users")
        .select("id, email, full_name, role, domain_id")
        .eq("id", session.id)
        .maybeSingle();

      if (user) {
        fullName = user.full_name || fullName;
        email = user.email || email;
        role = user.role || role;
        domainId = user.domain_id ?? domainId;
      }
    } catch (dbErr) {
      // Gracefully preserve the authenticated session from the verified cookie
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: session.id,
        email: email,
        fullName: fullName,
        role: role,
        domain_id: domainId,
      },
    });
  } catch (error) {
    console.error("Auth session check error:", error);
    return NextResponse.json({ authenticated: false, user: null }, { status: 500 });
  }
}
