'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
    AccordionItem,
    AccordionTrigger,
    AccordionContent,
} from '@/components/ui/accordion';
import { useProductActions } from '../../store/productStore';

interface Props {
    gender: string;
    label: string;
    isActive: boolean;
}

export function MobileGenderAccordion({ gender, label, isActive }: Props) {
    const { fetchCategoriesByGender, fetchSubcategories } = useProductActions();
    const [categories, setCategories] = useState<string[]>([]);
    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const [subcategories, setSubcategories] = useState<string[]>([]);

    useEffect(() => {
        fetchCategoriesByGender(gender).then(setCategories);
    }, [gender, fetchCategoriesByGender]);

    useEffect(() => {
        if (!isActive) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setOpenCategory(null);
            setSubcategories([]);
        }
    }, [isActive]);

    const handleCategory = async (category: string) => {
        if (openCategory === category) {
            setOpenCategory(null);
            return;
        }

        setOpenCategory(category);
        const subs = await fetchSubcategories(category);
        setSubcategories(subs);
    };

    return (
        <AccordionItem
            value={gender}
            className="border border-border rounded-xl overflow-hidden bg-white"
        >
            {/* HEADER */}
            <AccordionTrigger
                className="px-4 py-4 text-base font-semibold tracking-tight text-text-primary transition-all duration-300 ease-out hover:bg-accent active:scale-[0.98] data-[state=open]:bg-accent data-[state=open]:translate-y-px data-[state=open]:opacity-90"
            >
                {label}
            </AccordionTrigger>

            {/* CONTENIDO */}
            <AccordionContent className="px-4 overflow-hidden transition-all duration-300 ease-out data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up">
                <ul className="space-y-0 divide-y divide-text-muted/30">
                    {categories.map((cat) => (
                        <li key={cat} className="py-2">
                            {/* BOTÓN DE CATEGORÍA */}
                            <button
                                onClick={() => handleCategory(cat)}
                                className={`relative w-full flex justify-between items-center py-2 text-sm font-medium transition-colors capitalize ${openCategory === cat
                                        ? 'text-primary'
                                        : 'text-text-muted hover:text-text-primary'
                                    }`}
                            >
                                {cat}
                                <svg
                                    className={`w-4 h-4 transition-transform duration-200 ${openCategory === cat ? 'rotate-180' : ''
                                        }`}
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* SUBCATEGORÍAS */}
                            <div
                                className={`grid overflow-hidden transition-all duration-300 ease-out ${openCategory === cat
                                        ? 'grid-rows-[1fr] opacity-100 translate-y-0'
                                        : 'grid-rows-[0fr] opacity-0 -translate-y-1'
                                    }`}
                            >
                                <div className="overflow-hidden">
                                    {subcategories.length > 0 && (
                                        <div className="h-px bg-linear-to-r from-transparent via-primary/50 to-transparent my-2" />
                                    )}

                                    <ul className="pl-5 space-y-1 pb-2">
                                        {subcategories.map((sub) => (
                                            <li key={sub}>
                                                <Link
                                                    href={`/products?gender=${gender}&category=${cat}&subcategory=${sub}`}
                                                    className="group flex items-center gap-2 py-1.5 text-sm text-text-secondary transition-colors hover:text-primary capitalize"
                                                >
                                                    <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    {sub}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </AccordionContent>
        </AccordionItem>
    );
}