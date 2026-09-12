import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase/admin';

const secretKey = process.env.JWT_SECRET_KEY || (process.env.SUPABASE_SERVICE_ROLE_KEY ? process.env.SUPABASE_SERVICE_ROLE_KEY.slice(0, 32) : 'codekrafters_dev_fallback_secret_key_do_not_use_in_prod');

if (!process.env.JWT_SECRET_KEY && process.env.NODE_ENV === 'production') {
  console.warn('[SECURITY WARNING] JWT_SECRET_KEY is not defined in environment variables.');
}

const encodedKey = new TextEncoder().encode(secretKey);

export type SessionPayload = {
  id: string;
  role: string;
  domain_id: string | null;
  version?: number;
  [key: string]: any;
};

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(encodedKey);
}

export async function decrypt(session: string | undefined = '') {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload as SessionPayload;
  } catch {
    // Graceful fallback for active sessions created prior to secret key migration
    try {
      const legacyKey = new TextEncoder().encode('default_secret_key_please_change_in_production');
      const { payload } = await jwtVerify(session, legacyKey, {
        algorithms: ['HS256'],
      });
      return payload as SessionPayload;
    } catch {
      return null;
    }
  }
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

