'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Trash2, ShoppingCart, Loader2, X } from 'lucide-react';
import { useAuth } from '../../../store/authStore';
import { useWishlist, useWishlistActions } from '../../../store/wishlistStore';
import { useCartActions } from '../../../store/cartStore';
import { handleApiError } from '../../../api/error-handler';
import { showSuccess, showError } from '../../../lib/notifications';

export default function WishlistPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { items, isLoading, hydrated } = useWishlist();
    const { fetchWishlist, removeFromWishlist, clearWishlist } = useWishlistActions();
    const { addToCart } = useCartActions();

    const [removingIds, setRemovingIds] = useState<Set<string>>(new Set());
    const [addingToCartIds, setAddingToCartIds] = useState<Set<string>>(new Set());

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/wishlist');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated && !hydrated) {
            fetchWishlist().catch((err) => {
                const apiError = handleApiError(err);
                showError(apiError.message || 'Error al cargar lista de deseos');
            });
        }
    }, [isAuthenticated, hydrated, fetchWishlist]);

    const handleRemove = async (productId: string) => {
        setRemovingIds((prev) => new Set(prev).add(productId));
        try {
            await removeFromWishlist(productId);
            showSuccess('Producto eliminado de tu lista de deseos');
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al eliminar producto');
        } finally {
            setRemovingIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    const handleAddToCart = async (productId: string, defaultSize?: string) => {
        setAddingToCartIds((prev) => new Set(prev).add(productId));
        try {
            await addToCart({
                product: productId,
                variant: defaultSize ? { size: defaultSize } : undefined,
                quantity: 1,
            });
            showSuccess('Producto agregado al carrito');
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al agregar al carrito');
        } finally {
            setAddingToCartIds((prev) => {
                const newSet = new Set(prev);
                newSet.delete(productId);
                return newSet;
            });
        }
    };

    const handleClearAll = async () => {
        if (!window.confirm('¿Estás seguro de que deseas vaciar tu lista de deseos?')) {
            return;
        }
        try {
            await clearWishlist();
            showSuccess('Lista de deseos vaciada');
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al vaciar lista de deseos');
        }
    };

    if (authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary mb-2">
                            Lista de Deseos
                        </h1>
                        <p className="text-text-muted">
                            {items.length} {items.length === 1 ? 'producto guardado' : 'productos guardados'}
                        </p>
                    </div>
                    {items.length > 0 && (
                        <button
                            onClick={handleClearAll}
                            className="flex items-center gap-2 px-4 py-2 border-2 border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-white transition-colors cursor-pointer"
                        >
                            <Trash2 className="w-4 h-4" />
                            Vaciar Lista
                        </button>
                    )}
                </div>

                {items.length === 0 ? (
                    <div className="bg-white border border-border rounded-lg p-12 text-center">
                        <Heart className="w-16 h-16 text-text-muted mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-text-primary mb-2">
                            Tu lista de deseos está vacía
                        </h2>
                        <p className="text-text-muted mb-6">
                            Guarda tus productos favoritos para comprarlos más tarde
                        </p>
                        <Link
                            href="/products"
                            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors cursor-pointer"
                        >
                            Explorar Productos
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {items.map((product) => {
                            const isRemoving = removingIds.has(product.id);
                            const isAddingToCart = addingToCartIds.has(product.id);
                            const hasDiscount = product.discount && product.discount > 0;
                            const finalPrice = hasDiscount
                                ? product.price - (product.price * product.discount!) / 100
                                : product.price;

                            return (
                                <div
                                    key={product.id}
                                    className="bg-white border border-border rounded-lg overflow-hidden hover:shadow-lg transition-shadow group"
                                >
                                    <div className="relative aspect-square">
                                        <Link href={`/products/${product.slug}`}>
                                            <Image
                                                src={product.images?.[0] || '/imagen-no-disponible.webp'}
                                                alt={product.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                                            />
                                        </Link>
                                        {hasDiscount && (
                                            <div className="absolute top-2 left-2 bg-destructive text-white px-2 py-1 rounded-md text-sm font-bold">
                                                -{product.discount}%
                                            </div>
                                        )}
                                        <button
                                            onClick={() => handleRemove(product.id)}
                                            disabled={isRemoving}
                                            className="absolute top-2 right-2 p-2 bg-white rounded-full shadow-md hover:bg-destructive hover:text-white transition-colors disabled:opacity-50 cursor-pointer"
                                            title="Eliminar de favoritos"
                                        >
                                            {isRemoving ? (
                                                <Loader2 className="w-5 h-5 animate-spin" />
                                            ) : (
                                                <X className="w-5 h-5" />
                                            )}
                                        </button>
                                        {!product.status && (
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                                <span className="bg-white text-text-primary px-4 py-2 rounded-lg font-bold">
                                                    No Disponible
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-4">
                                        <Link href={`/products/${product.id}`}>
                                            <h3 className="font-bold text-text-primary mb-2 line-clamp-2 hover:text-primary transition-colors">
                                                {product.name}
                                            </h3>
                                        </Link>

                                        {product.description && (
                                            <p className="text-sm text-text-muted mb-3 line-clamp-2">
                                                {product.description}
                                            </p>
                                        )}

                                        <div className="mb-4">
                                            {hasDiscount ? (
                                                <div className="flex items-center gap-2">
                                                    <span className="text-xl font-bold text-primary">
                                                        ${finalPrice.toFixed(2)}
                                                    </span>
                                                    <span className="text-sm text-text-muted line-through">
                                                        ${product.price.toFixed(2)}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xl font-bold text-primary">
                                                    ${product.price.toFixed(2)}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleAddToCart(product.id, product.sizes?.[0]?.size)}
                                                disabled={!product.status || isAddingToCart}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                            >
                                                {isAddingToCart ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <ShoppingCart className="w-4 h-4" />
                                                )}
                                                {isAddingToCart ? 'Agregando...' : 'Agregar'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}