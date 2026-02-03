'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Home, RefreshCw, AlertTriangle, ArrowLeft } from 'lucide-react';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        console.error('Error capturado:', error);
    }, [error]);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center px-4 py-12">
            <div className="max-w-2xl w-full">
                <div className="bg-white border border-border rounded-2xl shadow-lg p-6 sm:p-8 md:p-12">
                    <div className="flex flex-col items-center mb-8">
                        <div className="relative mb-6">
                            <div className="absolute inset-0 bg-destructive/10 rounded-full blur-2xl animate-pulse" />
                            <div className="relative bg-destructive/5 p-6 sm:p-8 rounded-full border-4 border-destructive/20">
                                <AlertTriangle className="w-16 h-16 sm:w-20 sm:h-20 text-destructive" />
                            </div>
                        </div>

                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-destructive mb-4 tracking-tight">
                            ¡Oops!
                        </h1>

                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text-primary mb-3 text-center">
                            Algo salió mal
                        </h2>

                        <p className="text-sm sm:text-base text-text-muted text-center max-w-md leading-relaxed">
                            Lo sentimos, ocurrió un error inesperado. Podés intentar nuevamente o volver al inicio.
                        </p>
                    </div>

                    {process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENVIRONMENT === 'development' && (
                        <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-4 mb-6">
                            <p className="text-xs font-mono text-destructive break-all">
                                {error.message}
                            </p>
                            {error.digest && (
                                <p className="text-xs text-text-muted mt-2">
                                    Error ID: {error.digest}
                                </p>
                            )}
                        </div>
                    )}

                    <div className="bg-accent rounded-xl p-4 sm:p-6 mb-8">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                            <div>
                                <h3 className="font-semibold text-text-primary mb-2 text-sm sm:text-base">
                                    ¿Qué puedo hacer?
                                </h3>
                                <ul className="space-y-2 text-xs sm:text-sm text-text-secondary">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>Intentá recargar la página</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>Verificá tu conexión a internet</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary mt-1">•</span>
                                        <span>Si el problema persiste, contactanos</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                        <button
                            onClick={reset}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-all duration-200 shadow-md hover:shadow-lg group"
                        >
                            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
                            <span>Intentar nuevamente</span>
                        </button>

                        <Link
                            href="/"
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary/5 transition-all duration-200 group"
                        >
                            <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
                            <span>Volver al inicio</span>
                        </Link>
                    </div>

                    <div className="mt-6 text-center">
                        <button
                            onClick={() => window.history.back()}
                            className="inline-flex items-center gap-2 text-sm text-text-muted hover:text-primary transition-colors group"
                        >
                            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                            <span>Volver a la página anterior</span>
                        </button>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
                    <Link
                        href="/products"
                        className="p-4 bg-white border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 text-center group"
                    >
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                            👕
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-text-primary">
                            Productos
                        </p>
                    </Link>

                    <Link
                        href="/about"
                        className="p-4 bg-white border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 text-center group"
                    >
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                            ℹ️
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-text-primary">
                            Sobre nosotros
                        </p>
                    </Link>

                    <Link
                        href="/contact"
                        className="p-4 bg-white border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 text-center group"
                    >
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                            ✉️
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-text-primary">
                            Contacto
                        </p>
                    </Link>

                    <Link
                        href="/cart"
                        className="p-4 bg-white border border-border rounded-lg hover:border-primary hover:shadow-md transition-all duration-200 text-center group"
                    >
                        <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">
                            🛒
                        </div>
                        <p className="text-xs sm:text-sm font-medium text-text-primary">
                            Mi carrito
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}