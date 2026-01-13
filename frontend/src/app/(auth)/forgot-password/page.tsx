'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { KeyRound, Loader2, CheckCircle2, ArrowLeft } from 'lucide-react';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../../../schemas/auth.schema';
import { FormInput } from '../../../components/forms/FormInput';
import { authService } from '../../../services/auth.service';
import { showSuccess, showError } from '../../../lib/notifications';
import { handleApiError } from '../../../api/error-handler';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [emailSent, setEmailSent] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    setIsLoading(true);

    try {
      await authService.forgotPassword(data);
      setIsSuccess(true);
      setEmailSent(data.email);
      showSuccess('Email enviado correctamente');
    } catch (err) {
      const apiError = handleApiError(err);
      showError(apiError.message || 'Error al enviar el email. Por favor, intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              ¡Email enviado!
            </h1>
            <p className="text-text-muted">
              Revisa tu bandeja de entrada
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
            <div className="space-y-4 mb-6">
              <p className="text-center text-text-primary">
                Hemos enviado un enlace de recuperación a
              </p>
              <p className="text-center font-semibold text-primary">
                {emailSent}
              </p>
              <div className="p-4 bg-accent/30 rounded-lg">
                <p className="text-sm text-text-muted text-center">
                  <strong>Próximos pasos:</strong>
                  <br />
                  1. Abre el email que te enviamos
                  <br />
                  2. Haz clic en el enlace de recuperación
                  <br />
                  3. Crea tu nueva contraseña
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => router.push('/login')}
                className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200"
              >
                Ir al inicio de sesión
              </button>

              <button
                onClick={() => setIsSuccess(false)}
                className="w-full text-text-muted hover:text-primary text-sm transition-colors"
              >
                ¿No recibiste el email? Intenta de nuevo
              </button>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-text-muted text-center">
                💡 Revisa tu carpeta de spam si no encuentras el email
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
            <KeyRound className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-text-primary mb-2">
            ¿Olvidaste tu contraseña?
          </h1>
          <p className="text-text-muted">
            No te preocupes, te ayudaremos a recuperarla
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-border">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="p-4 bg-accent/30 rounded-lg">
              <p className="text-sm text-text-muted text-center">
                Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña
              </p>
            </div>

            <FormInput
              label="Email"
              type="email"
              placeholder="tu@email.com"
              error={errors.email?.message}
              {...register('email')}
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white py-3 rounded-lg font-medium hover:bg-primary-dark transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading && <Loader2 className="w-5 h-5 animate-spin" />}
              {isLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm text-text-muted hover:text-primary transition-colors inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-text-muted">
            ¿Necesitas ayuda?{' '}
            <Link
              href="/contact"
              className="text-primary hover:text-primary-dark font-medium"
            >
              Contáctanos
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}