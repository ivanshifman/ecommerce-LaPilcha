'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { VerificationCodeInput } from '../../../components/auth/VerificationCodeInput';
import { useAuthActions } from '../../../store/authStore';
import { authService } from '../../../services/auth.service';
import { showSuccess, showError } from '../../../lib/notifications';
import { handleApiError } from '../../../api/error-handler';

export default function VerifyEmailPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { checkAuth } = useAuthActions();

    const [userId, setUserId] = useState('');
    const [code, setCode] = useState('');
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [canResend, setCanResend] = useState(true);
    const [countdown, setCountdown] = useState(0);
    const [error, setError] = useState('');

    useEffect(() => {
        const userIdParam = searchParams.get('userId');
        if (!userIdParam) {
            showError('ID de usuario no encontrado');
            router.push('/register');
            return;
        }
        setUserId(userIdParam);
    }, [searchParams, router]);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [countdown]);

    useEffect(() => {
        if (code.length === 6 && !isVerifying) {
            handleVerify();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [code]);

    const handleVerify = async () => {
        if (!userId || code.length !== 6) return;

        setIsVerifying(true);
        setError('');

        try {
            await authService.verifyEmail({ userId, code });
            await checkAuth();

            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('pendingVerificationEmail');
            }

            showSuccess('¡Email verificado exitosamente!');

            setTimeout(() => {
                router.push('/');
            }, 1500);
        } catch (err) {
            const apiError = handleApiError(err);
            const errorMessage = apiError.message || 'Código de verificación inválido';
            setError(errorMessage);
            showError(errorMessage);
            setCode('');
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResendCode = async () => {
        if (!canResend || !userId) return;

        setIsResending(true);
        setError('');

        try {
            await authService.resendCode({ userId });
            showSuccess('Código reenviado a tu email');
            setCanResend(false);
            setCountdown(60);
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al reenviar el código');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Verifica tu email
                    </h1>
                    <p className="text-text-muted">
                        Ingresa el código de 6 dígitos que enviamos a tu correo
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
                    <div className="mb-6">
                        <VerificationCodeInput
                            length={6}
                            value={code}
                            onChange={setCode}
                            error={error}
                            disabled={isVerifying}
                        />
                    </div>

                    {isVerifying && (
                        <div className="flex items-center justify-center gap-2 text-primary mb-6">
                            <Loader2 className="w-5 h-5 animate-spin" />
                            <span className="text-sm font-medium">Verificando...</span>
                        </div>
                    )}

                    {code.length === 6 && !error && !isVerifying && (
                        <div className="flex items-center justify-center gap-2 text-green-600 mb-6">
                            <CheckCircle2 className="w-5 h-5" />
                            <span className="text-sm font-medium">¡Verificado!</span>
                        </div>
                    )}

                    <div className="text-center">
                        <p className="text-sm text-text-muted mb-3">
                            ¿No recibiste el código?
                        </p>
                        <button
                            onClick={handleResendCode}
                            disabled={!canResend || isResending}
                            className="text-primary hover:text-primary-dark font-medium text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mx-auto"
                        >
                            {isResending ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Reenviando...
                                </>
                            ) : canResend ? (
                                'Reenviar código'
                            ) : (
                                `Reenviar en ${countdown}s`
                            )}
                        </button>
                    </div>

                    <div className="mt-6 p-4 bg-accent/30 rounded-lg">
                        <p className="text-xs text-text-muted text-center">
                            💡 <strong>Consejo:</strong> Revisa tu carpeta de spam si no encuentras el email
                        </p>
                    </div>

                    <div className="mt-6 text-center">
                        <Link
                            href="/login"
                            className="text-sm text-text-muted hover:text-primary transition-colors"
                        >
                            Volver al inicio de sesión
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}