'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, AlertCircle, ArrowRight, Loader2 } from 'lucide-react';
import { authService } from '../../../services/auth.service';
import { showError } from '../../../lib/notifications';
import { handleApiError } from '../../../api/error-handler';

export default function VerifyEmailNoticePage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [email, setEmail] = useState<string>('');
    const [userId, setUserId] = useState<string | null>(null);
    const [isLoadingUserId, setIsLoadingUserId] = useState(false);
    const [fetchError, setFetchError] = useState<string>('');

    useEffect(() => {
        const userIdParam = searchParams.get('userId');
        if (userIdParam) {
            setUserId(userIdParam);
            return;
        }

        if (typeof window !== 'undefined') {
            const savedEmail = sessionStorage.getItem('pendingVerificationEmail');

            if (savedEmail) {
                setEmail(savedEmail);
                fetchUserIdByEmail(savedEmail);
            } else {
                console.warn('⚠️ No userId or email found');
            }
        }
    }, [searchParams]);

    const fetchUserIdByEmail = async (emailAddress: string) => {
        setIsLoadingUserId(true);
        setFetchError('');

        console.log('🔍 Fetching userId for email:', emailAddress);

        try {
            const response = await authService.getUserIdByEmail(emailAddress);
            setUserId(response.userId);
        } catch (err) {
            const apiError = handleApiError(err);
            console.error('❌ Error fetching userId:', apiError);
            setFetchError(apiError.message || 'Error al obtener información del usuario');
            showError('No se pudo obtener tu información de verificación. Por favor, intenta registrarte nuevamente.');
        } finally {
            setIsLoadingUserId(false);
        }
    };

    const handleVerifyClick = () => {
        if (userId) {
            console.log('✅ Redirecting to verify-email with userId:', userId);
            router.push(`/verify-email?userId=${userId}`);
        } else {
            console.error('❌ No userId available');
            showError('No se pudo obtener tu información de verificación');
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/10 rounded-full mb-4">
                        <AlertCircle className="w-8 h-8 text-warning" />
                    </div>
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Email no verificado
                    </h1>
                    <p className="text-text-muted">
                        Necesitas verificar tu email antes de continuar
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
                    <div className="flex justify-center mb-6">
                        <div className="relative">
                            <div className="w-20 h-20 bg-accent rounded-full flex items-center justify-center">
                                <Mail className="w-10 h-10 text-primary" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-warning rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">!</span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4 mb-6">
                        <p className="text-center text-text-primary">
                            Tu cuenta ha sido creada exitosamente, pero aún no has verificado tu dirección de email.
                        </p>

                        {email && (
                            <p className="text-center text-sm text-text-muted">
                                Hemos enviado un código de verificación a{' '}
                                <span className="font-semibold text-text-primary">{email}</span>
                            </p>
                        )}

                        <div className="p-4 bg-accent/30 rounded-lg">
                            <p className="text-sm text-text-muted text-center">
                                <strong>¿Por qué verificar?</strong>
                                <br />
                                La verificación nos ayuda a mantener tu cuenta segura y asegurar que puedas recuperar el acceso si olvidas tu contraseña.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {isLoadingUserId ? (
                            <button
                                disabled
                                className="w-full bg-primary/50 text-white py-3 rounded-lg font-medium cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Cargando...
                            </button>
                        ) : userId ? (
                            <button
                                onClick={handleVerifyClick}
                                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 flex items-center justify-center gap-2"
                            >
                                Verificar ahora
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        ) : fetchError ? (
                            <div className="space-y-3">
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-sm text-red-800 text-center">
                                        {fetchError}
                                    </p>
                                </div>
                                <button
                                    onClick={() => router.push('/register')}
                                    className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200"
                                >
                                    Ir a Registro
                                </button>
                            </div>
                        ) : (
                            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                <p className="text-sm text-yellow-800 text-center">
                                    Por favor, revisa tu email y usa el código que te enviamos, o intenta registrarte nuevamente.
                                </p>
                            </div>
                        )}

                        <button
                            onClick={() => router.push('/login')}
                            className="w-full bg-secondary/10 text-secondary py-3 rounded-lg font-medium hover:bg-secondary/20 transition-all duration-200"
                        >
                            Volver al inicio de sesión
                        </button>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                        <p className="text-xs text-text-muted text-center">
                            ¿Problemas con la verificación?{' '}
                            <Link
                                href="/contact"
                                className="text-primary hover:text-primary-dark font-medium"
                            >
                                Contáctanos
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-6 text-center">
                    <p className="text-xs text-text-muted">
                        💡 Revisa tu carpeta de spam si no encuentras el email
                    </p>
                </div>
            </div>
        </div>
    );
}