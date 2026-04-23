import { Suspense } from 'react';
import CheckoutSuccessPage from './CheckoutSuccessPage';

export default function Page() {
    return (
        <Suspense fallback={<div>Cargando...</div>}>
            <CheckoutSuccessPage />
        </Suspense>
    );
}