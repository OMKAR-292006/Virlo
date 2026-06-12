import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';

/** Verify the session cookie exists on an API request. */
export function requireSession(req: NextRequest): NextResponse | null {
  const session = req.cookies.get('fb_session')?.value;
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  return null; // authorized
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
