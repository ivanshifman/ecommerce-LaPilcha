'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';
import { useProductActions } from '../../store/productStore';

interface Props {
    gender: string;
    open: boolean;
    onToggle: () => void;
}

export function MobileCategoryItem({ gender, open, onToggle }: Props) {
    const { fetchCategoriesByGender, fetchSubcategories } = useProductActions();
    const [categories, setCategories] = useState<string[]>([]);
    const [openCategory, setOpenCategory] = useState<string | null>(null);
    const [subcategories, setSubcategories] = useState<string[]>([]);

    useEffect(() => {
        if (open && categories.length === 0) {
            fetchCategoriesByGender(gender).then(setCategories);
        }
    }, [open, gender, categories.length, fetchCategoriesByGender]);

    const toggleCategory = async (cat: string) => {
        if (openCategory === cat) {
            setOpenCategory(null);
            return;
        }
        setOpenCategory(cat);
        const subs = await fetchSubcategories(cat);
        setSubcategories(subs);
    };

    return (
        <li>
            <button onClick={onToggle} className="w-full flex justify-between py-3 text-text-primary font-medium hover:text-primary transition-colors">
                {gender}
                <span className="p-2 rounded-full hover:bg-accent transition-colors">
                    <ChevronDown
                        className={`transition-transform ${open ? 'rotate-180' : ''}`}
                    />
                </span>
            </button>

            {open && (
                <ul className="pl-4 space-y-2">
                    {categories.map((cat) => (
                        <li key={cat}>
                            <button
                                onClick={() => toggleCategory(cat)}
                                className="w-full flex justify-between py-2 text-text-muted"
                            >
                                {cat}
                                <span
                                    className="p-2 rounded-full hover:bg-accent transition-colors">
                                    <ChevronDown
                                        className={`transition-transform ${openCategory === cat ? 'rotate-180' : ''}`}
                                    />
                                </span>
                            </button>

                            {openCategory === cat && (
                                <ul className="pl-4 space-y-1">
                                    {subcategories.map((sub) => (
                                        <li key={sub}>
                                            <Link
                                                href={`/products?gender=${gender}&category=${cat}&subcategory=${sub}`}
                                                className="block py-1 text-sm text-text-secondary hover:text-primary transition-colors"
                                            >
                                                {sub}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </li>
    );
}
