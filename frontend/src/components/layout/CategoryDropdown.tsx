'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { motion, AnimatePresence, easeOut, easeIn } from 'framer-motion';
import { useProductActions } from '../../store/productStore';

interface CategoryDropdownProps {
    gender: string;
    label: string;
    openGender: string | null;
    setOpenGender: (g: string | null) => void;
}

export function CategoryDropdown({ gender, label, openGender, setOpenGender }: CategoryDropdownProps) {
    const isOpen = openGender === gender;
    const { fetchCategoriesByGender, fetchSubcategories } = useProductActions();
    const dropdownRef = useRef<HTMLDivElement>(null);

    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [loadingSubcats, setLoadingSubcats] = useState(false);

    const cacheRef = useRef<Record<string, string[]>>({});

    useEffect(() => {
        const loadCategories = async () => {
            const cached = cacheRef.current[gender];
            if (cached) {
                setCategories(cached);
            } else {
                try {
                    const cats = await fetchCategoriesByGender(gender);
                    setCategories(cats);
                    cacheRef.current[gender] = cats;
                } catch {
                    setCategories([]);
                }
            }
        };
        loadCategories();
    }, [gender, fetchCategoriesByGender]);

    useEffect(() => {
        if (!isOpen) {
            setActiveCategory(null);
            setSubcategories([]);
        }
    }, [isOpen]);

    const handleMouseEnter = () => setOpenGender(gender);
    const handleMouseLeave = () => setOpenGender(null);

    const handleCategoryHover = async (categorySlug: string) => {
        if (categorySlug === activeCategory) return;

        setActiveCategory(categorySlug);
        setLoadingSubcats(true);

        const cacheKey = `${gender}_${categorySlug}`;

        if (cacheRef.current[cacheKey]) {
            setSubcategories(cacheRef.current[cacheKey]);
            setLoadingSubcats(false);
        } else {
            try {
                const subs = await fetchSubcategories(categorySlug);
                setSubcategories(subs);
                cacheRef.current[cacheKey] = subs;
            } catch (error) {
                console.error('Failed to fetch subcategories:', error);
                setSubcategories([]);
            } finally {
                setLoadingSubcats(false);
            }
        }
    };

    const dropdownVariants = {
        hidden: { opacity: 0, y: -10 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.2, ease: easeOut } },
        exit: { opacity: 0, y: -10, transition: { duration: 0.15, ease: easeIn } },
    };

    return (
        <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Trigger */}
            <button className="flex items-center gap-1 px-4 py-2 text-text-muted hover:text-primary transition-colors font-medium">
                {label}
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </button>

            {/* Dropdown completo con animación */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        key="dropdown"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute left-0 top-full bg-white shadow-lg border border-border rounded-l-xl rounded-r-none z-50 flex overflow-hidden"
                    >
                        {/* LEFT - Categories */}
                        <div className="w-[280px] rounded-l-xl border-r border-border">
                            {categories.length > 0 ? (
                                categories.map((category) => (
                                    <div key={category} onMouseEnter={() => handleCategoryHover(category)}>
                                        <Link
                                            href={`/products?gender=${gender}&category=${category}`}
                                            className={`block px-6 py-3 hover:bg-accent transition-colors capitalize ${activeCategory === category ? 'bg-accent' : ''
                                                }`}
                                        >
                                            <span className="font-medium text-text-muted">{category}</span>
                                        </Link>
                                    </div>
                                ))
                            ) : (
                                <div className="p-6 text-sm text-text-muted">Sin categorías</div>
                            )}
                        </div>

                        {/* RIGHT - Subcategories solo si hay hover en categoría */}
                        {activeCategory && (
                            <div className="relative w-[340px] min-h-[120px] bg-white shadow-lg rounded-r-xl border border-border overflow-hidden">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeCategory}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.25, ease: 'easeOut' }}
                                        className="absolute inset-0 p-6"
                                    >
                                        <p className="text-[11px] font-semibold tracking-widest text-text-muted uppercase mb-2">
                                            Subcategorías
                                        </p>
                                        <div className="h-px bg-border mb-4 opacity-60" />

                                        {loadingSubcats ? (
                                            <div className="space-y-2">
                                                <div className="h-8 bg-gray-200 animate-pulse rounded" />
                                                <div className="h-8 bg-gray-200 animate-pulse rounded" />
                                            </div>
                                        ) : subcategories.length > 0 ? (
                                            subcategories.map((sub) => (
                                                <Link
                                                    key={sub}
                                                    href={`/products?gender=${gender}&category=${activeCategory}&subcategory=${sub}`}
                                                    className="group flex items-center px-4 py-2 rounded-lg transition-all duration-200 text-text-secondary capitalize hover:bg-accent hover:text-primary"
                                                >
                                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    {sub}
                                                </Link>
                                            ))
                                        ) : (
                                            <p className="text-sm text-text-muted">Sin subcategorías</p>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
