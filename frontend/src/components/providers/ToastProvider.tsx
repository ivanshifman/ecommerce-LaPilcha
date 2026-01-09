'use client';

import { Toaster } from 'react-hot-toast';

export function ToastProvider() {
    return (
        <Toaster
            position="top-right"
            reverseOrder={false}
            gutter={8}
            toastOptions={{
                duration: 4000,
                style: {
                    background: '#ffffff',
                    color: '#2c2416',
                    border: '1px solid #e5e5e0',
                },
            }}
        />
    );
}