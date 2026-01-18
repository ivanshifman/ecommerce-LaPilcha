'use client';

import { useState } from 'react';
import Image from 'next/image';
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Props {
    images: string[];
    productName: string;
}

export function ProductImageGallery({ images, productName }: Props) {
    const [selectedImage, setSelectedImage] = useState(0);
    const [direction, setDirection] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);

    const displayImages = images.length > 0 ? images : ['/imagen-no-disponible.webp'];

    /* ---------------------------
       Imagen principal
    ---------------------------- */

    const handlePrevMain = () => {
        setDirection(-1);
        setSelectedImage((prev) =>
            prev === 0 ? displayImages.length - 1 : prev - 1
        );
    };

    const handleNextMain = () => {
        setDirection(1);
        setSelectedImage((prev) =>
            prev === displayImages.length - 1 ? 0 : prev + 1
        );
    };

    const openLightbox = (index: number) => {
        setLightboxIndex(index);
        setIsLightboxOpen(true);
    };

    /* ---------------------------
       Lightbox
    ---------------------------- */

    const handlePreviousLightbox = () => {
        setLightboxIndex((prev) =>
            prev === 0 ? displayImages.length - 1 : prev - 1
        );
    };

    const handleNextLightbox = () => {
        setLightboxIndex((prev) =>
            prev === displayImages.length - 1 ? 0 : prev + 1
        );
    };

    /* ---------------------------
       Swipe (mobile)
    ---------------------------- */

    const swipeConfidence = 80;

    const swipePower = (offset: number, velocity: number) =>
        Math.abs(offset) * velocity;

    return (
        <>
            <div className="space-y-4">

                {/* ---------- Imagen principal ---------- */}
                <div className="relative aspect-square bg-accent rounded-lg overflow-hidden group touch-pan-y">

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={selectedImage}
                            initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: direction > 0 ? '-100%' : '100%', opacity: 0 }}
                            transition={{ duration: 0.35, ease: 'easeOut' }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={0.9}
                            onDragEnd={(_, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);

                                if (swipe < -swipeConfidence) handleNextMain();
                                else if (swipe > swipeConfidence) handlePrevMain();
                            }}
                            className="absolute inset-0"
                        >
                            <Image
                                src={displayImages[selectedImage]}
                                alt={`${productName} - imagen principal`}
                                fill
                                className="object-cover"
                                priority
                                loading="eager"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Flecha izquierda */}
                    {displayImages.length > 1 && (
                        <button
                            title="Imagen anterior"
                            onClick={handlePrevMain}
                            className="absolute left-3 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow
              opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
                        >
                            <ChevronLeft className="w-6 h-6 text-text-primary" />
                        </button>
                    )}

                    {/* Flecha derecha */}
                    {displayImages.length > 1 && (
                        <button
                            title="Imagen siguiente"
                            onClick={handleNextMain}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 bg-white/80 hover:bg-white rounded-full shadow
              opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
                        >
                            <ChevronRight className="w-6 h-6 text-text-primary" />
                        </button>
                    )}

                    {/* Zoom */}
                    <button
                        title="Ver imagen en grande"
                        onClick={() => openLightbox(selectedImage)}
                        className="absolute top-4 right-4 p-3 bg-white/90 hover:bg-white rounded-lg shadow
            opacity-100 md:opacity-0 md:group-hover:opacity-100 transition"
                    >
                        <ZoomIn className="w-5 h-5 text-text-primary" />
                    </button>
                </div>

                {/* ---------- Miniaturas ---------- */}
                {displayImages.length > 1 && (
                    <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-4 gap-2">
                        {displayImages.map((img, index) => (
                            <button
                                key={index}
                                title={`Miniatura ${index + 1}`}
                                onClick={() => {
                                    setDirection(index > selectedImage ? 1 : -1);
                                    setSelectedImage(index);
                                }}
                                className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${selectedImage === index
                                        ? 'border-primary scale-95'
                                        : 'border-transparent hover:border-border'
                                    }`}
                            >
                                <Image
                                    src={img}
                                    alt={`${productName} - miniatura ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 25vw, 10vw"
                                />
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* ================= Lightbox ================= */}
            {isLightboxOpen && (
                <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center">

                    {/* Cerrar */}
                    <button
                        title="Cerrar visor de imágenes"
                        onClick={() => setIsLightboxOpen(false)}
                        className="absolute top-4 right-4 z-50 p-3 bg-white/20 hover:bg-white/30 rounded-lg"
                    >
                        <X className="w-6 h-6 text-white" />
                    </button>

                    {/* Flechas */}
                    {displayImages.length > 1 && (
                        <>
                            <button
                                title="Imagen anterior"
                                onClick={handlePreviousLightbox}
                                className="absolute left-4 z-40 p-3 bg-white/10 hover:bg-white/20 rounded-lg"
                            >
                                <ChevronLeft className="w-6 h-6 text-white" />
                            </button>

                            <button
                                title="Imagen siguiente"
                                onClick={handleNextLightbox}
                                className="absolute right-4 z-40 p-3 bg-white/10 hover:bg-white/20 rounded-lg"
                            >
                                <ChevronRight className="w-6 h-6 text-white" />
                            </button>
                        </>
                    )}

                    <div className="relative w-full h-full max-w-6xl max-h-[90vh] mx-4">
                        <Image
                            src={displayImages[lightboxIndex]}
                            alt={`${productName} - imagen ${lightboxIndex + 1}`}
                            fill
                            className="object-contain"
                            sizes="100vw"
                            priority
                        />
                    </div>

                    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white text-sm">
                        {lightboxIndex + 1} / {displayImages.length}
                    </div>
                </div>
            )}
        </>
    );
}
