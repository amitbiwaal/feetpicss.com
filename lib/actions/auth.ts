"use server";

import { redirect } from "next/navigation";
import { checkCredentials, clientIp, endSession, startSession } from "../auth";
import { blockedMinutes, clearAttempts, recordAttempt } from "../rate-limit";
import { getAuthConfig } from "../session-token";

export type LoginState = { error?: string };

const WINDOW_MS = 15 * 60 * 1000;
const PER_IP_LIMIT = 5;
// x-forwarded-for can be spoofed when no trusted proxy sits in front, so total failures are capped as well.
const GLOBAL_LIMIT = 40;
const GLOBAL_KEY = "login:all";

export async function loginAction(_previous: LoginState, formData: FormData): Promise<LoginState> {
  if (!getAuthConfig()) {
    return {
      error:
        "Admin login is not set up yet. Add ADMIN_PASSWORD (10+ characters) and SESSION_SECRET (32+ characters) to .env.local and restart the server.",
    };
  }

  const ipKey = `login:${await clientIp()}`;
  const wait = Math.max(
    blockedMinutes(ipKey, PER_IP_LIMIT, WINDOW_MS),
    blockedMinutes(GLOBAL_KEY, GLOBAL_LIMIT, WINDOW_MS),
  );
  if (wait > 0) {
    return { error: `Too many failed attempts. Try again in about ${wait} minute${wait === 1 ? "" : "s"}.` };
  }

  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!checkCredentials(username, password)) {
    recordAttempt(ipKey, WINDOW_MS);
    recordAttempt(GLOBAL_KEY, WINDOW_MS);
    return { error: "Wrong username or password." };
  }

  clearAttempts(ipKey);
  await startSession();
  redirect("/admin");
}

export async function logoutAction(): Promise<void> {
  await endSession();
  redirect("/admin/login");
}
