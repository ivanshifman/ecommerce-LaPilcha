import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getCurrentUser } from './lib/auth/auth-middleware';
import { getRouteConfig } from './lib/auth/route-protection';

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/static/') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  const user = await getCurrentUser(req);
  const isLoggedIn = user !== null;

  const routeConfig = getRouteConfig(pathname);

  if (!routeConfig) {
    return NextResponse.next();
  }

  if (isLoggedIn && routeConfig.redirectTo && !routeConfig.requiresAuth) {
    return NextResponse.redirect(new URL(routeConfig.redirectTo, req.url));
  }

  if (routeConfig.requiresAuth && !isLoggedIn) {
    const loginUrl = new URL('/login', req.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (
    routeConfig.requiresAuth &&
    routeConfig.allowedRoles &&
    user &&
    !routeConfig.allowedRoles.includes(user.role)
  ) {
    const forbiddenUrl = new URL('/403', req.url);
    return NextResponse.redirect(forbiddenUrl);
  }

  return NextResponse.next();
}

// Configurar qué rutas procesa el middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\..*|public).*)',
  ],
};