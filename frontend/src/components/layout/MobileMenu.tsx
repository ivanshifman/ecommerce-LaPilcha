'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
    X,
    ChevronLeft,
    ChevronRight,
    User,
    LogOut,
    LogIn,
    UserPlus,
    HelpCircle,
    Phone,
    Truck,
    Handbag,
} from 'lucide-react';
import { useProductActions, useProducts } from '../../store/productStore';
import { genderLabels } from '../../utils/genderLabels';
import { useAuth, useAuthActions } from '../../store/authStore';
import { showSuccess } from '../../lib/notifications';

interface Props {
    open: boolean;
    onClose: () => void;
}

type Level = 'root' | 'products' | 'gender' | 'category';

export function MobileMenu({ open, onClose }: Props) {
    const { genders } = useProducts();
    const { fetchCategoriesByGender, fetchSubcategories } =
        useProductActions();

    const { user, isAuthenticated } = useAuth();
    const { logout } = useAuthActions();

    const [level, setLevel] = useState<Level>('root');
    const [activeGender, setActiveGender] = useState<string | null>(null);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    const [categories, setCategories] = useState<string[]>([]);
    const [subcategories, setSubcategories] = useState<string[]>([]);

    useEffect(() => {
        if (!open) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setLevel('root');
            setActiveGender(null);
            setActiveCategory(null);
            setCategories([]);
            setSubcategories([]);
        }
    }, [open]);

    useEffect(() => {
        if (activeGender) {
            fetchCategoriesByGender(activeGender).then(setCategories);
        }
    }, [activeGender, fetchCategoriesByGender]);

    useEffect(() => {
        if (activeCategory) {
            fetchSubcategories(activeCategory).then(setSubcategories);
        }
    }, [activeCategory, fetchSubcategories]);

    const handleBack = () => {
        if (level === 'category') {
            setLevel('gender');
            setActiveCategory(null);
            setSubcategories([]);
        } else if (level === 'gender') {
            setLevel('products');
            setActiveGender(null);
            setCategories([]);
        } else {
            setLevel('root');
        }
    };

    return (
        <AnimatePresence>
            {open && (
                <>
                    <motion.div
                        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                    />

                    <motion.div
                        className="fixed inset-y-0 left-0 z-50 w-full bg-background flex flex-col"
                        initial={{ x: '-100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '-100%' }}
                        transition={{ duration: 0.3, ease: 'easeOut' }}
                    >
                        <div className="flex items-center justify-between px-4 py-4 border-b border-border">
                            {level !== 'root' ? (
                                <button
                                    onClick={handleBack}
                                    className="p-2 rounded-full hover:bg-accent"
                                    aria-label="Volver"
                                    title='Volver'
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                            ) : (
                                <span />
                            )}

                            <div className="relative overflow-hidden h-6 flex-1 ml-2">
                                <AnimatePresence mode="wait">
                                    <motion.span
                                        key={level}
                                        className="absolute left-0 text-sm font-semibold uppercase flex items-center"
                                        initial={{ opacity: 0, y: 8 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -8 }}
                                        transition={{ duration: 0.25, ease: 'easeOut' }}
                                    >
                                        {level === 'root' &&
                                            (isAuthenticated ? 'Mi perfil' : 'Bienvenido')}
                                        {level === 'products' && 'Productos'}
                                        {level === 'gender' && genderLabels[activeGender! as keyof typeof genderLabels]}
                                        {level === 'category' && activeCategory}
                                    </motion.span>
                                </AnimatePresence>
                            </div>

                            <button
                                onClick={onClose}
                                className="p-2 rounded-full hover:bg-accent"
                                aria-label='Cerrar menú'
                                title='Cerrar menú'
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto px-4 py-6 relative">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={level}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.25, ease: 'easeOut' }}
                                >
                                    {level === 'root' && (
                                        <ul className="space-y-5 text-lg">
                                            {!isAuthenticated ? (
                                                <>
                                                    <li>
                                                        <Link href="/login" onClick={onClose} className="flex items-center gap-3">
                                                            <LogIn className="w-5 h-5" /> Iniciar sesión
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <Link href="/register" onClick={onClose} className="flex items-center gap-3">
                                                            <UserPlus className="w-5 h-5" /> Crear cuenta
                                                        </Link>
                                                    </li>
                                                </>
                                            ) : (
                                                <>
                                                    <li className="flex items-center gap-3 font-medium">
                                                        <User className="w-5 h-5" /> {user?.email}
                                                    </li>
                                                    <li>
                                                        <Link href="/profile" onClick={onClose} className="flex items-center gap-3">
                                                            <User className="w-5 h-5" /> Mi cuenta
                                                        </Link>
                                                    </li>
                                                    <li>
                                                        <button
                                                            onClick={async () => {
                                                                await logout();
                                                                onClose();
                                                                showSuccess('Se ha cerrado la sesión exitosamente.');
                                                            }}
                                                            className="flex items-center gap-3 text-red-500"
                                                        >
                                                            <LogOut className="w-5 h-5" /> Cerrar sesión
                                                        </button>
                                                    </li>
                                                </>
                                            )}

                                            <hr />

                                            <li>
                                                <button
                                                    onClick={() => setLevel('products')}
                                                    className="flex w-full items-center justify-between"
                                                >
                                                    <span className="flex items-center gap-3">
                                                        <Handbag className="w-5 h-5" />
                                                        <span>Productos</span>
                                                    </span>
                                                    <ChevronRight className="w-4 h-4" />
                                                </button>
                                            </li>


                                            <li>
                                                <Link href="/contact" onClick={onClose} className="flex items-center gap-3">
                                                    <Phone className="w-5 h-5" /> Contacto
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/faq" onClick={onClose} className="flex items-center gap-3">
                                                    <HelpCircle className="w-5 h-5" /> Preguntas frecuentes
                                                </Link>
                                            </li>
                                            <li>
                                                <Link href="/orders" onClick={onClose} className="flex items-center gap-3">
                                                    <Truck className="w-5 h-5" /> Seguimiento de pedidos
                                                </Link>
                                            </li>
                                        </ul>
                                    )}

                                    {level === 'products' && (
                                        <ul className="space-y-5 text-lg">
                                            <li>
                                                <Link
                                                    href="/products"
                                                    onClick={onClose}
                                                    className="text-sm text-primary uppercase"
                                                >
                                                    Ver todos los productos
                                                </Link>
                                            </li>

                                            {genders.map((gender) => (
                                                <li key={gender}>
                                                    <button
                                                        onClick={() => {
                                                            setActiveGender(gender);
                                                            setLevel('gender');
                                                        }}
                                                        className="flex w-full justify-between capitalize"
                                                    >
                                                        {genderLabels[gender as keyof typeof genderLabels] || gender}
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                    {level === 'gender' && activeGender && (
                                        <ul className="space-y-5 text-lg">
                                            <li>
                                                <Link
                                                    href={`/products?gender=${activeGender}`}
                                                    onClick={onClose}
                                                    className="text-sm text-primary uppercase"
                                                >
                                                    Ver todo {genderLabels[activeGender as keyof typeof genderLabels]}
                                                </Link>
                                            </li>

                                            {categories.map((cat) => (
                                                <li key={cat}>
                                                    <button
                                                        onClick={() => {
                                                            setActiveCategory(cat);
                                                            setLevel('category');
                                                        }}
                                                        className="flex w-full justify-between capitalize"
                                                    >
                                                        {cat}
                                                        <ChevronRight className="w-4 h-4" />
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}

                                    {level === 'category' && activeCategory && (
                                        <ul className="space-y-5 text-lg">
                                            <li>
                                                <Link
                                                    href={`/products?gender=${activeGender}&category=${activeCategory}`}
                                                    onClick={onClose}
                                                    className="text-sm text-primary uppercase"
                                                >
                                                    Ver todo {activeCategory}
                                                </Link>
                                            </li>

                                            {subcategories.map((sub) => (
                                                <li key={sub}>
                                                    <Link
                                                        href={`/products?gender=${activeGender}&category=${activeCategory}&subcategory=${sub}`}
                                                        onClick={onClose}
                                                        className="capitalize"
                                                    >
                                                        {sub}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </motion.div>
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )
            }
        </AnimatePresence >
    );
}
