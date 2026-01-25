'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { X, ShoppingCart, Trash2, Plus, Minus } from 'lucide-react';
import { useCart, useCartActions } from '../../store/cartStore';
import { colorLabels } from '../../utils/colorMap';
import { showSuccess, showError } from '../../lib/notifications';
import { handleApiError } from '../../api/error-handler';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: Props) {
    const router = useRouter();
    const { cart, isFetching } = useCart();
    const { updateCartItem, removeFromCart } = useCartActions();

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

    const handleUpdateQuantity = async (productId: string, newQuantity: number, size?: string, color?: string) => {
        if (newQuantity < 1) return;

        try {
            await updateCartItem({
                product: productId,
                variant: { size, color },
                quantity: newQuantity,
            });
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al actualizar cantidad');
        }
    };

    const handleRemove = async (productId: string, size?: string, color?: string) => {
        try {
            await removeFromCart({
                product: productId,
                variant: { size, color },
            });
            showSuccess('Producto eliminado del carrito');
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al eliminar');
        }
    };

    const handleCheckout = () => {
        onClose();
        router.push('/cart');
    };

    const itemsCount = cart?.itemCount || 0;
    const subtotal = cart?.subtotal || 0;

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
                            <ShoppingCart className="w-5 h-5 text-primary" />
                            <h2 className="text-lg font-semibold text-text-primary">
                                Mi Carrito
                            </h2>
                            <span className="text-sm text-text-muted">
                                ({itemsCount})
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
                        {isFetching ? (
                            <div className="flex justify-center items-center py-20">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                            </div>
                        ) : !cart || cart.items.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center">
                                <ShoppingCart className="w-16 h-16 text-text-muted mb-4" />
                                <h3 className="text-lg font-semibold text-text-primary mb-2">
                                    Tu carrito está vacío
                                </h3>
                                <p className="text-sm text-text-muted mb-6">
                                    Agrega productos para comenzar tu compra
                                </p>
                                <Link
                                    href="/products"
                                    onClick={onClose}
                                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                                >
                                    Explorar productos
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {cart.items.map((item, index) => {
   
                                    const hasDiscount = typeof item.product.discount === 'number' && item.product.discount > 0;
                                    const finalPrice = hasDiscount
                                        ? item.product.price * (1 - item.product.discount! / 100)
                                        : item.product.price;

                                    return (
                                        <div
                                            key={`${item.product.id}-${item.variant?.size}-${item.variant?.color}-${index}`}
                                            className="flex gap-3 p-3 border border-border rounded-lg"
                                        >
                                            <Link
                                                href={`/products/${item.product.slug}`}
                                                onClick={onClose}
                                                className="relative w-20 h-20 shrink-0"
                                            >
                                                <Image
                                                    src={item.product.images?.[0] || '/imagen-no-disponible.webp'}
                                                    alt={item.product.name}
                                                    fill
                                                    className="object-cover rounded"
                                                    sizes="80px"
                                                />
                                                {hasDiscount && (
                                                    <div className="absolute -top-1 -right-1 bg-destructive text-white text-[9px] font-bold px-1 py-0.5 rounded">
                                                        -{item.product.discount}%
                                                    </div>
                                                )}
                                            </Link>

                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/products/${item.product.slug}`}
                                                    onClick={onClose}
                                                >
                                                    <h3 className="font-medium text-sm text-text-primary line-clamp-2 hover:text-primary transition-colors">
                                                        {item.product.name}
                                                    </h3>
                                                </Link>
                                                {(item.variant?.size || item.variant?.color) && (
                                                    <div className="flex items-center gap-2 text-xs text-text-muted mt-1">
                                                        {item.variant?.size && (
                                                            <>
                                                                <span>Talle: {item.variant.size}</span>
                                                                {item.variant?.color && <span>•</span>}
                                                            </>
                                                        )}
                                                        {item.variant?.color && (
                                                            <span>{colorLabels[item.variant.color as keyof typeof colorLabels]}</span>
                                                        )}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 mt-2">
                                                    <span className="text-sm font-bold text-primary">
                                                        ${finalPrice.toFixed(2)}
                                                    </span>
                                                    {hasDiscount && (
                                                        <span className="text-xs text-text-muted line-through">
                                                            ${item.product.price.toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>

                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center border border-border rounded">
                                                        <button
                                                            onClick={() => handleUpdateQuantity(
                                                                item.product.id,
                                                                item.quantity - 1,
                                                                item.variant?.size,
                                                                item.variant?.color
                                                            )}
                                                            disabled={item.quantity <= 1}
                                                            className="p-1 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                            title="Disminuir cantidad"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="px-3 text-sm font-medium">
                                                            {item.quantity}
                                                        </span>
                                                        <button
                                                            onClick={() => handleUpdateQuantity(
                                                                item.product.id,
                                                                item.quantity + 1,
                                                                item.variant?.size,
                                                                item.variant?.color
                                                            )}
                                                            className="p-1 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                            title='Aumentar cantidad'
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>

                                                    <button
                                                        onClick={() => handleRemove(
                                                            item.product.id,
                                                            item.variant?.size,
                                                            item.variant?.color
                                                        )}
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

                    {cart && cart.items.length > 0 && (
                        <div className="p-4 border-t border-border bg-accent/30 space-y-3">
                            <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-text-secondary">Subtotal:</span>
                                    <span className="font-semibold text-text-primary">${subtotal.toFixed(2)}</span>
                                </div>
                                {cart.discount > 0 && (
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-text-secondary">Descuento:</span>
                                        <span className="font-semibold text-success">-${cart.discount.toFixed(2)}</span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between text-lg font-bold pt-2 border-t border-border">
                                    <span className="text-text-primary">Total:</span>
                                    <span className="text-primary">${cart.total.toFixed(2)}</span>
                                </div>
                            </div>
                            <button
                                onClick={handleCheckout}
                                className="w-full px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors cursor-pointer"
                            >
                                Ir al carrito
                            </button>
                            <button
                                onClick={onClose}
                                className="w-full px-6 py-2 text-sm text-text-muted hover:text-text-primary transition-colors cursor-pointer"
                            >
                                Continuar comprando
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}