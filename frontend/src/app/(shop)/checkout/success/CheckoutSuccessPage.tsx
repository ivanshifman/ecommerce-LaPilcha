'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { CheckCircle, Loader2, XCircle } from 'lucide-react';

type PaymentStatus = 'approved' | 'pending' | 'rejected';

export default function CheckoutSuccessPage() {
    const searchParams = useSearchParams();
    const router = useRouter();

    const externalReference = searchParams.get('external_reference');
    const statusParam = searchParams.get('collection_status') || searchParams.get('status');

    const [status, setStatus] = useState<PaymentStatus>('pending');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!externalReference) {
            setLoading(false);
            return;
        }

        if (statusParam === 'approved') {
            setStatus('approved');
            setLoading(false);
            return;
        }
        if (statusParam === 'rejected' || statusParam === 'failure') {
            setStatus('rejected');
            setLoading(false);
            return;
        }

        let attempts = 0;
        const maxAttempts = 6;
        const interval = 3000;
        const fetchStatus = async () => {
            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/payments/order/${externalReference}`,
                    { credentials: 'include' }
                );

                if (!res.ok) throw new Error('Error consultando el pago');

                const data = await res.json();
                const paymentStatus = data?.data?.status || data?.status;

                if (paymentStatus === 'approved') {
                    setStatus('approved');
                    setLoading(false);
                    return true;
                }

                if (paymentStatus === 'rejected' || paymentStatus === 'cancelled') {
                    setStatus('rejected');
                    setLoading(false);
                    return true;
                }

                return false;
            } catch {
                return false;
            }
        };

        const poll = async () => {
            const done = await fetchStatus();
            if (done) return;

            attempts++;
            if (attempts >= maxAttempts) {
                setStatus('pending');
                setLoading(false);
                return;
            }

            setTimeout(poll, interval);
        };

        poll();
    }, [externalReference, statusParam]);

    return (
        <div className="min-h-[70vh] flex items-center justify-center px-4">
            <div className="bg-card border border-border rounded-2xl shadow-sm max-w-md w-full p-8 text-center">
                {loading && (
                    <>
                        <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-primary" />
                        <h1 className="text-xl font-semibold mb-2">
                            Procesando tu pago
                        </h1>
                        <p className="text-muted-foreground">
                            Estamos confirmando la operación…
                        </p>
                    </>
                )}

                {!loading && status === 'approved' && (
                    <>
                        <CheckCircle className="mx-auto mb-4 h-12 w-12 text-success" />
                        <h1 className="text-2xl font-semibold mb-2">
                            ¡Pago aprobado!
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            Tu pedido fue confirmado correctamente.
                        </p>
                        <button
                            className="btn-primary w-full"
                            onClick={() => router.push('/')}
                        >
                            Volver a la tienda
                        </button>
                    </>
                )}

                {!loading && status === 'pending' && (
                    <>
                        <Loader2 className="mx-auto mb-4 h-10 w-10 animate-spin text-warning" />
                        <h1 className="text-xl font-semibold mb-2">
                            Pago en proceso
                        </h1>
                        <p className="text-muted-foreground mb-4">
                            Te avisaremos cuando se confirme.
                        </p>
                        <button
                            className="btn-secondary w-full"
                            onClick={() => router.push('/')}
                        >
                            Volver a la tienda
                        </button>
                    </>
                )}

                {!loading && status === 'rejected' && (
                    <>
                        <XCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
                        <h1 className="text-xl font-semibold mb-2">
                            Pago rechazado
                        </h1>
                        <p className="text-muted-foreground mb-6">
                            Hubo un problema con el pago.
                        </p>
                        <button
                            className="btn-secondary w-full"
                            onClick={() => router.push('/checkout')}
                        >
                            Intentar nuevamente
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}