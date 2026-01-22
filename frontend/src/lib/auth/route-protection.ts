import { UserRole } from "../../types/auth.types";


export interface RouteConfig {
  path: string;
  requiresAuth: boolean;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export const ROUTE_PROTECTION: RouteConfig[] = [
  {
    path: '/',
    requiresAuth: false,
  },
  {
    path: '/products',
    requiresAuth: false,
  },
  {
    path: '/about',
    requiresAuth: false,
  },
  {
    path: '/contact',
    requiresAuth: false,
  },
  {
    path: '/login',
    requiresAuth: false,
    redirectTo: '/',
  },
  {
    path: '/register',
    requiresAuth: false,
    redirectTo: '/',
  },
  {
    path: '/forgot-password',
    requiresAuth: false,
    redirectTo: '/',
  },
  {
    path: '/reset-password',
    requiresAuth: false,
    redirectTo: '/',
  },
  {
    path: '/profile',
    requiresAuth: true,
    allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  },
  {
    path: '/cart',
    requiresAuth: false,
  },
  {
    path: '/orders',
    requiresAuth: true,
    allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  },
  {
    path: '/checkout',
    requiresAuth: true,
    allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  },
  {
    path: '/wishlist',
    requiresAuth: true,
    allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  },
  {
    path: '/returns',
    requiresAuth: true,
    allowedRoles: [UserRole.CUSTOMER, UserRole.ADMIN],
  },
  {
    path: '/admin',
    requiresAuth: true,
    allowedRoles: [UserRole.ADMIN],
  },
];

export function getRouteConfig(pathname: string): RouteConfig | undefined {
  return ROUTE_PROTECTION.find((route) => {
    if (route.path === pathname) return true;
    if (pathname.startsWith(route.path + '/')) return true;
    return false;
  });
}

export function isPublicRoute(pathname: string): boolean {
  const config = getRouteConfig(pathname);
  return !config || !config.requiresAuth;
}

export function hasAccess(pathname: string, userRole?: UserRole): boolean {
  const config = getRouteConfig(pathname);
  
  if (!config) return true;
  if (!config.requiresAuth) return true;
  if (!userRole) return false;
  if (!config.allowedRoles) return true;
  
  return config.allowedRoles.includes(userRole);
}