'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { AxiosError } from 'axios';
import { registerSchema, type RegisterFormData } from '../../../schemas/auth.schema';
import { FormInput } from '../../../components/forms/FormInput';
import { OAuthButtons } from '../../../components/auth/OAuthButtons';
import { useAuthActions } from '../../../store/authStore';
import { showSuccess, showError } from '../../../lib/notifications';
import type { ApiErrorResponse } from '../../../api/types/apiErrorResponse.interface';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { lastName, confirmPassword: _, ...registerData } = data;
      
      const response = await registerUser({
        ...registerData,
        lastName: lastName || undefined,
      });

      showSuccess('¡Cuenta creada! Revisa tu email para verificar.');
      
      setTimeout(() => {
        router.push(`/verify-email?userId=${response.userId}`);
      }, 1500);
    } catch (err) {
      const error = err as AxiosError<ApiErrorResponse>;
      const errorMessage = error.response?.data?.message || 
        'Error al crear la cuenta. Por favor, intenta nuevamente.';
      showError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo y título */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Crear cuenta
          </h1>
          <p className="text-text-muted">
            Únete a La Pilcha
          </p>
        </div>

        {/* Formulario */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              label="Nombre"
              type="text"
              placeholder="Nombre"
              error={errors.name?.message}
              {...register('name')}
            />

            <FormInput
              label="Apellido (opcional)"
              type="text"
              placeholder="Apellido"
              error={errors.lastName?.message}
              {...register('lastName')}
            />

            <FormInput
              label="Email"
              type="email"
              placeholder="nombre@gmail.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <FormInput
              label="Teléfono (opcional)"
              type="tel"
              placeholder="+54 9 11 1234-5678"
              error={errors.phone?.message}
              {...register('phone')}
            />

            <FormInput
              label="Contraseña"
              type="password"
              placeholder="••••••••"
              showPasswordToggle
              error={errors.password?.message}
              {...register('password')}
            />

            <FormInput
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              showPasswordToggle
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            <p className="text-xs text-text-muted">
              Al registrarte, aceptas nuestros{' '}
              <Link href="/terms" className="text-primary hover:underline">
                Términos y Condiciones
              </Link>{' '}
              y{' '}
              <Link href="/privacy" className="text-primary hover:underline">
                Política de Privacidad
              </Link>
            </p>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
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

          {/* Link a login */}
          <p className="mt-6 text-center text-sm text-text-muted">
            ¿Ya tienes cuenta?{' '}
            <Link
              href="/login"
              className="text-primary hover:text-primary-dark font-medium transition-colors"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}