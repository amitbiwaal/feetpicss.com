import "server-only";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { connection } from "next/server";
import {
  SESSION_COOKIE,
  SESSION_MAX_AGE_SECONDS,
  createSessionToken,
  getAuthConfig,
  safeEqual,
  verifySessionToken,
} from "./session-token";

export async function isAdmin(): Promise<boolean> {
  // Checking a session compares its expiry with the clock, so it must run for a real request.
  // Without this, link prefetching tries to prerender admin pages and fails on Date.now().
  await connection();
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}

/**
 * Call at the top of every admin page, Server Action and route handler.
 * The proxy redirect is only a convenience — this is the actual check.
 */
export async function requireAdmin(): Promise<void> {
  if (!(await isAdmin())) redirect("/admin/login");
}

export function checkCredentials(username: string, password: string): boolean {
  const config = getAuthConfig();
  if (!config) return false;
  const userOk = safeEqual(username, config.username);
  const passOk = safeEqual(password, config.password);
  return userOk && passOk;
}

export async function startSession(): Promise<boolean> {
  const token = createSessionToken();
  if (!token) return false;
  const requestHeaders = await headers();
  const isHttps =
    requestHeaders.get("x-forwarded-proto")?.split(",")[0].trim() === "https" ||
    (requestHeaders.get("origin") ?? "").startsWith("https://");
  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: isHttps,
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return true;
}

export async function endSession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function clientIp(): Promise<string> {
  const requestHeaders = await headers();
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0].trim() ||
    requestHeaders.get("x-real-ip") ||
    "unknown"
  );
}

/** True when a state-changing request was sent by a page on this same site. */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}
