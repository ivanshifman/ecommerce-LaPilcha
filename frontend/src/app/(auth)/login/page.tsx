'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { loginSchema, type LoginFormData } from '../../../schemas/auth.schema';
import { FormInput } from '../../../components/forms/FormInput';
import { OAuthButtons } from '../../../components/auth/OAuthButtons';
import { useAuthActions } from '../../../store/authStore';
import { showSuccess, showError } from '../../../lib/notifications';
import type { ApiErrorResponse } from '../../../api/types/apiErrorResponse.interface';

export default function LoginPage() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { login } = useAuthActions();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
    });

    const onSubmit = async (data: LoginFormData) => {
        setIsLoading(true);

        try {
            await login(data);
            showSuccess('¡Bienvenido de vuelta!');

            const from = searchParams.get('from') || '/';
            router.push(from);
        } catch (err) {
            const error = err as AxiosError<ApiErrorResponse>;
            const errorData = error.response?.data;
            const errorMessage = errorData?.message || 'Error al iniciar sesión. Verifica tus credenciales.';

            if (errorData?.statusCode === 403 && errorMessage.toLowerCase().includes('verificado')) {
                showError('Debes verificar tu email antes de iniciar sesión');
                router.push('/verify-email-notice');
            } else {
                showError(errorMessage);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo y título */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Bienvenido de vuelta
                    </h1>
                    <p className="text-text-muted">
                        Inicia sesión para continuar
                    </p>
                </div>

                {/* Formulario */}
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
                            <Link
                                href="/forgot-password"
                                className="text-primary hover:text-primary-dark transition-colors"
                            >
                                ¿Olvidaste tu contraseña?
                            </Link>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
                            {isLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-border" />
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-white text-text-muted">O continúa con</span>
                        </div>
                    </div>

                    {/* OAuth Buttons */}
                    <OAuthButtons />

                    {/* Link a registro */}
                    <p className="mt-6 text-center text-sm text-text-muted">
                        ¿No tienes cuenta?{' '}
                        <Link
                            href="/register"
                            className="text-primary hover:text-primary-dark font-medium transition-colors"
                        >
                            Regístrate aquí
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}