'use client';

import { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { showSuccess, showError } from '../lib/notifications';
import { useAuthActions } from '../store/authStore';
import { useProductActions, useProducts } from '../store/productStore';
import { HeroBanner } from '../components/home/HeroBanner';
import { CategoryBanners } from '../components/home/CategoryBanners';
import { FeaturedProducts } from '../components/home/FeaturedProducts';
import { PromoBanners } from '../components/home/PromoBanners';

export default function HomePage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { checkAuth } = useAuthActions();
  const { featuredProducts, isLoading } = useProducts();
  const { fetchFeatured, fetchGenders } = useProductActions();

  useEffect(() => {
    fetchFeatured().catch(console.error);
    fetchGenders().catch(console.error);
  }, [fetchFeatured, fetchGenders]);

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
    <div className="min-h-screen bg-background">
      <HeroBanner />

      <PromoBanners />

      <CategoryBanners />

      <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
            Productos Destacados
          </h2>
          <p className="text-text-muted text-lg max-w-2xl mx-auto">
            Descubrí nuestra selección especial de productos más vendidos y mejor valorados
          </p>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </div>
        ) : (
          <FeaturedProducts products={featuredProducts} />
        )}
      </section>

      <section className="bg-accent/30 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Calidad Garantizada
              </h3>
              <p className="text-text-muted text-sm">
                Productos de primera calidad con garantía de satisfacción
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Pago Seguro
              </h3>
              <p className="text-text-muted text-sm">
                Métodos de pago seguros y protegidos
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Envío Rápido
              </h3>
              <p className="text-text-muted text-sm">
                Entrega rápida en todo el país
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}