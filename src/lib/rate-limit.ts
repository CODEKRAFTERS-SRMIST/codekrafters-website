import { supabase } from "@/lib/supabase";

export type RateLimitAction = 'auth_ip' | 'auth_email' | 'public' | 'authenticated';

// Configurable thresholds via environment variables (with sensible defaults)
const CONFIG = {
  AUTH_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || "5", 10),
  AUTH_WINDOW_MS: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || "60000", 10), // 1 minute
  AUTH_BACKOFF_MULTIPLIER: parseFloat(process.env.AUTH_BACKOFF_MULTIPLIER || "1.5"),
  PUBLIC_MAX: parseInt(process.env.PUBLIC_RATE_LIMIT_MAX_REQUESTS || "30", 10),
  PUBLIC_WINDOW_MS: parseInt(process.env.PUBLIC_RATE_LIMIT_WINDOW_MS || "60000", 10), // 1 minute
  AUTH_USER_MAX: parseInt(process.env.AUTH_USER_RATE_LIMIT_MAX_REQUESTS || "100", 10),
  AUTH_USER_WINDOW_MS: parseInt(process.env.AUTH_USER_RATE_LIMIT_WINDOW_MS || "60000", 10), // 1 minute
};

export async function checkRateLimit(
  identifier: string,
  action: RateLimitAction
): Promise<{ success: boolean; retryAfter?: number }> {
  const now = new Date();
  
  let maxRequests = CONFIG.PUBLIC_MAX;
  let windowMs = CONFIG.PUBLIC_WINDOW_MS;
  
  if (action === 'auth_ip' || action === 'auth_email') {
    maxRequests = CONFIG.AUTH_MAX;
    windowMs = CONFIG.AUTH_WINDOW_MS;
  } else if (action === 'authenticated') {
    maxRequests = CONFIG.AUTH_USER_MAX;
    windowMs = CONFIG.AUTH_USER_WINDOW_MS;
  }

  // Fetch current state from Supabase
  const { data: record, error } = await supabase
    .from("rate_limits")
    .select("*")
    .eq("identifier", identifier)
    .eq("action", action)
    .single();

  if (error && error.code !== 'PGRST116') {
    // If not found (PGRST116), we ignore. Otherwise, log error and fail open to prevent blocking legitimate traffic.
    console.error("Rate limit check error:", error);
    return { success: true };
  }

  if (!record) {
    // Create new record
    await supabase.from("rate_limits").insert({
      identifier,
      action,
      count: 1,
      first_request_at: now.toISOString(),
      last_request_at: now.toISOString(),
    });
    return { success: true };
  }

  const firstRequestAt = new Date(record.first_request_at);
  const lockedUntil = record.locked_until ? new Date(record.locked_until) : null;
  const timePassed = now.getTime() - firstRequestAt.getTime();

  // If currently locked due to exponential backoff
  if (lockedUntil && now.getTime() < lockedUntil.getTime()) {
    return { success: false, retryAfter: Math.ceil((lockedUntil.getTime() - now.getTime()) / 1000) };
  }

  // If the time window has expired, reset the counter
  if (timePassed > windowMs) {
    await supabase
      .from("rate_limits")
      .update({
        count: 1,
        first_request_at: now.toISOString(),
        last_request_at: now.toISOString(),
        locked_until: null,
      })
      .eq("id", record.id);
    return { success: true };
  }

  // If over the limit within the active window
  if (record.count >= maxRequests) {
    if (action === 'auth_ip' || action === 'auth_email') {
      // Exponential backoff for authentication routes
      const failuresOverMax = record.count - maxRequests + 1;
      const backoffMs = windowMs * Math.pow(CONFIG.AUTH_BACKOFF_MULTIPLIER, failuresOverMax);
      const newLockedUntil = new Date(now.getTime() + backoffMs);
      
      await supabase
        .from("rate_limits")
        .update({
          count: record.count + 1,
          last_request_at: now.toISOString(),
          locked_until: newLockedUntil.toISOString(),
        })
        .eq("id", record.id);
        
      return { success: false, retryAfter: Math.ceil(backoffMs / 1000) };
    } else {
      // Hard lockout for the rest of the window for other routes
      await supabase
        .from("rate_limits")
        .update({
          count: record.count + 1,
          last_request_at: now.toISOString(),
        })
        .eq("id", record.id);
      return { success: false, retryAfter: Math.ceil((windowMs - timePassed) / 1000) };
    }
  }

  // Increment the counter
  await supabase
    .from("rate_limits")
    .update({
      count: record.count + 1,
      last_request_at: now.toISOString(),
    })
    .eq("id", record.id);
    
  return { success: true };
}

export function getIpFromRequest(request: Request): string {
  // Try to get IP from standard headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();
  const realIp = request.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1"; // Fallback for local development
}
