import { createClient } from "@supabase/supabase-js";

const supabaseUrl = (process.env.NEXT_PUBLIC_SUPABASE_URL || "").trim();
const supabaseKey = (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "").trim();
const serviceRoleKey = (process.env.SUPABASE_SERVICE_ROLE_KEY || "").trim();

// Public client (restricted by RLS)
export const supabase = createClient(supabaseUrl, supabaseKey);

// Admin client (bypasses RLS if service role key provided, or falls back to anon key)
export const supabaseAdmin = createClient(
  supabaseUrl,
  serviceRoleKey || supabaseKey
);
