'use client';

import Link from 'next/link';
import { ProductCard } from '../products/ProductCard';
import { useAuth } from '../../store/authStore';
import type { Product } from '../../types/product.types';

interface Props {
  products: Product[];
}

export function FeaturedProducts({ products }: Props) {
  const { user } = useAuth();

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-text-muted">No hay productos destacados disponibles</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {products.slice(0, 8).map((product) => (
          <ProductCard key={product.id} product={product} user={user} />
        ))}
      </div>

      <div className="text-center mt-12">
        <Link
          href="/products"
          className="inline-flex items-center gap-2 px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors"
        >
          Ver todos los productos
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </>
  );
}