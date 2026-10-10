import "server-only";
import { getStore } from "./store";

// Counters live in the content store: on Vercel that is the database, because serverless
// instances come and go and do not share memory.

/** Minutes until `key` may try again, or 0 when it is under the limit. Does not count an attempt. */
export async function blockedMinutes(key: string, limit: number): Promise<number> {
  const now = Date.now();
  const state = await getStore().getRateLimit(key, now);
  if (!state || state.count < limit) return 0;
  return Math.max(1, Math.ceil((state.resetAt - now) / 60000));
}

export async function recordAttempt(key: string, windowMs: number): Promise<void> {
  await getStore().bumpRateLimit(key, windowMs, Date.now());
}

export async function clearAttempts(key: string): Promise<void> {
  await getStore().clearRateLimit(key);
}
