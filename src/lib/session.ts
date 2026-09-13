import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase/admin';

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[FATAL] JWT_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY must be defined in production environment variables.');
    }
    // Local development only fallback
    return new TextEncoder().encode('codekrafters_local_development_secret_do_not_use_in_production');
  }
  return new TextEncoder().encode(secret.slice(0, 32));
}

export type SessionPayload = {
  id: string;
  role: string;
  domain_id: string | null;
  version?: number;
  [key: string]: any;
};

export async function encrypt(payload: SessionPayload) {
  const key = getSecretKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(session: string | undefined = '') {
  if (!session) return null;
  try {
    const key = getSecretKey();
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    if (payload && payload.id) {
      return payload as SessionPayload;
    }
  } catch {
    // Session token invalid or expired
    return null;
  }
  return null;
}

export async function setSession(payload: SessionPayload) {
  const session = await encrypt(payload);
  const cookieStore = await cookies();
  
  cookieStore.set('session', session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function getSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  
  const payload = await decrypt(session);
  if (!payload?.id) return null;

  // Server-side active revocation check if version was stamped
  if (typeof payload.version === 'number') {
    try {
      const { data: user, error } = await supabaseAdmin
        .from('users')
        .select('token_version')
        .eq('id', payload.id)
        .maybeSingle();

      if (!error && user && typeof user.token_version === 'number') {
        if (payload.version < user.token_version) {
          // Token has been revoked on the server (e.g. after logout or password change)
          return null;
        }
      }
    } catch {
      // Allow fallback if database check is unavailable
    }
  }

  return payload;
}

export async function invalidateUserSessions(userId: string) {
  try {
    const { data: user } = await supabaseAdmin
      .from('users')
      .select('token_version')
      .eq('id', userId)
      .maybeSingle();

    const currentVersion = user?.token_version || 1;
    await supabaseAdmin
      .from('users')
      .update({ token_version: currentVersion + 1 })
      .eq('id', userId);
  } catch (err) {
    console.error('Failed to invalidate user sessions in DB:', err);
  }
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete('session');
}

