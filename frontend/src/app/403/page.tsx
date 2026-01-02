'use client';

import Link from 'next/link';
import { useAuth } from '../../store/authStore';

export default function ForbiddenPage() {
    const { user } = useAuth();

    return (
        <div className="flex min-h-screen items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900">403</h1>
                <p className="mt-4 text-xl text-gray-600">Acceso Denegado</p>
                <p className="mt-2 text-gray-500">
                    No tienes permisos para acceder a esta página.
                </p>
                {user && (
                    <p className="mt-2 text-sm text-gray-400">
                        Tu rol actual: <span className="font-semibold">{user.role}</span>
                    </p>
                )}
                <Link
                    href="/"
                    className="mt-8 inline-block rounded-md bg-blue-600 px-6 py-3 text-white hover:bg-blue-700"
                >
                    Volver al Inicio
                </Link>
            </div>
        </div>
    );
}