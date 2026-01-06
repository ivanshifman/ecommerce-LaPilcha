'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useProductActions } from '../../store/productStore';

interface CategoryDropdownProps {
    gender: string;
    label: string;
    openGender: string | null;
    setOpenGender: (g: string | null) => void;
}

export function CategoryDropdown({ gender, label, openGender, setOpenGender }: CategoryDropdownProps) {
    const isOpen = openGender === gender;
    const [categories, setCategories] = useState<string[]>([]);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [loadingCategories, setLoadingCategories] = useState(false);
    const [loadingSubcats, setLoadingSubcats] = useState(false);

    const { fetchCategoriesByGender, fetchSubcategories } = useProductActions();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen && categories.length === 0) {
            setLoadingCategories(true);
            fetchCategoriesByGender(gender)
                .then(setCategories)
                .catch((error) => {
                    console.error('Failed to fetch categories:', error);
                    setCategories([]);
                })
                .finally(() => setLoadingCategories(false));
        }
    }, [isOpen, gender, categories.length, fetchCategoriesByGender]);

    const handleMouseEnter = () => {
        setOpenGender(gender);
    };

    const handleMouseLeave = () => {
        setOpenGender(null);
        setActiveCategory(null);
        setSubcategories([]);
    };

    const handleCategoryHover = async (categorySlug: string) => {
        if (categorySlug === activeCategory) return;

        setActiveCategory(categorySlug);
        setLoadingSubcats(true);

        try {
            const subs = await fetchSubcategories(categorySlug);
            setSubcategories(subs);
        } catch (error) {
            console.error('Failed to fetch subcategories:', error);
            setSubcategories([]);
        } finally {
            setLoadingSubcats(false);
        }
    };

    return (
        <div
            ref={dropdownRef}
            className="relative"
            onMouseEnter={handleMouseEnter}
        >
            {/* Trigger */}
            <button className="flex items-center gap-1 px-4 py-2 text-text-muted hover:text-primary transition-colors font-medium">
                {label}
                <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''
                        }`}
                />
            </button>

            {isOpen && (
                <>
                    <div className="absolute left-0 top-full h-3 w-full bg-transparent" />
                    <div className="absolute left-0 top-full bg-white shadow-lg border border-border rounded-l-xl rounded-r-none z-50 transition-all duration-200 ease-out data-[open=false]:opacity-0 data-[open=false]:translate-y-1" data-open={isOpen} onMouseLeave={handleMouseLeave}>
                        <div className="relative flex">
                            {/* LEFT - Categories */}
                            <div className="w-[280px] rounded-l-xl">
                                {loadingCategories ? (
                                    <div className="p-6">
                                        <div className="h-8 bg-gray-200 animate-pulse rounded mb-2" />
                                        <div className="h-8 bg-gray-200 animate-pulse rounded mb-2" />
                                        <div className="h-8 bg-gray-200 animate-pulse rounded" />
                                    </div>
                                ) : categories.length > 0 ? (
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

                            {/* RIGHT - Subcategories (SIDE PANEL) */}
                            {activeCategory && (
                                <div
                                    className="absolute left-full top-0 w-[340px] h-full bg-white shadow-lg rounded-r-xl border border-border opacity-100 translate-x-0 transition-all duration-200 ease-out"
                                >
                                    <div className="p-6">
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
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}