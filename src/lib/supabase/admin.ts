import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

if (!serviceRoleKey && process.env.NODE_ENV === "production") {
  console.warn("[SECURITY WARNING] SUPABASE_SERVICE_ROLE_KEY is not configured in production. Server operations requiring RLS bypass may fail.");
}

// Dedicated server-only admin client with Service Role privileges
export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey || (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim()
);
