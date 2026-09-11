import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { supabaseAdmin } from "@/lib/supabase";
import { setSession } from "@/lib/session";

export async function GET(request: Request) {
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
            // Insert new applicant into users table
            const { data: newUser, error: insertError } = await supabaseAdmin
              .from("users")
              .insert([
                {
                  email,
                  password_hash: "OAUTH_GOOGLE",
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

          // Issue secure server session cookie
          await setSession({
            id: userId,
            role: userRole,
            domain_id: userDomainId,
          });

          // Sync localStorage on client and redirect
          const sessionPayload = JSON.stringify({
            id: userId,
            email,
            role: userRole,
            domain_id: userDomainId,
            fullName,
          });

          return new Response(
            `<!DOCTYPE html>
<html>
  <head><title>Signing in...</title></head>
  <body style="background:#FFEFB4;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
    <script>
      try {
        localStorage.setItem("codekrafters_user_session", JSON.stringify(${sessionPayload}));
        window.dispatchEvent(new Event("auth_change"));
      } catch(e) {}
      window.location.href = ${JSON.stringify(redirect)};
    </script>
    <p style="font-weight:bold;color:#0D0D0D;">Authenticating with CodeKrafters...</p>
  </body>
</html>`,
            {
              headers: {
                "Content-Type": "text/html",
              },
            }
          );
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
