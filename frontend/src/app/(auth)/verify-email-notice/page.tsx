'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Mail, AlertCircle } from 'lucide-react';

export default function VerifyEmailNoticePage() {
    const searchParams = useSearchParams();
    const email = searchParams.get('email');

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block mb-4">
                        <Image
                            src="/LOGO_LA_PILCHA.png"
                            alt="La Pilcha"
                            width={120}
                            height={120}
                            className="mx-auto"
                        />
                    </Link>
                </div>

                {/* Contenido */}
                <div className="bg-white rounded-2xl shadow-lg p-8 border border-border text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-warning/10 rounded-full mb-4">
                        <AlertCircle className="w-8 h-8 text-warning" />
                    </div>

                    <h1 className="text-2xl font-bold text-text-primary mb-2">
                        Email no verificado
                    </h1>

                    <p className="text-text-muted mb-6">
                        Debes verificar tu dirección de email para acceder a todas las funciones de La Pilcha.
                    </p>

                    <div className="bg-accent/30 rounded-lg p-4 mb-6">
                        <div className="flex items-center justify-center gap-2 text-text-secondary">
                            <Mail className="w-5 h-5" />
                            <p className="text-sm font-medium">{email}</p>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <p className="text-sm text-text-muted">
                            Revisa tu bandeja de entrada y busca el email de verificación.
                        </p>

                        <p className="text-sm text-text-muted">
                            ¿No encuentras el email?{' '}
                            <Link
                                href="/verify-email"
                                className="text-primary hover:text-primary-dark font-medium transition-colors"
                            >
                                Solicita un nuevo código
                            </Link>
                        </p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-border">
                        <Link
                            href="/"
                            className="text-sm text-text-muted hover:text-text-primary transition-colors"
                        >
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}