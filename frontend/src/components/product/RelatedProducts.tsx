'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart } from 'lucide-react';
import { useWishlistActions, useWishlist } from '../../store/wishlistStore';
import { useCartActions } from '../../store/cartStore';
import { useAuth } from '../../store/authStore';
import { productService } from '../../services/product.service';
import type { Product } from '../../types/product.types';
import { colorMap } from '../../utils/colorMap';
import { showSuccess, showError } from '../../lib/notifications';
import { handleApiError } from '../../api/error-handler';
import { UserRole } from '../../types/auth.types';

interface Props {
    currentProductId: string;
    category: string;
    gender?: string;
}

export function RelatedProducts({ currentProductId, category, gender }: Props) {
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistActions();
    const { hydrated } = useWishlist();
    const { addToCart } = useCartActions();
    const { user } = useAuth();

    const isAdmin = user?.role === UserRole.ADMIN;

    useEffect(() => {
        const loadRelated = async () => {
            try {
                setIsLoading(true);

                const response = await productService.getAll({
                    category,
                    gender: gender as any,
                    limit: 8,
                });

                const filtered = response.docs
                    .filter((p: Product) => p.id !== currentProductId)
                    .slice(0, 4);

                setRelatedProducts(filtered);
            } catch (error) {
                console.error('Error loading related products:', error);
                setRelatedProducts([]);
            } finally {
                setIsLoading(false);
            }
        };

        if (category) {
            loadRelated();
        }
    }, [currentProductId, category, gender]);

    const handleToggleWishlist = async (productId: string, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAdmin) return;

        try {
            if (isInWishlist(productId)) {
                await removeFromWishlist(productId);
                showSuccess('Eliminado de favoritos');
            } else {
                await addToWishlist(productId);
                showSuccess('Agregado a favoritos');
            }
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message);
        }
    };

    const handleQuickAdd = async (product: Product, e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (isAdmin || !product.sizes || product.sizes.length === 0) return;

        const firstAvailableSize = product.sizes.find(s => s.stock > 0);
        if (!firstAvailableSize) {
            showError('Sin stock disponible');
            return;
        }

        try {
            await addToCart({
                product: product.id,
                variant: { size: firstAvailableSize.size, color: product.color },
                quantity: 1,
            });
            showSuccess('Agregado al carrito');
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message);
        }
    };

    if (isLoading) {
        return (
            <div className="border-t border-border pt-12">
                <h2 className="text-2xl font-bold text-text-primary mb-6">Productos Relacionados</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="aspect-square bg-muted rounded-lg mb-3" />
                            <div className="h-4 bg-muted rounded w-3/4 mb-2" />
                            <div className="h-4 bg-muted rounded w-1/2" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (relatedProducts.length === 0) return null;

    return (
        <div className="border-t border-border pt-12">
            <h2 className="text-2xl font-bold text-text-primary mb-6">Productos Relacionados</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {relatedProducts.map((product) => {
                    const hasDiscount = typeof product.discount === 'number' && product.discount > 0;
                    const finalPrice = hasDiscount
                        ? product.price * (1 - product.discount! / 100)
                        : product.price;
                    const inWishlist = hydrated && isInWishlist(product.id);

                    return (
                        <div
                            key={product.id}
                            className="group bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all"
                        >
                            <Link href={`/products/${product.slug}`} className="block relative aspect-square overflow-hidden bg-accent/20">
                                <Image
                                    src={product.images?.[0] || '/imagen-no-disponible.webp'}
                                    alt={product.name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    sizes="(max-width: 768px) 50vw, 25vw"
                                />
                                {hasDiscount && (
                                    <div className="absolute top-2 left-2 bg-destructive text-white px-2 py-1 rounded text-xs font-medium">
                                        -{product.discount}%
                                    </div>
                                )}
                                {!isAdmin && (
                                    <button
                                        onClick={(e) => handleToggleWishlist(product.id, e)}
                                        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                        title={inWishlist ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                                    >
                                        <Heart
                                            className={`w-4 h-4 ${inWishlist ? 'fill-primary text-primary' : 'text-text-muted'
                                                }`}
                                        />
                                    </button>
                                )}
                            </Link>

                            <div className="p-3">
                                <Link href={`/products/${product.slug}`}>
                                    <h3 className="font-medium text-text-primary line-clamp-1 text-sm hover:text-primary transition-colors">
                                        {product.name}
                                    </h3>
                                </Link>
                                <div className="flex items-center gap-2 mt-2">
                                    <span className="text-base font-bold text-primary">
                                        ${finalPrice.toFixed(2)}
                                    </span>
                                    {hasDiscount && (
                                        <span className="text-xs text-text-muted line-through">
                                            ${product.price.toFixed(2)}
                                        </span>
                                    )}
                                </div>

                                {!isAdmin && (
                                    <button
                                        onClick={(e) => handleQuickAdd(product, e)}
                                        className="w-full mt-3 py-2 bg-secondary text-white text-sm rounded-lg hover:bg-secondary-dark transition-colors flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <ShoppingCart className="w-4 h-4" />
                                        Agregar
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}