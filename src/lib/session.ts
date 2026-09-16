import { EncryptJWT, jwtDecrypt, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { supabaseAdmin } from './supabase/admin';
import crypto from 'crypto';

function getSecretKey(): Uint8Array {
  const secret = process.env.JWT_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('[FATAL] JWT_SECRET_KEY or SUPABASE_SERVICE_ROLE_KEY must be defined in production environment variables.');
    }
    // Local development only fallback
    return crypto.createHash('sha256').update('codekrafters_local_development_secret_do_not_use_in_production').digest();
  }
  return crypto.createHash('sha256').update(secret).digest();
}

export type SessionPayload = {
  id: string;
  role: string;
  domain_id: string | null;
  version?: number;
  [key: string]: any;
};

/**
 * Encrypts session payload into an authenticated JWE (AES-256-GCM)
 * Ensuring token contents are never readable in plaintext at rest or in transit.
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  const key = getSecretKey();
  return new EncryptJWT(payload)
    .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .encrypt(key);
}

/**
 * Decrypts authenticated JWE session token.
 * Includes graceful backwards-compatibility for existing signed JWS tokens during migration.
 */
export async function decrypt(session: string | undefined = ''): Promise<SessionPayload | null> {
  if (!session) return null;
  const key = getSecretKey();

  // Try JWE decryption first (AES-256-GCM)
  try {
    const { payload } = await jwtDecrypt(session, key);
    if (payload && payload.id) {
      return payload as SessionPayload;
    }
  } catch {
    // If not JWE, attempt legacy JWS verification for seamless migration
    try {
      const { payload } = await jwtVerify(session, key, {
        algorithms: ['HS256'],
      });
      if (payload && payload.id) {
        return payload as SessionPayload;
      }
    } catch {
      return null;
    }
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

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const session = cookieStore.get('session')?.value;
  if (!session) return null;
  
  const payload = await decrypt(session);
  if (!payload?.id) return null;

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

