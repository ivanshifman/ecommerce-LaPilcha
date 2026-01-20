'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, Loader2 } from 'lucide-react';
import { productService } from '../../services/product.service';
import { colorMap, colorLabels } from '../../utils/colorMap';
import { genderLabels } from '../../utils/genderLabels';
import type { Product } from '../../types/product.types';

interface ColorVariantSelectorProps {
    currentProductId: string;
    currentColor: string;
    currentGender?: string;
    productName: string;
}

export function ColorVariantSelector({
    currentProductId,
    currentColor,
    currentGender,
    productName
}: ColorVariantSelectorProps) {
    const [colorVariants, setColorVariants] = useState<Product[]>([]);
    const [genderVariants, setGenderVariants] = useState<{ gender: string; productGroup: string }[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const loadVariants = async () => {
            try {
                setIsLoading(true);

                const allProducts = await productService.getAll({
                    search: productName,
                    limit: 100
                });

                const genderGroups = new Map<string, string>();
                allProducts.docs.forEach(product => {
                    if (product.gender && product.productGroup) {
                        genderGroups.set(product.gender, product.productGroup);
                    }
                });

                setGenderVariants(
                    Array.from(genderGroups.entries()).map(([gender, productGroup]) => ({
                        gender,
                        productGroup
                    }))
                );

                const currentGenderProducts = allProducts.docs.filter(
                    p => p.gender === currentGender
                );

                if (currentGenderProducts.length > 0) {
                    const currentVariant = currentGenderProducts.find(p => p.id === currentProductId);
                    const otherVariants = currentGenderProducts.filter(p => p.id !== currentProductId);

                    if (currentVariant) {
                        setColorVariants([currentVariant, ...otherVariants]);
                    } else {
                        setColorVariants(currentGenderProducts);
                    }
                } else {
                    setColorVariants([]);
                }
            } catch (error) {
                console.error('Error loading variants:', error);
                setColorVariants([]);
                setGenderVariants([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadVariants();
    }, [productName, currentGender, currentProductId]);

    if (isLoading) {
        return (
            <div className="flex items-center gap-2 text-text-muted">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Cargando variantes...</span>
            </div>
        );
    }

    const handleColorChange = (slug: string) => {
        router.push(`/products/${slug}`);
    };

    const handleGenderChange = async (gender: string) => {
        try {
            const response = await productService.getAll({
                search: productName,
                gender: gender as any,
                limit: 1
            });

            if (response.docs.length > 0) {
                router.push(`/products/${response.docs[0].slug}`);
            }
        } catch (error) {
            console.error('Error changing gender:', error);
        }
    };

    const hasMultipleGenders = genderVariants.length > 1;
    const hasMultipleColors = colorVariants.length > 1;

    if (!hasMultipleGenders && !hasMultipleColors) {
        return null;
    }

    return (
        <div className="space-y-4">
            {hasMultipleGenders && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-text-primary">
                            Género
                        </label>
                        <span className="text-xs text-text-muted">
                            {genderVariants.length} {genderVariants.length === 1 ? 'opción' : 'opciones'}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        {genderVariants.map(({ gender }) => {
                            const isSelected = gender === currentGender;
                            return (
                                <button
                                    key={gender}
                                    onClick={() => !isSelected && handleGenderChange(gender)}
                                    disabled={isSelected}
                                    className={`px-4 py-2 rounded-lg font-medium text-sm transition-all ${isSelected
                                            ? 'bg-primary text-white cursor-default shadow-md'
                                            : 'bg-white text-text-primary border border-border hover:border-primary hover:bg-accent cursor-pointer'
                                        }`}
                                >
                                    {genderLabels[gender as keyof typeof genderLabels] || gender}
                                    {isSelected && (
                                        <Check className="inline-block ml-1.5 w-3.5 h-3.5" />
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}

            {hasMultipleColors && (
                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold text-text-primary">
                            Colores disponibles
                        </label>
                        <span className="text-xs text-text-muted">
                            {colorVariants.length} {colorVariants.length === 1 ? 'color' : 'colores'}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        {colorVariants.map((variant) => {
                            const isSelected = variant.id === currentProductId;
                            const hasDiscount = typeof variant.discount === 'number' && variant.discount > 0;
                            const finalPrice = hasDiscount
                                ? variant.price * (1 - variant.discount! / 100)
                                : variant.price;

                            return (
                                <button
                                    key={variant.id}
                                    onClick={() => handleColorChange(variant.slug!)}
                                    disabled={isSelected}
                                    className={`group relative transition-all ${isSelected ? 'cursor-default' : 'cursor-pointer'
                                        }`}
                                    title={`${colorLabels[variant.color]} - $${finalPrice.toFixed(2)}`}
                                >
                                    <div
                                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${isSelected
                                                ? 'border-primary shadow-lg scale-110'
                                                : 'border-border hover:border-primary hover:scale-105'
                                            }`}
                                        style={{ backgroundColor: colorMap[variant.color] }}
                                    >
                                        {isSelected && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center shadow-md">
                                                    <Check className="w-3.5 h-3.5 text-primary" />
                                                </div>
                                            </div>
                                        )}

                                        {hasDiscount && !isSelected && (
                                            <div className="absolute -top-1 -right-1 bg-destructive text-white text-[9px] font-bold px-1 py-0.5 rounded-full shadow-md">
                                                -{variant.discount}%
                                            </div>
                                        )}
                                    </div>

                                    <div className="absolute -bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                                        <span className="text-xs font-medium text-text-primary bg-white px-2 py-1 rounded shadow-md border border-border">
                                            {colorLabels[variant.color]}
                                            {hasDiscount && ` (-${variant.discount}%)`}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    <p className="text-xs text-text-muted italic">
                        Selecciona un color para ver sus detalles y disponibilidad
                    </p>
                </div>
            )}
        </div>
    );
}