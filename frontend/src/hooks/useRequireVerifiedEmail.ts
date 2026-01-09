'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../store/authStore';
import { showWarning } from '../lib/notifications';

export function useRequireVerifiedEmail() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (isAuthenticated && user && !user.emailVerified) {
            showWarning('Debes verificar tu email para acceder a esta página');
            router.push(`/verify-email-notice?email=${encodeURIComponent(user.email)}`);
        }
    }, [isAuthenticated, user, isLoading, router]);

    return { user, isAuthenticated, isLoading, emailVerified: user?.emailVerified };
}