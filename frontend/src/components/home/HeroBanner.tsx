'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, EffectFade } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

const heroSlides = [
  {
    id: 1,
    title: 'Nueva Colección',
    subtitle: 'Verano 2026',
    description: 'Descubrí las últimas tendencias en moda con productos de primera calidad',
    image: 'https://res.cloudinary.com/dtn92tadl/image/upload/f_auto,q_auto/v1770319584/LaPilcha/BannerHero01._mexkxs.png',
    link: '/products?featured=true',
    gradient: 'from-amber-800/85 to-stone-900/85',
  },
  {
    id: 2,
    title: 'Ofertas Imperdibles',
    subtitle: 'Hasta 50% OFF',
    description: 'Aprovechá descuentos exclusivos en productos seleccionados',
    image: 'https://res.cloudinary.com/dtn92tadl/image/upload/f_auto,q_auto/v1770319714/LaPilcha/BannerHero02._d6adll.png',
    link: '/products?onDiscount=true',
    gradient: 'from-orange-700/85 to-amber-900/85',
  },
  {
    id: 3,
    title: 'Estilo Tradicional',
    subtitle: 'Lo Último en el Mercado',
    description: 'Ropa cómoda y con estilo para tu día a día',
    image: 'https://res.cloudinary.com/dtn92tadl/image/upload/f_auto,q_auto/v1770319815/LaPilcha/BannerHero03._nuqock.png',
    link: '/products?category=Camisa',
    gradient: 'from-gray-900/90 to-gray-700/90',
  },
];

export function HeroBanner() {
    return (
        <section className="relative h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden">
            <Swiper
                modules={[Autoplay, Pagination, EffectFade]}
                effect="fade"
                autoplay={{
                    delay: 5000,
                    disableOnInteraction: false,
                }}
                pagination={{
                    clickable: true,
                    bulletActiveClass: 'swiper-pagination-bullet-active bg-white',
                }}
                loop={true}
                className="h-full"
            >
                {heroSlides.map((slide, index) => (
                    <SwiperSlide key={slide.id}>
                        <div className="relative h-full w-full">
                            <div className="absolute inset-0">
                                <Image
                                    src={slide.image}
                                    alt={slide.title}
                                    fill
                                    className="object-cover"
                                    priority={index === 0}
                                />
                                <div className={`absolute inset-0 bg-linear-to-r ${slide.gradient}`} />
                            </div>

                            <div className="relative h-full max-w-7xl mx-auto px-4 flex items-center">
                                <motion.div
                                    initial={{ opacity: 0, y: 30 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className="max-w-2xl text-white"
                                >
                                    <motion.p
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.3 }}
                                        className="text-sm md:text-base font-medium mb-4 tracking-wider uppercase"
                                    >
                                        {slide.subtitle}
                                    </motion.p>

                                    <motion.h1
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.4 }}
                                        className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 leading-tight"
                                    >
                                        {slide.title}
                                    </motion.h1>

                                    <motion.p
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.6, delay: 0.5 }}
                                        className="text-base md:text-lg mb-8 text-white/90 max-w-lg"
                                    >
                                        {slide.description}
                                    </motion.p>

                                    <motion.div
                                        initial={{ opacity: 0, y: 20 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.6, delay: 0.6 }}
                                    >
                                        <Link
                                            href={slide.link}
                                            className="group inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all duration-300 shadow-2xl hover:shadow-white/50"
                                        >
                                            Ver productos
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </Link>
                                    </motion.div>
                                </motion.div>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style jsx global>{`
                .swiper-pagination {
                    bottom: 30px !important;
                }
                .swiper-pagination-bullet {
                    width: 12px;
                    height: 12px;
                    background: rgba(255, 255, 255, 0.5);
                    opacity: 1;
                    transition: all 0.3s;
                }
                .swiper-pagination-bullet-active {
                    width: 40px;
                    border-radius: 6px;
                }
            `}</style>
        </section>
    );
}