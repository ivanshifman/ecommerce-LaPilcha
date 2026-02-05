'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Navigation } from 'swiper/modules';
import { motion } from 'framer-motion';
import { ArrowRight, Percent, TrendingUp, Zap } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';

const promoBanners = [
    {
        id: 1,
        icon: Percent,
        title: 'Ofertas Flash',
        description: 'Hasta 50% OFF en productos seleccionados',
        image: 'https://res.cloudinary.com/dtn92tadl/image/upload/f_auto,q_auto/v1770320378/LaPilcha/PromoBanners01_lgr6m6.jpg',
        link: '/products?onDiscount=true',
        color: 'from-orange-600 to-amber-700',
    },
    {
        id: 2,
        icon: TrendingUp,
        title: 'Lo Más Vendido',
        description: 'Los productos favoritos de nuestros clientes',
        image: 'https://res.cloudinary.com/dtn92tadl/image/upload/f_auto,q_auto/v1770320651/LaPilcha/PromoBanner02_byt4qd.jpg',
        link: '/products?sortBy=salesCount&order=desc',
        color: 'from-stone-600 to-stone-800',
    },
    {
        id: 3,
        icon: Zap,
        title: 'Nuevos Ingresos',
        description: 'Descubrí las últimas novedades',
        image: 'https://res.cloudinary.com/dtn92tadl/image/upload/f_auto,q_auto/v1770322902/LaPilcha/PromoBanners03_clzhbu.png',
        link: '/products?sortBy=createdAt&order=desc',
        color: 'from-amber-700 to-yellow-800',
    },
];

export function PromoBanners() {
    return (
        <section className="max-w-7xl mx-auto px-4 py-12 md:py-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="mb-8"
            >
                <h2 className="text-2xl md:text-3xl font-bold text-text-primary mb-2">
                    Promociones Especiales
                </h2>
                <p className="text-text-muted">
                    No te pierdas estas oportunidades únicas
                </p>
            </motion.div>

            <Swiper
                modules={[Autoplay, Navigation]}
                spaceBetween={24}
                slidesPerView={1}
                navigation
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    1024: { slidesPerView: 3 },
                }}
                className="promo-swiper"
            >
                {promoBanners.map((banner, index) => (
                    <SwiperSlide key={banner.id}>
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                        >
                            <Link
                                href={banner.link}
                                className="group block relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 h-64"
                            >
                                <div className="absolute inset-0">
                                    <Image
                                        src={banner.image}
                                        alt={banner.title}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                    <div className={`absolute inset-0 bg-linear-to-br ${banner.color} opacity-80 group-hover:opacity-90 transition-opacity duration-500`} />
                                </div>

                                <div className="relative h-full flex flex-col justify-between p-6 text-white">
                                    <div className="inline-flex items-center justify-center w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full">
                                        <banner.icon className="w-6 h-6" />
                                    </div>

                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{banner.title}</h3>
                                        <p className="text-sm text-white/90 mb-4">{banner.description}</p>
                                        <div className="inline-flex items-center gap-2 font-semibold group-hover:gap-3 transition-all">
                                            <span>Explorar</span>
                                            <ArrowRight className="w-5 h-5" />
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    </SwiperSlide>
                ))}
            </Swiper>

            <style jsx global>{`
                .promo-swiper .swiper-button-next,
                .promo-swiper .swiper-button-prev {
                    color: #fff;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(4px);
                    width: 40px;
                    height: 40px;
                    border-radius: 50%;
                }
                .promo-swiper .swiper-button-next:after,
                .promo-swiper .swiper-button-prev:after {
                    font-size: 18px;
                }
            `}</style>
        </section>
    );
}