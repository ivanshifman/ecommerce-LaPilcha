'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { User, LogOut, Package, Heart, Settings } from 'lucide-react';
import { useAuth, useAuthActions } from '../../store/authStore';
import { showError, showSuccess } from '../../lib/notifications';

interface UserMenuProps {
    onOpen?: () => void;
    isOpen?: boolean;
    onClose?: () => void;
}

export function UserMenu({ onOpen, isOpen: externalIsOpen, onClose: externalOnClose }: UserMenuProps) {
    const { isAuthenticated, user } = useAuth();
    const { logout } = useAuthActions();
    const router = useRouter();
    const [internalIsOpen, setInternalIsOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const isOpen = externalIsOpen !== undefined ? externalIsOpen : internalIsOpen;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                if (externalOnClose) {
                    externalOnClose();
                } else {
                    setInternalIsOpen(false);
                }
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [isOpen, externalOnClose]);

    const handleToggle = () => {
        const newState = !isOpen;
        
        if (externalOnClose !== undefined) {
            if (newState) {
                onOpen?.();
                window.dispatchEvent(new Event('navbar-menu-open'));
            } else {
                externalOnClose();
            }
        } else {
            setInternalIsOpen(newState);
            if (newState) {
                onOpen?.();
                window.dispatchEvent(new Event('navbar-menu-open'));
            }
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
            if (externalOnClose) {
                externalOnClose();
            } else {
                setInternalIsOpen(false);
            }
            router.push('/');
            showSuccess('Se ha cerrado la sesión exitosamente.');
        } catch (error) {
            console.error('Logout failed:', error);
            showError('Error al cerrar la sesión.');
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
                onClick={handleToggle}
                className="p-2 hover:bg-accent rounded-full transition-colors cursor-pointer"
                aria-label="Menú de usuario"
            >
                {user?.avatar ? (
                    <Image
                        src={user.avatar}
                        alt={user.name}
                        width={32}
                        height={32}
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
                            onClick={() => {
                                if (externalOnClose) {
                                    externalOnClose();
                                } else {
                                    setInternalIsOpen(false);
                                }
                            }}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-text-secondary"
                        >
                            <Settings className="w-4 h-4" />
                            Mi Perfil
                        </Link>

                        <Link
                            href="/orders"
                            onClick={() => {
                                if (externalOnClose) {
                                    externalOnClose();
                                } else {
                                    setInternalIsOpen(false);
                                }
                            }}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-text-secondary"
                        >
                            <Package className="w-4 h-4" />
                            Mis Órdenes
                        </Link>

                        <Link
                            href="/wishlist"
                            onClick={() => {
                                if (externalOnClose) {
                                    externalOnClose();
                                } else {
                                    setInternalIsOpen(false);
                                }
                            }}
                            className="flex items-center gap-3 px-4 py-2 hover:bg-accent transition-colors text-text-secondary"
                        >
                            <Heart className="w-4 h-4" />
                            Lista de Deseos
                        </Link>
                    </div>

                    <div className="border-t border-border">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-red-50 transition-colors text-red-600 cursor-pointer"
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