import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';
import { rateLimit, getRateLimitKey } from './rate-limit';

// AI generation endpoints: 10 requests per minute per user
const AI_LIMIT = { limit: 10, windowSecs: 60 };

/** Verify session and enforce rate limit. Returns a response if the request should be blocked. */
export function requireSession(req: NextRequest, routeName: string): NextResponse | null {
  const session = req.cookies.get('fb_session')?.value;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const key = getRateLimitKey(req, routeName);
  const { allowed, remaining, resetAt } = rateLimit(key, AI_LIMIT);

  if (!allowed) {
    logger.warn('Rate limit exceeded', { route: routeName, key });
    return NextResponse.json(
      { error: 'Too many requests. Please wait a moment and try again.' },
      {
        status: 429,
        headers: {
          'Retry-After': String(Math.ceil((resetAt - Date.now()) / 1000)),
          'X-RateLimit-Limit': String(AI_LIMIT.limit),
          'X-RateLimit-Remaining': '0',
        },
      }
    );
  }

  return null; // authorized + within limit
}

/** Sanitized error handler — never leaks internal messages to the client. */
export function handleApiError(error: unknown): NextResponse {
  const msg = error instanceof Error ? error.message : String(error);
  const isQuota =
    msg.includes('429') ||
    msg.toLowerCase().includes('too many requests') ||
    msg.toLowerCase().includes('quota');

  if (isQuota) {
    logger.warn('Gemini quota/rate-limit hit', { error: msg });
    return NextResponse.json(
      { error: 'Rate limit reached. Please wait a moment and try again.' },
      { status: 429 }
    );
  }

  logger.error('API route error', { error: msg });
  return NextResponse.json({ error: 'An unexpected error occurred.' }, { status: 500 });
}
