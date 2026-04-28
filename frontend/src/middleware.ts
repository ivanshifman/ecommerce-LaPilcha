import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCurrentUser } from './lib/auth/auth-middleware';

const ADMIN_ROUTES = ['/admin'];
const AUTH_ONLY_ROUTES = ['/login', '/register', '/forgot-password', '/reset-password'];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const user = await getCurrentUser(req);

  // Solo bloquear admin routes en el servidor — el resto lo maneja useRequireAuth
  if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
    if (!user) {
      return NextResponse.redirect(new URL(`/login?from=${pathname}`, req.url));
    }
    if (user.role !== 'admin') {
      return NextResponse.redirect(new URL('/403', req.url));
    }
  }

  // Redirigir a home si ya está logueado e intenta ir a login/register
  if (AUTH_ONLY_ROUTES.some(route => pathname.startsWith(route))) {
    if (user) {
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