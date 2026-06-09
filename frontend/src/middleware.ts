import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_ONLY_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (AUTH_ONLY_ROUTES.some(route => pathname.startsWith(route))) {
    const hasRefreshToken = req.cookies.has('refresh_token');
    if (hasRefreshToken) {
      return NextResponse.redirect(new URL('/', req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};