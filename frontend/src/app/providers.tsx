'use client';

import { ToastProvider } from '../components/providers/ToastProvider';
import { useAuthInit } from '../hooks/useAuth';

function AuthInitializer() {
    useAuthInit();
    return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AuthInitializer />
            <ToastProvider />
            {children}
        </>
    );
}