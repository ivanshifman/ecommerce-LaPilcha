'use client';

import { useAuthInit } from '../hooks/useAuth';

export function Providers({ children }: { children: React.ReactNode }) {
    useAuthInit();

    return <>{children}</>;
}
