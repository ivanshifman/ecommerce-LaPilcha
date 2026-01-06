'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, LogOut, Package, Heart, Settings } from 'lucide-react';
import { useAuth, useAuthActions } from '../../store/authStore';

export function UserMenu() {
    const { isAuthenticated, user } = useAuth();
    const { logout } = useAuthActions();
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            setIsOpen(false);
            router.push('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    if (!isAuthenticated) {
        return (
            <Link
                href="/login"
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Iniciar sesión"
            >
                <User className="w-5 h-5 text-text-muted" />
            </Link>
        );
    }

    return (
        <div ref={menuRef} className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 hover:bg-accent rounded-full transition-colors"
                aria-label="Menú de usuario"
            >
                {user?.avatar ? (
                    <Image
                        src={user.avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover"
                    />
                ) : (
                    <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                            {user?.name.charAt(0).toUpperCase()}
                        </span>
                    </div>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 top-full mt-2 w-56 bg-white shadow-lg rounded-lg border border-border overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-border">
                        <p className="font-medium text-text-primary truncate">{user?.name}</p>
                        <p className="text-sm text-text-muted truncate">{user?.email}</p>
                    </div>

                    <div className="py-2">
                        <Link
                            href="/profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-text-secondary"
                        >
                            <Settings className="w-4 h-4" />
                            Mi Perfil
                        </Link>

                        <Link
                            href="/orders"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-text-secondary"
                        >
                            <Package className="w-4 h-4" />
                            Mis Órdenes
                        </Link>

                        <Link
                            href="/wishlist"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-text-secondary"
                        >
                            <Heart className="w-4 h-4" />
                            Lista de Deseos
                        </Link>
                    </div>

                    <div className="border-t border-border">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}