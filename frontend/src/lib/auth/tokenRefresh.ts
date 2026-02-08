import { apiClient } from '../../api/axios-client';

let refreshTimer: NodeJS.Timeout | null = null;

export function scheduleTokenRefresh(expiresInSeconds?: number) {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
    }

    const tokenLifetime = expiresInSeconds || 15 * 60;
    const bufferTime = Math.min(60, tokenLifetime * 0.1);
    const refreshIn = Math.max(0, tokenLifetime - bufferTime);

    console.log(`🔄 Token expires in ${tokenLifetime}s, will refresh in ${refreshIn}s`);

    refreshTimer = setTimeout(async () => {
        try {
            console.log('🔄 Auto-refreshing token...');
            await apiClient.post('/auth/refresh');
            scheduleTokenRefresh(tokenLifetime);

            console.log('✅ Token refreshed successfully');
        } catch (error) {
            console.error('❌ Auto-refresh failed:', error);

            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
        }
    }, refreshIn * 1000);
}

export function clearTokenRefresh() {
    if (refreshTimer) {
        clearTimeout(refreshTimer);
        refreshTimer = null;
        console.log('🧹 Token refresh timer cleared');
    }
}