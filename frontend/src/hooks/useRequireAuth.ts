'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../store/authStore';
import { hasAccess } from '../lib/auth/route-protection';

export function useRequireAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated) {
      const loginUrl = `/login?from=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
      return;
    }

    if (user && !hasAccess(pathname, user.role)) {
      router.replace('/403');
    }
  }, [isAuthenticated, isLoading, user, pathname, router]);

  return { isAuthenticated, isLoading, user };
}