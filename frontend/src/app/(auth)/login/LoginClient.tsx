'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { loginSchema, type LoginFormData } from '../../../schemas/auth.schema';
import { FormInput } from '../../../components/forms/FormInput';
import { OAuthButtons } from '../../../components/auth/OAuthButtons';
import { useAuthActions } from '../../../store/authStore';
import { showSuccess, showError } from '../../../lib/notifications';
import { handleApiError } from '../../../api/error-handler';

export default function LoginClient({ from }: { from?: string }) {
    const router = useRouter();
    const { login } = useAuthActions();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            await login(data);
            showSuccess('¡Bienvenido de vuelta!');

            const fromPath = from || '/';
            router.push(fromPath);
        } catch (err) {
            const apiError = handleApiError(err);

            if (
                apiError.statusCode === 401 &&
                apiError.message.toLowerCase().includes('email no verificado')
            ) {
                showError('Debes verificar tu email antes de iniciar sesión');

                const email = getValues('email');
                if (typeof window !== 'undefined') {
                    sessionStorage.setItem('pendingVerificationEmail', email);
                }

                setTimeout(() => {
                    router.push('/verify-email-notice');
                }, 1500);
            } else if (
                apiError.statusCode === 401 &&
                (apiError.message.toLowerCase().includes('credenciales') ||
                    apiError.message.toLowerCase().includes('contraseña') ||
                    apiError.message.toLowerCase().includes('usuario'))
            ) {
                showError('Email o contraseña incorrectos');
            } else {
                showError(apiError.message || 'Error al iniciar sesión. Intenta nuevamente.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Bienvenido de vuelta
                    </h1>
                    <p className="text-text-muted">
                        Inicia sesión para continuar
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <FormInput
                            label="Email"
                            type="email"
                            placeholder="tu@email.com"
                            error={errors.email?.message}
                            {...register('email')}
                        />

                        <FormInput
                            label="Contraseña"
                            type="password"
                            placeholder="••••••••"
                            showPasswordToggle
                            error={errors.password?.message}
                            {...register('password')}
                        />

                        <div className="flex items-center justify-between text-sm">
                            <Link href="/forgot-password">
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button type="submit" disabled={isLoading}>
                            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    <OAuthButtons />
                </div>
            </div>
        </div>
    );
}