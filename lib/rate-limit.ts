import "server-only";

type Bucket = { count: number; resetAt: number };

// In-memory is enough for a single Node server; a multi-instance deployment would need a shared store.
const buckets = new Map<string, Bucket>();

function current(key: string, windowMs: number, now: number): Bucket {
  let bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt <= now) buckets.delete(k);
  }
  return bucket;
}

/** Minutes until `key` may try again, or 0 when it is under the limit. Does not count an attempt. */
export function blockedMinutes(key: string, limit: number, windowMs: number): number {
  const now = Date.now();
  const bucket = current(key, windowMs, now);
  return bucket.count >= limit ? Math.max(1, Math.ceil((bucket.resetAt - now) / 60000)) : 0;
}

export function recordAttempt(key: string, windowMs: number): void {
  current(key, windowMs, Date.now()).count += 1;
}

export function clearAttempts(key: string): void {
  buckets.delete(key);
}
