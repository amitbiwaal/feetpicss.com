import { createHash, createHmac, timingSafeEqual } from "node:crypto";

// Kept free of next/headers so proxy.ts can verify sessions too.

export const SESSION_COOKIE = "fp_admin_session";
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

const MIN_PASSWORD_LENGTH = 10;
const MIN_SECRET_LENGTH = 32;

type AuthConfig = { username: string; password: string; secret: string };

/** Returns null unless a real password and secret are configured — there is deliberately no default login. */
export function getAuthConfig(): AuthConfig | null {
  const password = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.SESSION_SECRET ?? "";
  if (password.length < MIN_PASSWORD_LENGTH || secret.length < MIN_SECRET_LENGTH) return null;
  return { username: process.env.ADMIN_USERNAME || "admin", password, secret };
}

function digest(value: string): Buffer {
  return createHash("sha256").update(value).digest();
}

export function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(digest(a), digest(b));
}

/** The password is mixed into the signing key, so changing it signs every existing session out. */
function sign(payload: string, config: AuthConfig): string {
  return createHmac("sha256", `${config.secret}:${config.password}`).update(payload).digest("base64url");
}

export function createSessionToken(now = Date.now()): string | null {
  const config = getAuthConfig();
  if (!config) return null;
  const expires = String(now + SESSION_MAX_AGE_SECONDS * 1000);
  return `${expires}.${sign(expires, config)}`;
}

export function verifySessionToken(token: string | undefined, now = Date.now()): boolean {
  const config = getAuthConfig();
  if (!config || !token) return false;
  const [expires, signature, ...rest] = token.split(".");
  if (!expires || !signature || rest.length > 0 || !/^\d+$/.test(expires)) return false;
  if (!safeEqual(signature, sign(expires, config))) return false;
  return Number(expires) > now;
}
