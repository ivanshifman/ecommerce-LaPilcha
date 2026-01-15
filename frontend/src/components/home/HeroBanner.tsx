'use client';

import Link from 'next/link';

export function HeroBanner() {
    return (
        <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-linear-to-br from-accent via-primary-light to-primary">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
                }} />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
                <div className="max-w-2xl">
                    <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-6 leading-tight">
                        Nueva Colección
                        <span className="block text-primary-dark">Primavera 2025</span>
                    </h1>
                    <p className="text-lg md:text-xl text-text-secondary mb-8 max-w-lg">
                        Descubrí las últimas tendencias en moda con nuestros productos de primera calidad
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <Link
                            href="/products"
                            className="inline-flex items-center justify-center px-8 py-3 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-all duration-200 shadow-lg hover:shadow-xl"
                        >
                            Ver productos
                        </Link>
                        <Link
                            href="/products?featured=true"
                            className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary font-medium rounded-lg hover:bg-accent transition-all duration-200 border-2 border-primary"
                        >
                            Destacados
                        </Link>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="hidden lg:block absolute right-10 top-1/2 -translate-y-1/2">
                    <div className="relative w-80 h-80">
                        <div className="absolute inset-0 bg-white/40 rounded-full blur-3xl" />
                        <div className="absolute inset-8 bg-primary/20 rounded-full blur-2xl animate-pulse" />
                    </div>
                </div>
            </div>
        </section>
    );
}