'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingCart, Eye } from 'lucide-react';
import { useWishlistActions } from '../../store/wishlistStore';
import { useCartActions } from '../../store/cartStore';
import { showSuccess, showError } from '../../lib/notifications';
import type { Product } from '../../types/product.types';
import type { User } from '../../types/auth.types';
import { UserRole } from '../../types/auth.types';
import { colorMap, colorLabels } from '../../utils/colorMap';
import { handleApiError } from '../../api/error-handler';

interface Props {
    product: Product;
    user: User | null;
}

export function ProductCard({ product, user }: Props) {
    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [showActions, setShowActions] = useState(false);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);

    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistActions();
    const { addToCart } = useCartActions();

    const isAdmin = user?.role === UserRole.ADMIN;
    const inWishlist = isInWishlist(product.id);
    const hasDiscount = product.discount && product.discount > 0;
    const discountedPrice = hasDiscount
        ? product.price * (1 - product.discount! / 100)
        : product.price;

    const handleToggleWishlist = async (e: React.MouseEvent) => {
        e.preventDefault();
        if (isAdmin) return;

        setIsTogglingWishlist(true);
        try {
            if (inWishlist) {
                await removeFromWishlist(product.id);
                showSuccess('Eliminado de favoritos');
            } else {
                await addToWishlist(product.id);
                showSuccess('Agregado a favoritos');
            }
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al actualizar favoritos');
        } finally {
            setIsTogglingWishlist(false);
        }
    };

    const handleAddToCart = async () => {
        if (isAdmin || !selectedSize) return;

        setIsAddingToCart(true);
        try {
            await addToCart({
                product: product.id,
                variant: { size: selectedSize, color: product.color },
                quantity: 1,
            });
            showSuccess('Producto agregado al carrito');
            setSelectedSize(null);
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al agregar al carrito');
        } finally {
            setIsAddingToCart(false);
        }
    };

    return (
        <div
            className="group bg-white rounded-lg border border-border overflow-hidden hover:shadow-lg transition-all duration-300"
            onMouseEnter={() => setShowActions(true)}
            onMouseLeave={() => setShowActions(false)}
        >
            <div className="relative aspect-square overflow-hidden bg-accent/20">
                <Image
                    src={product.images?.[0] || '/imagen-no-disponible.webp'}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    loading='lazy'
                />

                {hasDiscount && (
                    <div className="absolute top-2 left-2 bg-destructive text-white px-2 py-1 rounded-md text-xs font-medium">
                        -{product.discount}%
                    </div>
                )}

                {!isAdmin && (
                    <button
                        title='Agregar a favoritos'
                        onClick={handleToggleWishlist}
                        disabled={isTogglingWishlist}
                        className="absolute top-2 right-2 p-2 bg-white/90 hover:bg-white rounded-full shadow-md transition-all disabled:opacity-50"
                    >
                        <Heart
                            className={`w-4 h-4 transition-colors ${inWishlist ? 'fill-primary text-primary' : 'text-text-muted'
                                }`}
                        />
                    </button>
                )}

                <div
                    className={`absolute inset-0 bg-black/40 flex items-center justify-center gap-2 transition-opacity duration-300 ${showActions ? 'opacity-100' : 'opacity-0 pointer-events-none'
                        }`}
                >
                    <Link
                        href={`/products/${product.slug}`}
                        className="p-2 bg-white rounded-full hover:bg-primary hover:text-white transition-colors"
                    >
                        <Eye className="w-5 h-5" />
                    </Link>
                </div>
            </div>

            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <Link href={`/products/${product.slug}`}>
                            <h3 className="font-medium text-text-primary line-clamp-1 text-sm hover:text-primary transition-colors">
                                {product.name}
                            </h3>
                        </Link>
                        <p className="text-xs text-text-muted mt-1">{product.category}</p>
                    </div>
                    <div
                        className="w-5 h-5 rounded-full border-2 border-border shrink-0 ml-2"
                        style={{ backgroundColor: colorMap[product.color] }}
                        title={colorLabels[product.color]}
                    />
                </div>

                <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-primary">
                        ${discountedPrice.toFixed(2)}
                    </span>
                    {hasDiscount && (
                        <span className="text-sm text-text-muted line-through">
                            ${product.price.toFixed(2)}
                        </span>
                    )}
                </div>

                {!isAdmin && (
                    <>
                        <div className="mb-3">
                            <p className="text-xs text-text-muted mb-2">Talle:</p>
                            <div className="flex flex-wrap gap-1.5">
                                {product.sizes?.map((sizeObj) => (
                                    <button
                                        key={sizeObj.size}
                                        onClick={() => setSelectedSize(sizeObj.size)}
                                        disabled={sizeObj.stock === 0}
                                        className={`px-3 py-1 text-xs border rounded transition-colors ${selectedSize === sizeObj.size ? 'bg-primary text-white border-primary' : sizeObj.stock === 0 ? 'bg-muted text-text-muted border-border cursor-not-allowed' : 'bg-white text-text-primary border-border hover:border-primary'}`}
                                    >
                                        {sizeObj.size}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <button
                            onClick={handleAddToCart}
                            disabled={!selectedSize || isAddingToCart}
                            className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                        >
                            <ShoppingCart className="w-4 h-4" />
                            {isAddingToCart ? 'Agregando...' : 'Agregar al carrito'}
                        </button>
                    </>
                )}

                
                    <Link
                        href={`/products/${product.slug}`}
                        className="w-full bg-primary text-white py-2 rounded-lg font-medium hover:bg-primary-dark transition-colors flex items-center justify-center gap-2 text-sm mt-4"
                    >
                        <Eye className="w-4 h-4" />
                        Ver detalles
                    </Link>
              
            </div>
        </div >);
}
