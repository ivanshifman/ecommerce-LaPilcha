'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ShoppingCart, Trash2, Plus, Minus, ArrowLeft, Tag, Truck, Shield, X, Loader2 } from 'lucide-react';
import { useCart, useCartActions } from '../../../store/cartStore';
import { useAuth } from '../../../store/authStore';
import { useCoupon, useCouponActions } from '../../../store/couponStore';
import { colorLabels } from '../../../utils/colorMap';
import { showSuccess, showError } from '../../../lib/notifications';
import { handleApiError } from '../../../api/error-handler';

export default function CartPage() {
    const router = useRouter();

    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { cart, isFetching, isMutating } = useCart();
    const { user } = useAuth();
    const { updateCartItem, removeFromCart, clearCart, fetchCart } = useCartActions();
    const { appliedCoupon, isValidating, discountAmount, freeShipping } = useCoupon();
    const { validateCoupon, removeCoupon } = useCouponActions();

    const [isClearingCart, setIsClearingCart] = useState(false);
    const [couponCode, setCouponCode] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart().catch(console.error);
        }
    }, [isAuthenticated, fetchCart]);

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

    const handleClearCart = async () => {
        if (!confirm('¿Estás seguro de que quieres vaciar el carrito?')) return;

        setIsClearingCart(true);
        try {
            await clearCart();
            removeCoupon();
            showSuccess('Carrito vaciado');
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al vaciar el carrito');
        } finally {
            setIsClearingCart(false);
        }
    };

    const handleApplyCoupon = async () => {
        if (!couponCode.trim()) {
            showError('Ingresa un código de cupón');
            return;
        }

        if (!cart) {
            showError('No hay productos en el carrito');
            return;
        }

        try {
            await validateCoupon({
                code: couponCode.trim().toUpperCase(),
                orderTotal: cart.total,
            });
            showSuccess('¡Cupón aplicado con éxito!');
            setCouponCode('');
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Cupón inválido');
        }
    };

    const handleRemoveCoupon = () => {
        removeCoupon();
        showSuccess('Cupón removido');
    };

    const handleCheckout = () => {
        if (!cart || cart.items.length === 0) {
            showError('Tu carrito está vacío');
            return;
        }
        router.push('/checkout');
    };

    if (authLoading || isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-background">
                <div className="max-w-7xl mx-auto px-4 py-12">
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <ShoppingCart className="w-24 h-24 text-text-muted mb-6" />
                        <h1 className="text-3xl font-bold text-text-primary mb-4">
                            Tu carrito está vacío
                        </h1>
                        <p className="text-text-muted mb-8 max-w-md">
                            Parece que aún no has agregado productos a tu carrito. ¡Explora nuestra tienda y encuentra lo que buscas!
                        </p>
                        <Link
                            href="/products"
                            className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Explorar productos
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const itemsCount = cart.itemCount;
    const subtotal = cart.subtotal;
    const cartDiscount = cart.discount;
    const cartTotal = cart.total;
    const couponDiscount = discountAmount;
    const totalAfterCoupon = cartTotal - couponDiscount;
    const shippingThreshold = 50000;
    const shipping = freeShipping || totalAfterCoupon >= shippingThreshold ? 0 : 5000;
    const finalTotal = totalAfterCoupon + shipping;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link
                        href="/products"
                        className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Seguir comprando
                    </Link>
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-text-primary">Mi Carrito</h1>
                            <p className="text-text-muted mt-1">
                                {itemsCount} {itemsCount === 1 ? 'producto' : 'productos'}
                            </p>
                        </div>
                        {cart.items.length > 0 && (
                            <button
                                onClick={handleClearCart}
                                disabled={isClearingCart}
                                className="px-4 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                            >
                                {isClearingCart ? 'Vaciando...' : 'Vaciar carrito'}
                            </button>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-4">
                        {cart.items.map((item, index) => {
                            const hasDiscount = typeof item.product.discount === 'number' && item.product.discount > 0;
                            const finalPrice = hasDiscount
                                ? item.product.price * (1 - item.product.discount! / 100)
                                : item.product.price;

                            return (
                                <div
                                    key={`${item.product.id}-${item.variant?.size}-${item.variant?.color}-${index}`}
                                    className="bg-white border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex gap-4">
                                        <Link
                                            href={`/products/${item.product.slug}`}
                                            className="relative w-24 h-24 md:w-32 md:h-32 shrink-0"
                                        >
                                            <Image
                                                src={item.product.images?.[0] || '/imagen-no-disponible.webp'}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover rounded-lg"
                                                sizes="(max-width: 768px) 96px, 128px"
                                                loading='eager'
                                            />
                                            {hasDiscount && (
                                                <div className="absolute -top-2 -right-2 bg-destructive text-white text-xs font-bold px-2 py-1 rounded-full shadow-md">
                                                    -{item.product.discount}%
                                                </div>
                                            )}
                                        </Link>

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4">
                                                <div className="flex-1">
                                                    <Link href={`/products/${item.product.slug}`}>
                                                        <h3 className="font-semibold text-lg text-text-primary hover:text-primary transition-colors line-clamp-2">
                                                            {item.product.name}
                                                        </h3>
                                                    </Link>
                                                    {(item.variant?.size || item.variant?.color) && (
                                                        <div className="flex items-center gap-3 text-sm text-text-muted mt-2">
                                                            {item.variant?.size && (
                                                                <span className="px-2 py-1 bg-accent rounded">
                                                                    Talle: {item.variant.size}
                                                                </span>
                                                            )}
                                                            {item.variant?.color && (
                                                                <span className="px-2 py-1 bg-accent rounded">
                                                                    {colorLabels[item.variant.color as keyof typeof colorLabels] || item.variant.color}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() => handleRemove(
                                                        item.product.id,
                                                        item.variant?.size,
                                                        item.variant?.color
                                                    )}
                                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex items-end justify-between mt-4">
                                                <div className="flex items-center border-2 border-border rounded-lg">
                                                    <button
                                                        onClick={() => handleUpdateQuantity(
                                                            item.product.id,
                                                            item.quantity - 1,
                                                            item.variant?.size,
                                                            item.variant?.color
                                                        )}
                                                        disabled={item.quantity <= 1 || isMutating}
                                                        className="p-2 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                        title="Disminuir cantidad"
                                                    >
                                                        <Minus className="w-4 h-4" />
                                                    </button>
                                                    <span className="px-4 text-lg font-semibold text-text-primary">
                                                        {item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdateQuantity(
                                                            item.product.id,
                                                            item.quantity + 1,
                                                            item.variant?.size,
                                                            item.variant?.color
                                                        )}
                                                        className="p-2 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                        disabled={isMutating}
                                                        title="Aumentar cantidad"
                                                    >
                                                        <Plus className="w-4 h-4" />
                                                    </button>
                                                </div>

                                                <div className="text-right">
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-2xl font-bold text-primary">
                                                            ${(finalPrice * item.quantity).toFixed(2)}
                                                        </span>
                                                    </div>
                                                    {hasDiscount && (
                                                        <span className="text-sm text-text-muted line-through">
                                                            ${(item.product.price * item.quantity).toFixed(2)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white border border-border rounded-lg p-6 sticky top-24 space-y-6">
                            <h2 className="text-xl font-bold text-text-primary">
                                Resumen del pedido
                            </h2>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-primary">
                                    ¿Tienes un cupón?
                                </label>
                                {appliedCoupon ? (
                                    <div className="flex items-center justify-between p-3 bg-success/10 border border-success rounded-lg">
                                        <div className="flex items-center gap-2">
                                            <Tag className="w-4 h-4 text-success" />
                                            <span className="font-semibold text-success">
                                                {appliedCoupon?.coupon?.code}
                                            </span>
                                        </div>
                                        <button
                                            onClick={handleRemoveCoupon}
                                            className="p-1 hover:bg-success/20 rounded transition-colors cursor-pointer"
                                            title="Eliminar cupón"
                                        >
                                            <X className="w-4 h-4 text-success" />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2">
                                        <input
                                            type="text"
                                            value={couponCode}
                                            onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                            placeholder="CÓDIGO"
                                            className="flex-1 px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 uppercase"
                                            disabled={isValidating}
                                        />
                                        <button
                                            onClick={handleApplyCoupon}
                                            disabled={isValidating || !couponCode.trim()}
                                            className="px-4 py-2 bg-secondary text-white rounded-lg hover:bg-secondary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 cursor-pointer"
                                        >
                                            {isValidating ? (
                                                <Loader2 className="w-4 h-4 animate-spin" />
                                            ) : (
                                                'Aplicar'
                                            )}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-border">
                                <div className="flex items-center justify-between text-text-secondary">
                                    <span>Subtotal ({itemsCount} {itemsCount === 1 ? 'producto' : 'productos'})</span>
                                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                </div>

                                {cartDiscount > 0 && (
                                    <div className="flex items-center justify-between text-success">
                                        <span>Descuentos de productos</span>
                                        <span className="font-semibold">-${cartDiscount.toFixed(2)}</span>
                                    </div>
                                )}

                                {couponDiscount > 0 && (
                                    <div className="flex items-center justify-between text-success">
                                        <span className="flex items-center gap-1">
                                            <Tag className="w-4 h-4" />
                                            Cupón {appliedCoupon?.coupon?.code}
                                        </span>
                                        <span className="font-semibold">-${couponDiscount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex items-center justify-between text-text-secondary">
                                    <span className="flex items-center gap-1">
                                        <Truck className="w-4 h-4" />
                                        Envío
                                    </span>
                                    {shipping === 0 ? (
                                        <span className="font-semibold text-success">
                                            {freeShipping ? '¡GRATIS CON CUPÓN!' : '¡GRATIS!'}
                                        </span>
                                    ) : (
                                        <span className="font-semibold">${shipping.toFixed(2)}</span>
                                    )}
                                </div>

                                {!freeShipping && totalAfterCoupon < shippingThreshold && (
                                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                                        <p className="text-xs text-blue-800">
                                            <strong>💡 Tip:</strong> Agrega ${(shippingThreshold - totalAfterCoupon).toFixed(2)} más para obtener envío gratis
                                        </p>
                                    </div>
                                )}

                                <div className="pt-4 border-t-2 border-border">
                                    <div className="flex items-center justify-between text-xl font-bold">
                                        <span className="text-text-primary">Total</span>
                                        <span className="text-primary">${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleCheckout}
                                className="w-full py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Finalizar compra
                            </button>

                            <Link
                                href="/products"
                                className="block w-full py-3 text-center text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors cursor-pointer"
                            >
                                Continuar comprando
                            </Link>

                            <div className="pt-6 border-t border-border space-y-3">
                                <div className="flex items-center gap-3 text-sm text-text-muted">
                                    <Shield className="w-5 h-5 text-primary" />
                                    <span>Compra 100% segura</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-muted">
                                    <Truck className="w-5 h-5 text-primary" />
                                    <span>Envío gratis en compras +${shippingThreshold.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-muted">
                                    <Tag className="w-5 h-5 text-primary" />
                                    <span>Cupones y promociones disponibles</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}