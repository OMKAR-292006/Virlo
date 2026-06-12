/**
 * In-memory sliding window rate limiter.
 * Resets per serverless instance — good enough to prevent casual abuse.
 * For stricter multi-instance limiting, swap the store for Redis/Upstash.
 */

interface WindowEntry {
  count: number;
  resetAt: number;
}

const store = new Map<string, WindowEntry>();

// Clean up expired entries every 5 minutes to avoid memory leaks
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) store.delete(key);
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  /** Max requests allowed in the window */
  limit: number;
  /** Window duration in seconds */
  windowSecs: number;
}

interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

export function rateLimit(key: string, options: RateLimitOptions): RateLimitResult {
  const { limit, windowSecs } = options;
  const now = Date.now();
  const windowMs = windowSecs * 1000;

  const entry = store.get(key);

  if (!entry || entry.resetAt < now) {
    // New window
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, resetAt: now + windowMs };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0, resetAt: entry.resetAt };
  }

  entry.count += 1;
  return { allowed: true, remaining: limit - entry.count, resetAt: entry.resetAt };
}

/**
 * Get a rate limit key from a Next.js request.
 * Uses the session cookie value so limits are per-user, not per-IP.
 * Falls back to IP if no session exists.
 */
export function getRateLimitKey(req: Request, prefix: string): string {
  const cookie = (req as any).cookies?.get?.('fb_session')?.value;
  if (cookie) return `${prefix}:session:${cookie}`;
  const ip =
    (req as any).headers?.get?.('x-forwarded-for')?.split(',')[0]?.trim() ||
    (req as any).headers?.get?.('x-real-ip') ||
    'unknown';
  return `${prefix}:ip:${ip}`;
}
