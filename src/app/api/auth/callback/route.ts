import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";
import { setSession } from "@/lib/session";
import { getIpFromRequest, checkRateLimit } from "@/lib/rate-limit";

export async function GET(request: Request) {
  const ip = getIpFromRequest(request);
  const ipLimit = await checkRateLimit(ip, "auth_ip");
  if (!ipLimit.success) {
    const { origin } = new URL(request.url);
    return NextResponse.redirect(`${origin}/login?error=too_many_attempts`);
  }

  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const redirect = searchParams.get("redirect") || "/profile";

  if (code) {
    try {
      const supabase = await createClient();
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);

      if (!error && data?.user) {
        const email = data.user.email?.toLowerCase();
        if (email) {
          // Check if user exists in public.users
          const { data: existingUser } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("email", email)
            .maybeSingle();

          let userId: string;
          let userRole = "APPLICANT";
          let userDomainId: string | null = null;
          let fullName =
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            email.split("@")[0];

          if (existingUser) {
            userId = existingUser.id;
            userRole = existingUser.role;
            userDomainId = existingUser.domain_id;
            fullName = existingUser.full_name || fullName;
          } else {
            // Generate cryptographically locked, non-guessable hash for OAuth users
            const lockedHash = `$2a$10$OAUTH.GOOGLE.LOCKED.${Buffer.from(crypto.randomUUID()).toString("base64url")}`;
            
            // Insert new applicant into users table
            const { data: newUser, error: insertError } = await supabaseAdmin
              .from("users")
              .insert([
                {
                  email,
                  password_hash: lockedHash,
                  full_name: fullName,
                  role: "APPLICANT",
                },
              ])
              .select()
              .single();

            if (insertError) {
              console.error("Failed to insert OAuth user into public.users:", insertError);
              return NextResponse.redirect(`${origin}/login?error=oauth_registration_failed`);
            }
            userId = newUser.id;
            userRole = newUser.role;
            userDomainId = newUser.domain_id;
          }

          // Issue secure server session cookie with token version
          await setSession({
            id: userId,
            role: userRole,
            domain_id: userDomainId,
            version: existingUser?.token_version || 1,
          });

          // Clean HTTP redirect relying on secure HTTP-only session cookie
          return NextResponse.redirect(new URL(redirect, request.url));
        }
      } else {
        console.error("OAuth code exchange error:", error);
      }
    } catch (err) {
      console.error("Callback route error:", err);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=oauth_failed`);
}
