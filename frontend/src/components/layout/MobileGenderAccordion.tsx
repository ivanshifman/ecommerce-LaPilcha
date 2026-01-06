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
                <ul className="space-y-2">
                    {categories.map((cat) => (
                        <li key={cat}>
                            {/* BOTÓN DE CATEGORÍA */}
                            <button
                                onClick={() => handleCategory(cat)}
                                className={`relative w-full flex justify-between items-center py-3 text-sm font-medium transition-colors ${openCategory === cat ? 'text-primary' : 'text-text-muted hover:text-text-primary'} after:absolute after:left-0 after:bottom-0 after:h-px after:w-full after:bg-border after:opacity-40`}
                            >
                                {cat}
                            </button>

                            {/* SUBCATEGORÍAS */}
                            <div
                                className={`grid overflow-hidden transition-all duration-300 ease-out ${openCategory === cat
                                    ? 'grid-rows-[1fr] opacity-100 translate-y-0'
                                    : 'grid-rows-[0fr] opacity-0 -translate-y-1'
                                    }`}
                            >
                                <ul className="overflow-hidden pl-5 space-y-1 py-1">
                                    {subcategories.map((sub) => (
                                        <li key={sub}>
                                            <Link
                                                href={`/products?gender=${gender}&category=${cat}&subcategory=${sub}`}
                                                className=" group flex items-center gap-2 py-1.5 text-sm text-text-secondary transition-colors hover:text-primary "
                                            >
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
                                                {sub}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </li>
                    ))}
                </ul>
            </AccordionContent>
        </AccordionItem>
    );
}
