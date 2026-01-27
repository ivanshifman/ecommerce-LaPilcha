'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    ShoppingCart,
    Trash2,
    Plus,
    Minus,
    ArrowLeft,
    Tag,
    Truck,
    Shield,
    X,
    Loader2,
    MapPin,
    Package,
} from 'lucide-react';
import { useCart, useCartActions } from '../../../store/cartStore';
import { useAuth } from '../../../store/authStore';
import { useCoupon, useCouponActions } from '../../../store/couponStore';
import { shippingService } from '../../../services/shipping.service';
import { colorLabels } from '../../../utils/colorMap';
import { showSuccess, showError } from '../../../lib/notifications';
import { handleApiError } from '../../../api/error-handler';
import type { ShippingOption } from '../../../types/shipping.types';

const PROVINCES = [
    'Buenos Aires',
    'Capital Federal',
    'Catamarca',
    'Chaco',
    'Chubut',
    'Córdoba',
    'Corrientes',
    'Entre Ríos',
    'Formosa',
    'Jujuy',
    'La Pampa',
    'La Rioja',
    'Mendoza',
    'Misiones',
    'Neuquén',
    'Río Negro',
    'Salta',
    'San Juan',
    'San Luis',
    'Santa Cruz',
    'Santa Fe',
    'Santiago del Estero',
    'Tierra del Fuego',
    'Tucumán',
];

export default function CartPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { cart, isFetching, isMutating } = useCart();
    const { updateCartItem, removeFromCart, clearCart, fetchCart } = useCartActions();
    const { appliedCoupon, isValidating, discountAmount, freeShipping } = useCoupon();
    const { validateCoupon, removeCoupon } = useCouponActions();

    const [isClearingCart, setIsClearingCart] = useState(false);
    const [couponCode, setCouponCode] = useState('');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState('');
    const [loadingShipping, setLoadingShipping] = useState(false);
    const [shippingCost, setShippingCost] = useState(0);

    useEffect(() => {
        if (isAuthenticated) {
            fetchCart().catch(console.error);
        }
    }, [isAuthenticated, fetchCart]);

    useEffect(() => {
        const calculateShipping = async () => {
            if (!selectedProvince || !cart) return;

            setLoadingShipping(true);
            try {
                const totalWeight = cart.items.reduce((sum, item) => {
                    const weight = item.product.weight || 0.3;
                    return sum + weight * item.quantity;
                }, 0);

                const subtotalAfterDiscounts = cart.total - discountAmount;

                const options = await shippingService.calculateShipping({
                    province: selectedProvince,
                    subtotal: subtotalAfterDiscounts,
                    weight: totalWeight,
                });

                setShippingOptions(options);

                if (options.length > 0 && !selectedShippingMethod) {
                    const firstOption = options[0];
                    setSelectedShippingMethod(firstOption.method);
                    setShippingCost(firstOption.isFree || freeShipping ? 0 : firstOption.cost);
                }
            } catch (err) {
                console.error('Error calculating shipping:', err);
                setShippingOptions([]);
                showError('Error al calcular opciones de envío');
            } finally {
                setLoadingShipping(false);
            }
        };

        calculateShipping();
    }, [selectedProvince, cart, discountAmount, freeShipping]);

    const handleUpdateQuantity = async (
        productId: string,
        newQuantity: number,
        size?: string,
        color?: string
    ) => {
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
            const cartProducts = cart.items.map((item) => item.product.id);
            const cartCategories = Array.from(
                new Set(cart.items.map((item) => item.product.category).filter(Boolean))
            );

            await validateCoupon({
                code: couponCode.trim().toUpperCase(),
                orderTotal: cart.total,
                cartProducts,
                cartCategories,
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

    const handleShippingMethodChange = (method: string) => {
        setSelectedShippingMethod(method);
        const option = shippingOptions.find((opt) => opt.method === method);
        if (option) {
            setShippingCost(option.isFree || freeShipping ? 0 : option.cost);
        }
    };

    const handleCheckout = () => {
        if (!cart || cart.items.length === 0) {
            showError('Tu carrito está vacío');
            return;
        }

        if (!selectedProvince) {
            showError('Selecciona una provincia para calcular el envío');
            return;
        }

        if (!selectedShippingMethod) {
            showError('Selecciona un método de envío');
            return;
        }

        sessionStorage.setItem(
            'checkoutShipping',
            JSON.stringify({
                province: selectedProvince,
                method: selectedShippingMethod,
                cost: shippingCost,
            })
        );

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
                        <h1 className="text-3xl font-bold text-text-primary mb-4">Tu carrito está vacío</h1>
                        <p className="text-text-muted mb-8 max-w-md">
                            Parece que aún no has agregado productos a tu carrito. ¡Explora nuestra tienda y
                            encuentra lo que buscas!
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
    const finalTotal = totalAfterCoupon + shippingCost;

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
                            const hasDiscount =
                                typeof item.product.discount === 'number' && item.product.discount > 0;
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
                                                loading="eager"
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
                                                                    {colorLabels[item.variant.color as keyof typeof colorLabels] ||
                                                                        item.variant.color}
                                                                </span>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        handleRemove(item.product.id, item.variant?.size, item.variant?.color)
                                                    }
                                                    className="p-2 text-destructive hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"
                                                    title="Eliminar"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>

                                            <div className="flex items-end justify-between mt-4">
                                                <div className="flex items-center border-2 border-border rounded-lg">
                                                    <button
                                                        onClick={() =>
                                                            handleUpdateQuantity(
                                                                item.product.id,
                                                                item.quantity - 1,
                                                                item.variant?.size,
                                                                item.variant?.color
                                                            )
                                                        }
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
                                                        onClick={() =>
                                                            handleUpdateQuantity(
                                                                item.product.id,
                                                                item.quantity + 1,
                                                                item.variant?.size,
                                                                item.variant?.color
                                                            )
                                                        }
                                                        disabled={isMutating}
                                                        className="p-2 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
                            <h2 className="text-xl font-bold text-text-primary">Resumen del pedido</h2>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-text-primary">¿Tienes un cupón?</label>
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
                                            {isValidating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Aplicar'}
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-border">
                                <div className="flex items-center gap-2 text-sm font-medium text-text-primary">
                                    <MapPin className="w-4 h-4" />
                                    Calcular envío
                                </div>

                                <select
                                    value={selectedProvince}
                                    title='Selecciona tu provincia'
                                    onChange={(e) => {
                                        setSelectedProvince(e.target.value);
                                        setSelectedShippingMethod('');
                                        setShippingCost(0);
                                    }}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Selecciona tu provincia</option>
                                    {PROVINCES.map((province) => (
                                        <option key={province} value={province}>
                                            {province}
                                        </option>
                                    ))}
                                </select>

                                {loadingShipping && (
                                    <div className="flex items-center justify-center gap-2 text-text-muted py-3">
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        <span className="text-sm">Calculando opciones...</span>
                                    </div>
                                )}

                                {!loadingShipping && shippingOptions.length > 0 && (
                                    <div className="space-y-2">
                                        {shippingOptions.map((option) => (
                                            <label
                                                key={option.method}
                                                className={`flex items-center justify-between p-3 border-2 rounded-lg cursor-pointer transition-all ${selectedShippingMethod === option.method
                                                        ? 'border-primary bg-primary/5'
                                                        : 'border-border hover:border-primary/50'
                                                    }`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <input
                                                        type="radio"
                                                        name="shipping"
                                                        checked={selectedShippingMethod === option.method}
                                                        onChange={() => handleShippingMethodChange(option.method)}
                                                        className="w-4 h-4 text-primary"
                                                    />
                                                    <div>
                                                        <p className="text-sm font-semibold text-text-primary">
                                                            {option.methodLabel}
                                                        </p>
                                                        <p className="text-xs text-text-muted">{option.estimatedDays}</p>
                                                    </div>
                                                </div>
                                                <p
                                                    className={`text-sm font-bold ${option.isFree || freeShipping ? 'text-success' : 'text-primary'
                                                        }`}
                                                >
                                                    {option.isFree || freeShipping
                                                        ? '¡GRATIS!'
                                                        : `$${option.cost.toFixed(2)}`}
                                                </p>
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="space-y-3 pt-4 border-t border-border">
                                <div className="flex items-center justify-between text-text-secondary">
                                    <span>
                                        Subtotal ({itemsCount} {itemsCount === 1 ? 'producto' : 'productos'})
                                    </span>
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

                                {selectedProvince && selectedShippingMethod && (
                                    <div className="flex items-center justify-between text-text-secondary">
                                        <span className="flex items-center gap-1">
                                            <Truck className="w-4 h-4" />
                                            Envío
                                        </span>
                                        <span className={`font-semibold ${shippingCost === 0 ? 'text-success' : ''}`}>
                                            {shippingCost === 0 ? '¡GRATIS!' : `$${shippingCost.toFixed(2)}`}
                                        </span>
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
                                disabled={!selectedProvince || !selectedShippingMethod}
                                className="w-full py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                            >
                                Finalizar compra
                            </button>

                            {!selectedProvince && (
                                <p className="text-xs text-center text-text-muted">
                                    Selecciona una provincia y método de envío para continuar
                                </p>
                            )}

                            <Link
                                href="/products"
                                className="block w-full py-3 text-center text-primary border-2 border-primary rounded-lg font-semibold hover:bg-primary/5 transition-colors"
                            >
                                Continuar comprando
                            </Link>

                            <div className="pt-6 border-t border-border space-y-3">
                                <div className="flex items-center gap-3 text-sm text-text-muted">
                                    <Shield className="w-5 h-5 text-primary" />
                                    <span>Compra 100% segura</span>
                                </div>
                                <div className="flex items-center gap-3 text-sm text-text-muted">
                                    <Package className="w-5 h-5 text-primary" />
                                    <span>Envíos a todo el país</span>
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