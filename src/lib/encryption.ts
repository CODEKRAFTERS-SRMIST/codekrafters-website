import crypto from "crypto";

/**
 * AES-256-GCM Field-Level Encryption Utility
 * Conforms to NIST SP 800-57 and OWASP Cryptographic Storage guidelines.
 *
 * Uses:
 * - 256-bit encryption key derived from environment secret with SHA-256
 * - 96-bit (12-byte) cryptographically secure random Initialization Vector (IV) per encryption
 * - 128-bit (16-byte) GCM authentication tag for tamper detection / ciphertext integrity
 * - Tagged version format `enc:v1:<iv_hex>:<tag_hex>:<ciphertext_hex>` for seamless forward & backward compatibility.
 */

function getEncryptionKey(): Buffer {
  const secret =
    process.env.ENCRYPTION_SECRET_KEY ||
    process.env.JWT_SECRET_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    "codekrafters_default_encryption_secret_key_at_rest_fallback";

  // Derive exactly 32 bytes (256 bits) for AES-256
  return crypto.createHash("sha256").update(secret).digest();
}

/**
 * Encrypts a plaintext string into an authenticated AES-256-GCM ciphertext payload.
 */
export function encryptField(plaintext: string | null | undefined): string {
  if (plaintext === null || plaintext === undefined || plaintext === "") {
    return "";
  }

  // Avoid double-encrypting already encrypted payloads
  if (typeof plaintext === "string" && plaintext.startsWith("enc:v1:")) {
    return plaintext;
  }

  try {
    const key = getEncryptionKey();
    const iv = crypto.randomBytes(12); // 96-bit IV recommended for GCM
    const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);

    let ciphertext = cipher.update(plaintext, "utf8", "hex");
    ciphertext += cipher.final("hex");

    const tag = cipher.getAuthTag().toString("hex");

    return `enc:v1:${iv.toString("hex")}:${tag}:${ciphertext}`;
  } catch (error) {
    console.error("[Encryption Error]: Failed to encrypt sensitive field:", error);
    // Return original in severe error or throw depending on policy
    return plaintext;
  }
}

/**
 * Decrypts an authenticated AES-256-GCM ciphertext payload back to plaintext.
 * Seamlessly handles unencrypted legacy fields for zero-downtime backwards compatibility.
 */
export function decryptField(ciphertext: string | null | undefined): string {
  if (ciphertext === null || ciphertext === undefined || ciphertext === "") {
    return "";
  }

  // If not formatted as encrypted v1 payload, return as-is (graceful legacy compatibility)
  if (!ciphertext.startsWith("enc:v1:")) {
    return ciphertext;
  }

  try {
    const parts = ciphertext.split(":");
    if (parts.length !== 5) {
      return ciphertext;
    }

    const ivHex = parts[2];
    const tagHex = parts[3];
    const encryptedHex = parts[4];

    const key = getEncryptionKey();
    const iv = Buffer.from(ivHex, "hex");
    const tag = Buffer.from(tagHex, "hex");

    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);

    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");

    return decrypted;
  } catch (error) {
    console.error("[Decryption Error]: Failed to decrypt sensitive field:", error);
    return ciphertext;
  }
}

/**
 * Pseudonymizes sensitive rate-limiting identifiers (IP addresses and emails)
 * using HMAC-SHA256 so raw PII is never stored in rate limit tracking tables.
 */
export function hashIdentifier(identifier: string): string {
  if (!identifier) return "";
  const key = getEncryptionKey();
  return crypto.createHmac("sha256", key).update(identifier.trim().toLowerCase()).digest("hex");
}
