'use client';

import { ToastProvider } from '../components/providers/ToastProvider';
import { useAuthInit } from '../hooks/useAuth';
import { useAuth } from '../store/authStore';

function AuthInitializer() {
    useAuthInit();
    return null;
}

function AppContent({ children }: { children: React.ReactNode }) {
    const { isInitialized } = useAuth();
    
    if (!isInitialized) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
            </div>
        );
    }
    
    return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <>
            <AuthInitializer />
            <ToastProvider />
            <AppContent>{children}</AppContent>
        </>
    );
}