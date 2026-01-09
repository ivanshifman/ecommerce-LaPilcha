'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuthInit = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    checkAuth().catch((error) => {
      console.error('Auth check failed:', error);
    });
  }, [checkAuth]);
};