import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Routes that require authentication
const PROTECTED = ['/home', '/dashboard', '/analytics', '/settings', '/caption-generator', '/content-planner', '/trend-engine', '/strategy-example'];

// Routes only for unauthenticated users
const AUTH_ONLY = ['/login', '/onboarding'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for Firebase auth session cookie (set by client after login)
  const session = request.cookies.get('fb_session')?.value;

  const isProtected = PROTECTED.some(p => pathname.startsWith(p));
  const isAuthOnly = AUTH_ONLY.some(p => pathname.startsWith(p));

  if (isProtected && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isAuthOnly && session) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api).*)'],
};
