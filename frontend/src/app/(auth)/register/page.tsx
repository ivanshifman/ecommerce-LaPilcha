'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Loader2 } from 'lucide-react';
import { registerSchema, type RegisterFormData } from '../../../schemas/auth.schema';
import { FormInput } from '../../../components/forms/FormInput';
import { PhoneInput } from '../../../components/forms/PhoneInput';
import { OAuthButtons } from '../../../components/auth/OAuthButtons';
import { useAuthActions } from '../../../store/authStore';
import { showSuccess, showError } from '../../../lib/notifications';
import { handleApiError } from '../../../api/error-handler';

export default function RegisterPage() {
  const router = useRouter();
  const { register: registerUser } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);

    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;

      const cleanedData = {
        ...registerData,
        lastName: registerData.lastName || undefined,
        phone: registerData.phone || undefined,
      };

      const response = await registerUser(cleanedData);

      showSuccess('¡Cuenta creada! Revisa tu email para verificar.');

      setTimeout(() => {
        router.push(`/verify-email?userId=${response.userId}`);
      }, 1500);
    } catch (err) {
      const apiError = handleApiError(err);
      showError(apiError.message || 'Error al crear la cuenta. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Crear cuenta
          </h1>
          <p className="text-text-muted">
            Únete a El Atahualpa
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <FormInput
              label="Nombre"
              type="text"
              placeholder="Juan"
              error={errors.name?.message}
              {...register('name')}
            />

            <FormInput
              label="Apellido (opcional)"
              type="text"
              placeholder="Pérez"
              error={errors.lastName?.message}
              {...register('lastName')}
            />

            <FormInput
              label="Email"
              type="email"
              placeholder="juan@ejemplo.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <Controller
              name="phone"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <PhoneInput
                  label="Teléfono (opcional)"
                  error={errors.phone?.message}
                  {...field}
                />
              )}
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

            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-xs text-text-muted">
                <strong>Requisitos de contraseña:</strong>
              </p>
              <ul className="text-xs text-text-muted mt-1 space-y-1 list-disc list-inside">
                <li>Mínimo 6 caracteres</li>
                <li>Una letra mayúscula</li>
                <li>Una letra minúscula</li>
                <li>Un número</li>
              </ul>
            </div>

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
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-text-muted">O continúa con</span>
            </div>
          </div>

          <OAuthButtons />

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