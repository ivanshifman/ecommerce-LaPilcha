'use client';

import Link from 'next/link';
import { useProducts } from '../../store/productStore';
import { genderLabels } from '../../utils/genderLabels';

export function CategoryBanners() {
    const { genders } = useProducts();

    const genderIcons: Record<string, string> = {
        male: '👔',
        female: '👗',
        unisex: '👕',
        kid: '🧸',
    };

    const genderColors: Record<string, string> = {
        male: 'from-blue-50 to-blue-100',
        female: 'from-pink-50 to-pink-100',
        unisex: 'from-purple-50 to-purple-100',
        kid: 'from-yellow-50 to-yellow-100',
    };

    if (genders.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-12">
                <h2 className="text-3xl font-bold text-text-primary mb-3">
                    Comprá por Categoría
                </h2>
                <p className="text-text-muted">
                    Encontrá lo que buscás según tu estilo
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {genders.map((gender) => (
                    <Link
                        key={gender}
                        href={`/products?gender=${gender}`}
                        className="group relative overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300"
                    >
                        <div className={`h-64 bg-linear-to-br ${genderColors[gender] || 'from-gray-50 to-gray-100'} flex flex-col items-center justify-center p-6 transition-transform duration-300 group-hover:scale-105`}>
                            <div className="text-6xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                {genderIcons[gender] || '🛍️'}
                            </div>
                            <h3 className="text-2xl font-bold text-text-primary mb-2">
                                {genderLabels[gender as keyof typeof genderLabels] || gender}
                            </h3>
                            <p className="text-text-muted text-sm text-center">
                                Explorá nuestra colección
                            </p>
                            <div className="mt-4 inline-flex items-center text-primary font-medium group-hover:gap-2 transition-all">
                                <span>Ver más</span>
                                <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                ))}
            </div>
        </section>
    );
}