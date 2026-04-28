'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../store/authStore';
import { hasAccess } from '../lib/auth/route-protection';

// hooks/useRequireAuth.ts
export function useRequireAuth() {
  const { user, isAuthenticated, isLoading, isInitialized } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!isInitialized) return;
    if (isLoading) return;

    if (!isAuthenticated) {
      router.replace(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }
    if (user && !hasAccess(pathname, user.role)) {
      router.replace('/403');
    }
  }, [isAuthenticated, isInitialized, isLoading, user, pathname, router]);

  return { 
    isAuthenticated, 
    isLoading: !isInitialized || isLoading, 
    isInitialized, 
    user 
  };
}