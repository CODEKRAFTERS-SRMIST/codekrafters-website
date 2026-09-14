import { supabaseAdmin } from "@/lib/supabase/admin";
import { hashIdentifier } from "@/lib/encryption";

export type RateLimitAction =
  | 'auth_ip'
  | 'auth_email'
  | 'auth_strict'
  | 'email_service'
  | 'ai_service'
  | 'public'
  | 'authenticated';

// Human-friendly, generous thresholds designed to accommodate human users while stopping automated bot attacks
const CONFIG = {
  // Auth routes (Login, Signup, Password Change): 30 requests per minute
  AUTH_MAX: parseInt(process.env.AUTH_RATE_LIMIT_MAX_REQUESTS || "30", 10),
  AUTH_WINDOW_MS: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS || "60000", 10), // 1 minute
  AUTH_BACKOFF_MULTIPLIER: 1.05,

  // Paid external service limits (Resend / AI APIs): 60 requests per minute
  PAID_SERVICE_MAX: parseInt(process.env.PAID_SERVICE_RATE_LIMIT_MAX_REQUESTS || "60", 10),
  PAID_SERVICE_WINDOW_MS: parseInt(process.env.PAID_SERVICE_RATE_LIMIT_WINDOW_MS || "60000", 10), // 1 minute
  PAID_SERVICE_BACKOFF_MULTIPLIER: 1.1,

  // Public browsing endpoints: 150 requests per minute
  PUBLIC_MAX: parseInt(process.env.PUBLIC_RATE_LIMIT_MAX_REQUESTS || "150", 10),
  PUBLIC_WINDOW_MS: parseInt(process.env.PUBLIC_RATE_LIMIT_WINDOW_MS || "60000", 10), // 1 minute

  // Authenticated user interactions: 300 requests per minute
  AUTH_USER_MAX: parseInt(process.env.AUTH_USER_RATE_LIMIT_MAX_REQUESTS || "300", 10),
  AUTH_USER_WINDOW_MS: parseInt(process.env.AUTH_USER_RATE_LIMIT_WINDOW_MS || "60000", 10), // 1 minute
};

// In-memory sliding window cache
interface MemoryRateLimit {
  count: number;
  firstRequestAt: number;
  lockedUntil: number | null;
}
const memoryStore = new Map<string, MemoryRateLimit>();

// In-memory rate limit checker fallback
function checkMemoryRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
  backoffMultiplier: number,
  isStrict: boolean
): { success: boolean; retryAfter?: number } {
  const now = Date.now();
  const entry = memoryStore.get(key);

  if (!entry) {
    memoryStore.set(key, { count: 1, firstRequestAt: now, lockedUntil: null });
    return { success: true };
  }

  if (entry.lockedUntil && now < entry.lockedUntil) {
    return { success: false, retryAfter: Math.ceil((entry.lockedUntil - now) / 1000) };
  }

  if (now - entry.firstRequestAt > windowMs) {
    memoryStore.set(key, { count: 1, firstRequestAt: now, lockedUntil: null });
    return { success: true };
  }

  if (entry.count >= maxRequests) {
    if (isStrict) {
      const failuresOverMax = entry.count - maxRequests + 1;
      const backoffMs = Math.min(windowMs * Math.pow(backoffMultiplier, failuresOverMax), 30000); // Cap cooldown to 30s max
      entry.lockedUntil = now + backoffMs;
      entry.count += 1;
      return { success: false, retryAfter: Math.ceil(backoffMs / 1000) };
    }
    entry.count += 1;
    return { success: false, retryAfter: Math.ceil((windowMs - (now - entry.firstRequestAt)) / 1000) };
  }

  entry.count += 1;
  return { success: true };
}

export async function checkRateLimit(
  rawIdentifier: string,
  action: RateLimitAction
): Promise<{ success: boolean; retryAfter?: number }> {
  // Local development relaxation so developers are never throttled during manual testing / HMR
  const isLocal =
    rawIdentifier === "127.0.0.1" ||
    rawIdentifier === "::1" ||
    rawIdentifier === "localhost" ||
    process.env.NODE_ENV !== "production";

  if (isLocal) {
    return { success: true };
  }

  const now = new Date();
  // Pseudonymize identifier with SHA-256 HMAC so raw PII (IPs and emails) is never stored in plaintext
  const identifier = hashIdentifier(rawIdentifier || "anonymous");
  const memKey = `${action}:${identifier}`;

  let maxRequests = CONFIG.PUBLIC_MAX;
  let windowMs = CONFIG.PUBLIC_WINDOW_MS;
  let backoffMultiplier = 1.0;
  let isStrict = false;

  if (action === 'auth_ip' || action === 'auth_email' || action === 'auth_strict') {
    maxRequests = CONFIG.AUTH_MAX;
    windowMs = CONFIG.AUTH_WINDOW_MS;
    backoffMultiplier = CONFIG.AUTH_BACKOFF_MULTIPLIER;
    isStrict = true;
  } else if (action === 'email_service' || action === 'ai_service') {
    maxRequests = CONFIG.PAID_SERVICE_MAX;
    windowMs = CONFIG.PAID_SERVICE_WINDOW_MS;
    backoffMultiplier = CONFIG.PAID_SERVICE_BACKOFF_MULTIPLIER;
    isStrict = true;
  } else if (action === 'authenticated') {
    maxRequests = CONFIG.AUTH_USER_MAX;
    windowMs = CONFIG.AUTH_USER_WINDOW_MS;
  }

  // Fast in-memory check
  const memResult = checkMemoryRateLimit(memKey, maxRequests, windowMs, backoffMultiplier, isStrict);
  if (!memResult.success) {
    return memResult;
  }

  // Persistent distributed database check via Supabase
  try {
    const { data: record, error } = await supabaseAdmin
      .from("rate_limits")
      .select("*")
      .eq("identifier", identifier)
      .eq("action", action)
      .single();

    if (error && error.code !== 'PGRST116') {
      return memResult;
    }

    if (!record) {
      await supabaseAdmin.from("rate_limits").insert({
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

    // If currently locked due to cooldown
    if (lockedUntil && now.getTime() < lockedUntil.getTime()) {
      return { success: false, retryAfter: Math.ceil((lockedUntil.getTime() - now.getTime()) / 1000) };
    }

    // If the time window has expired, reset the counter
    if (timePassed > windowMs) {
      await supabaseAdmin
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
      if (isStrict) {
        const failuresOverMax = record.count - maxRequests + 1;
        const backoffMs = Math.min(windowMs * Math.pow(backoffMultiplier, failuresOverMax), 30000);
        const newLockedUntil = new Date(now.getTime() + backoffMs);

        await supabaseAdmin
          .from("rate_limits")
          .update({
            count: record.count + 1,
            last_request_at: now.toISOString(),
            locked_until: newLockedUntil.toISOString(),
          })
          .eq("id", record.id);

        return { success: false, retryAfter: Math.ceil(backoffMs / 1000) };
      } else {
        await supabaseAdmin
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
    await supabaseAdmin
      .from("rate_limits")
      .update({
        count: record.count + 1,
        last_request_at: now.toISOString(),
      })
      .eq("id", record.id);

    return { success: true };
  } catch {
    return memResult;
  }
}

export function getIpFromRequest(request: Request): string {
  // Extract client IP securely from standard proxies/Cloudflare/Vercel headers
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  if (cfConnectingIp) return cfConnectingIp.trim();

  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) return xRealIp.trim();

  const forwardedFor = request.headers.get("x-forwarded-for");
  if (forwardedFor) return forwardedFor.split(",")[0].trim();

  return "127.0.0.1"; // Fallback for local development
}
