'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '../../store/productStore';
import { genderLabels } from '../../utils/genderLabels';

const categoryImages: Record<string, string> = {
    male: 'https://res.cloudinary.com/dtn92tadl/image/upload/f_auto,q_auto/v1770321162/LaPilcha/CategoryBanners02_wrhcj7.png',
    female: 'https://res.cloudinary.com/dtn92tadl/image/upload/f_auto,q_auto/v1770321227/LaPilcha/CategoryBanners03_u5qp6n.png',
    unisex: 'https://res.cloudinary.com/dtn92tadl/image/upload/f_auto,q_auto/v1770321642/LaPilcha/CategoryBanners01_xjfjis.png',
    kid: 'https://res.cloudinary.com/dtn92tadl/image/upload/f_auto,q_auto/v1770321468/LaPilcha/CategoryBanners04_wsznvm.png',
};

const categoryGradients: Record<string, string> = {
    male: 'from-neutral-800/75 to-stone-900/80',
    female: 'from-rose-900/70 to-amber-900/75',
    unisex: 'from-neutral-800/70 to-stone-650/80',
    kid: 'from-orange-700/70 to-amber-800/75',
};

export function CategoryBanners() {
    const { genders } = useProducts();

    if (genders.length === 0) return null;

    return (
        <section className="max-w-7xl mx-auto px-4 py-16 md:py-24">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-text-primary mb-3">
                    Comprá por Categoría
                </h2>
                <p className="text-text-muted text-lg">
                    Encontrá lo que buscás según tu estilo
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {genders.map((gender, index) => {
                    const isLarge = index === 0;
                    const gridClass = isLarge ? 'lg:col-span-2 lg:row-span-2' : '';

                    return (
                        <motion.div
                            key={gender}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            className={gridClass}
                        >
                            <Link
                                href={`/products?gender=${gender}`}
                                className="group relative block overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-full min-h-[300px]"
                            >
                                <div className="absolute inset-0">
                                    <Image
                                        src={categoryImages[gender]}
                                        alt={genderLabels[gender as keyof typeof genderLabels]}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className={`absolute inset-0 bg-linear-to-br ${categoryGradients[gender]} group-hover:opacity-90 transition-opacity duration-500`} />
                                </div>

                                <div className="relative h-full flex flex-col justify-end p-6 md:p-8 text-white">
                                    <motion.div
                                        whileHover={{ y: -5 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <h3 className={`font-bold mb-2 ${isLarge ? 'text-4xl md:text-5xl' : 'text-2xl md:text-3xl'}`}>
                                            {genderLabels[gender as keyof typeof genderLabels]}
                                        </h3>
                                        <p className={`mb-4 text-white/90 ${isLarge ? 'text-lg' : 'text-sm'}`}>
                                            Explorá nuestra colección
                                        </p>
                                        <div className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all">
                                            <span>Ver productos</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </motion.div>
                                </div>

                                <div className="absolute inset-0 border-4 border-white/0 group-hover:border-white/20 rounded-2xl transition-all duration-500" />
                            </Link>
                        </motion.div>
                    );
                })}
            </div>
        </section>
    );
}