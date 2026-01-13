'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Lock, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { resetPasswordSchema, type ResetPasswordFormData } from '../../../schemas/auth.schema';
import { FormInput } from '../../../components/forms/FormInput';
import { authService } from '../../../services/auth.service';
import { showSuccess, showError } from '../../../lib/notifications';
import { handleApiError } from '../../../api/error-handler';

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState('');
  const [tokenError, setTokenError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    if (!tokenParam) {
      setTokenError('Token de recuperación no encontrado');
      return;
    }
    setToken(tokenParam);
  }, [searchParams]);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      showError('Token de recuperación inválido');
      return;
    }

    setIsLoading(true);

    try {
      await authService.resetPassword({
        token,
        newPassword: data.password,
      });
      
      setIsSuccess(true);
      showSuccess('Contraseña actualizada exitosamente');
      
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } catch (err) {
      const apiError = handleApiError(err);
      showError(apiError.message || 'Error al restablecer la contraseña. El enlace puede haber expirado.');
    } finally {
      setIsLoading(false);
    }
  };

  if (tokenError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Enlace inválido
            </h1>
            <p className="text-text-muted">
              El enlace de recuperación no es válido
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
            <div className="space-y-4 mb-6">
              <p className="text-center text-text-primary">
                El enlace que intentas usar no es válido o ha expirado.
              </p>
              <div className="p-4 bg-accent/30 rounded-lg">
                <p className="text-sm text-text-muted text-center">
                  Los enlaces de recuperación expiran después de 1 hora por seguridad.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/forgot-password')}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200"
              >
                Solicitar nuevo enlace
              </button>

              <Link
                href="/login"
                className="block w-full text-center text-text-muted hover:text-primary text-sm transition-colors py-2"
              >
                Volver al inicio de sesión
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              ¡Contraseña actualizada!
            </h1>
            <p className="text-text-muted">
              Ya puedes iniciar sesión con tu nueva contraseña
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800 text-center">
                  Tu contraseña ha sido actualizada exitosamente. Serás redirigido al inicio de sesión en unos segundos...
                </p>
              </div>
            </div>

            <button
              onClick={() => router.push('/login')}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200"
            >
              Ir al inicio de sesión
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <Lock className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            Nueva contraseña
          </h1>
          <p className="text-text-muted">
            Crea una contraseña segura para tu cuenta
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Info Box */}
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-sm text-text-muted">
                <strong>Tu contraseña debe tener:</strong>
              </p>
              <ul className="text-xs text-text-muted mt-2 space-y-1 list-disc list-inside">
                <li>Al menos 8 caracteres</li>
                <li>Una letra mayúscula</li>
                <li>Una letra minúscula</li>
                <li>Un número</li>
              </ul>
            </div>

            {/* Password Input */}
            <FormInput
              label="Nueva contraseña"
              type="password"
              placeholder="••••••••"
              showPasswordToggle
              error={errors.password?.message}
              {...register('password')}
            />

            {/* Confirm Password Input */}
            <FormInput
              label="Confirmar contraseña"
              type="password"
              placeholder="••••••••"
              showPasswordToggle
              error={errors.confirmPassword?.message}
              {...register('confirmPassword')}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? 'Actualizando...' : 'Actualizar contraseña'}
            </button>
          </form>

          {/* Back to Login */}
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