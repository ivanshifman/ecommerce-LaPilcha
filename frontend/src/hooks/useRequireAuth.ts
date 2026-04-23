'use client';

import { useAuth } from '../store/authStore';

export function useRequireAuth() {
  const { user, isAuthenticated, isLoading } = useAuth();
  return { isAuthenticated, isLoading, user };
}