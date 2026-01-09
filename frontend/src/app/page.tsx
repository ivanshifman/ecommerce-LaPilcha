'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { showSuccess, showError } from '../lib/notifications';
import { useAuthActions } from '../store/authStore';

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { checkAuth } = useAuthActions();

  useEffect(() => {
    const authStatus = searchParams.get('auth');
    const error = searchParams.get('error');

    if (authStatus === 'success') {
      showSuccess('¡Inicio de sesión exitoso!');
      checkAuth().catch(console.error);

      router.replace('/');
    } else if (error === 'oauth_failed') {
      showError('Error al iniciar sesión con OAuth. Por favor, intenta nuevamente.');
      router.replace('/');
    }
  }, [searchParams, router, checkAuth]);

  return (
    <div>
      <h1>Bienvenido a La Pilcha</h1>
    </div>
  );
}