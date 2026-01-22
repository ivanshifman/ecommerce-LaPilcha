'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingCart, Trash2, Heart } from 'lucide-react';
import { useWishlist, useWishlistActions } from '../../store/wishlistStore';
import { useCartActions } from '../../store/cartStore';
import { colorLabels } from '../../utils/colorMap';
import { showSuccess, showError } from '../../lib/notifications';
import { handleApiError } from '../../api/error-handler';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function WishlistSidebar({ isOpen, onClose }: Props) {
    const { items, isLoading } = useWishlist();
    const { removeFromWishlist } = useWishlistActions();
    const { addToCart } = useCartActions();

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleRemove = async (productId: string) => {
        try {
            await removeFromWishlist(productId);
            showSuccess('Eliminado de favoritos');
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al eliminar');
        }
    };

    const handleAddToCart = async (product: any) => {
        try {
            const firstAvailableSize = product.sizes?.find((s: any) => s.stock > 0);
            if (!firstAvailableSize) {
                showError('Sin stock disponible');
                return;
            }

            await addToCart({
                product: product.id,
                variant: { size: firstAvailableSize.size, color: product.color },
                quantity: 1,
            });
            showSuccess('Agregado al carrito');
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al agregar al carrito');
        }
    };

    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                    onClick={onClose}
                />
            )}

            <div
                className={`fixed top-0 right-0 h-full w-full sm:w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between p-4 border-b border-border">
                        <div className="flex items-center gap-2">
                            <Heart className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-text-primary">
                                Mis Favoritos
                            </h2>
                            <span className="text-sm text-text-muted">
                                ({items.length})
                            </span>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 hover:bg-accent rounded-full transition-colors cursor-pointer"
                            aria-label="Cerrar"
                        >
                            <X className="w-5 h-5 text-text-muted" />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        {isLoading ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                            </div>
                        ) : items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <Heart className="w-16 h-16 text-text-muted mb-4" />
                                <h3 className="text-lg font-semibold text-text-primary mb-2">
                                    No tienes favoritos
                                </h3>
                                <p className="text-sm text-text-muted mb-6">
                                    Agrega productos a tu lista de favoritos
                                </p>
                                <Link
                                    href="/products"
                                    onClick={onClose}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                                >
                                    Explorar productos
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {items.map((product) => {
                                    const hasDiscount = typeof product.discount === 'number' && product.discount > 0;
                                    const finalPrice = hasDiscount
                                        ? product.price * (1 - product.discount! / 100)
                                        : product.price;

                                    return (
                                        <div
                                            key={product.id}
                                            className="flex gap-3 p-3 border border-border rounded-lg hover:shadow-md transition-shadow"
                                        >
                                            <Link
                                                href={`/products/${product.slug}`}
                                                onClick={onClose}
                                                className="relative w-20 h-20 shrink-0"
                                            >
                                                <Image
                                                    src={product.images?.[0] || '/imagen-no-disponible.webp'}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover rounded"
                                                    sizes="80px"
                                                />
                                                {hasDiscount && (
                                                    <div className="absolute -top-1 -right-1 bg-destructive text-white text-[9px] font-bold px-1 py-0.5 rounded">
                                                        -{product.discount}%
                                                    </div>
                                                )}
                                            </Link>

                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/products/${product.slug}`}
                                                    onClick={onClose}
                                                >
                                                    <h3 className="font-medium text-sm text-text-primary line-clamp-2 hover:text-primary transition-colors">
                                                        {product.name}
                                                    </h3>
                                                </Link>
                                                <p className="text-xs text-text-muted mt-1">
                                                    {colorLabels[product.color]}
                                                </p>
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-sm font-bold text-primary">
                                                        ${finalPrice.toFixed(2)}
                                                    </span>
                                                    {hasDiscount && (
                                                        <span className="text-xs text-text-muted line-through">
                                                            ${product.price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex gap-2 mt-3">
                                                    <button
                                                        onClick={() => handleAddToCart(product)}
                                                        className="flex-1 flex items-center justify-center gap-1 px-3 py-1.5 bg-primary text-white text-xs rounded hover:bg-primary-dark transition-colors cursor-pointer"
                                                    >
                                                        <ShoppingCart className="w-3 h-3" />
                                                        Agregar
                                                    </button>
                                                    <button
                                                        onClick={() => handleRemove(product.id)}
                                                        className="p-1.5 text-destructive hover:bg-destructive/10 rounded transition-colors cursor-pointer"
                                                        title="Eliminar"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {items.length > 0 && (
                        <div className="p-4 border-t border-border bg-accent/30">
                            <Link
                                href="/wishlist"
                                onClick={onClose}
                                className="w-full block text-center px-6 py-3 bg-secondary text-white rounded-lg font-medium hover:bg-secondary-dark transition-colors"
                            >
                                Ver todos los favoritos
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}