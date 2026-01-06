'use client';

import { useEffect } from 'react';
import { useAuthStore } from '../store/authStore';

export const useAuthInit = () => {
  const checkAuth = useAuthStore((state) => state.checkAuth);

  useEffect(() => {
    const hasCookies = document.cookie.includes('access_token');
    
    if (hasCookies) {
      checkAuth().catch((error) => {
        console.error('Auth check failed:', error);
      });
    }
  }, [checkAuth]);
};