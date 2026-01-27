'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import {
    ShoppingCart,
    ArrowLeft,
    MapPin,
    CreditCard,
    Tag,
    Shield,
    Loader2,
    AlertCircle,
    Truck,
    User,
    Mail,
    Phone,
    Home,
    FileText,
} from 'lucide-react';
import { useCart, useCartActions } from '../../../store/cartStore';
import { useAuth } from '../../../store/authStore';
import { useCoupon, useCouponActions } from '../../../store/couponStore';
import { useOrderActions } from '../../../store/orderStore';
import { paymentService } from '../../../services/payment.service';
import { colorLabels } from '../../../utils/colorMap';
import { showSuccess, showError } from '../../../lib/notifications';
import { handleApiError } from '../../../api/error-handler';
import { ShippingMethod, PaymentMethod } from '../../../types/order.types';
import { CheckoutFormData, checkoutSchema } from '../../../schemas/checkout.schema';
import { PhoneInput } from '../../../components/forms/PhoneInput';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart, isFetching } = useCart();
    const { user, isAuthenticated } = useAuth();
    const { fetchCart } = useCartActions();
    const { appliedCoupon, discountAmount } = useCoupon();
    const { removeCoupon } = useCouponActions();
    const { createOrder } = useOrderActions();

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod>(PaymentMethod.MERCADO_PAGO);

    const [shippingInfo, setShippingInfo] = useState<{
        province: string;
        method: string;
        cost: number;
    } | null>(null);

    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
    } = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            fullName: '',
            phone: '',
            address: '',
            city: '',
            state: '',
            zipCode: '',
            additionalInfo: '',
            guestFullname: '',
            guestEmail: '',
            guestPhone: '',
        },
    });

    useEffect(() => {
        fetchCart().catch(console.error);

        const savedShipping = sessionStorage.getItem('checkoutShipping');
        if (savedShipping) {
            const parsed = JSON.parse(savedShipping);
            setShippingInfo(parsed);
            setValue('state', parsed.province);
        }
    }, [fetchCart, setValue]);

    useEffect(() => {
        if (isAuthenticated) {
            setValue('guestEmail', undefined);
            setValue('guestFullname', undefined);
            setValue('guestPhone', undefined);
        }
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isFetching && cart && cart.items.length === 0) {
            router.push('/cart');
        }
    }, [cart, isFetching, router]);

    const onSubmit = async (data: CheckoutFormData) => {
        if (!cart || cart.items.length === 0) {
            showError('Tu carrito está vacío');
            return;
        }

        if (!shippingInfo) {
            showError('Información de envío no encontrada');
            router.push('/cart');
            return;
        }

        setIsSubmitting(true);
        try {
            const orderData = {
                shippingAddress: {
                    fullName: data.fullName,
                    phone: data.phone,
                    address: data.address,
                    city: data.city,
                    state: data.state,
                    zipCode: data.zipCode,
                    country: 'Argentina',
                    additionalInfo: data.additionalInfo,
                },
                paymentMethod: selectedPaymentMethod,
                shippingMethod: shippingInfo.method as ShippingMethod,
                couponCode: appliedCoupon?.coupon?.code,
                ...((!isAuthenticated || !user) && {
                    guestInfo: {
                        email: data.guestEmail!,
                        fullName: data.guestFullname!,
                        phone: data.guestPhone!,
                    },
                }),
            };

            const order = await createOrder(orderData);
            showSuccess('¡Orden creada exitosamente!');

            const payment = await paymentService.createPayment({
                orderId: order.id,
                method: selectedPaymentMethod,
            });

            removeCoupon();
            sessionStorage.removeItem('checkoutShipping');

            if (selectedPaymentMethod === PaymentMethod.BANK_TRANSFER) {
                showSuccess('Revisa tu email para completar la transferencia');
                router.push(`/orders/${order.id}`);
                return;
            }

            if (payment.checkoutUrl) {
                window.location.href = payment.checkoutUrl;
            } else {
                showError('No se pudo generar el link de pago');
                router.push(`/orders/${order.id}`);
            }
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al procesar la orden');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isFetching) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
            </div>
        );
    }

    if (!cart || cart.items.length === 0) {
        return null;
    }

    if (!shippingInfo) {
        return null;
    }

    const subtotal = cart.subtotal;
    const cartDiscount = cart.discount;
    const couponDiscount = discountAmount;
    const totalAfterCoupon = cart.total - couponDiscount;
    const shippingCost = shippingInfo.cost;
    const bankTransferDiscount =
        selectedPaymentMethod === PaymentMethod.BANK_TRANSFER ? totalAfterCoupon * 0.1 : 0;

    const finalTotal = totalAfterCoupon - bankTransferDiscount + shippingCost;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 text-text-muted hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al carrito
                    </Link>
                    <h1 className="text-3xl font-bold text-text-primary">Finalizar Compra</h1>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {(!isAuthenticated || !user) && (
                                <div className="bg-white border border-border rounded-lg p-6">
                                    <div className="flex items-center gap-2 mb-6">
                                        <User className="w-5 h-5 text-primary" />
                                        <h2 className="text-xl font-bold text-text-primary">
                                            Información de Contacto
                                        </h2>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-medium text-text-primary mb-2">
                                                Nombre Completo *
                                            </label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                <input
                                                    {...register('guestFullname', { required: !isAuthenticated })}
                                                    type="text"
                                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.guestFullname ? 'border-destructive' : 'border-border'
                                                        }`}
                                                    placeholder="Nombre Completo"
                                                />
                                            </div>
                                            {errors.guestFullname && (
                                                <p className="text-sm text-destructive mt-1">{errors.guestFullname.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text-primary mb-2">
                                                Email *
                                            </label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                <input
                                                    {...register('guestEmail', { required: !isAuthenticated })}
                                                    type="email"
                                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.guestEmail ? 'border-destructive' : 'border-border'
                                                        }`}
                                                    placeholder="Email"
                                                />
                                            </div>
                                            {errors.guestEmail && (
                                                <p className="text-sm text-destructive mt-1">{errors.guestEmail.message}</p>
                                            )}
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-text-primary mb-2">
                                                Teléfono *
                                            </label>
                                            <div className="relative">
                                                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                                <input
                                                    {...register('guestPhone', { required: !isAuthenticated })}
                                                    type="tel"
                                                    className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.guestPhone ? 'border-destructive' : 'border-border'
                                                        }`}
                                                    placeholder="+54 9 11 1234-5678"
                                                />
                                            </div>
                                            {errors.guestPhone && (
                                                <p className="text-sm text-destructive mt-1">{errors.guestPhone.message}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="bg-white border border-border rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <MapPin className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-bold text-text-primary">Dirección de Envío</h2>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Nombre Completo *
                                        </label>
                                        <div className="relative">
                                            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                            <input
                                                {...register('fullName')}
                                                type="text"
                                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.fullName ? 'border-destructive' : 'border-border'
                                                    }`}
                                                placeholder="Nombre Completo"
                                            />
                                        </div>
                                        {errors.fullName && (
                                            <p className="text-sm text-destructive mt-1">{errors.fullName.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <Controller
                                            name="phone"
                                            control={control}
                                            defaultValue=""
                                            render={({ field }) => (
                                                <PhoneInput
                                                    label="Teléfono *"
                                                    error={errors.phone?.message}
                                                    {...field}
                                                />
                                            )}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Código Postal *
                                        </label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                            <input
                                                {...register('zipCode')}
                                                type="text"
                                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.zipCode ? 'border-destructive' : 'border-border'
                                                    }`}
                                                placeholder="1234"
                                            />
                                        </div>
                                        {errors.zipCode && (
                                            <p className="text-sm text-destructive mt-1">{errors.zipCode.message}</p>
                                        )}
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Dirección *
                                        </label>
                                        <div className="relative">
                                            <Home className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                                            <input
                                                {...register('address')}
                                                type="text"
                                                className={`w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.address ? 'border-destructive' : 'border-border'
                                                    }`}
                                                placeholder="Dirección"
                                            />
                                        </div>
                                        {errors.address && (
                                            <p className="text-sm text-destructive mt-1">{errors.address.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Ciudad *
                                        </label>
                                        <input
                                            {...register('city')}
                                            type="text"
                                            className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${errors.city ? 'border-destructive' : 'border-border'
                                                }`}
                                            placeholder="Ciudad"
                                        />
                                        {errors.city && (
                                            <p className="text-sm text-destructive mt-1">{errors.city.message}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Provincia *
                                        </label>
                                        <input
                                            {...register('state')}
                                            type="text"
                                            disabled
                                            className="w-full px-4 py-2 border border-border rounded-lg bg-muted cursor-not-allowed"
                                            placeholder={shippingInfo.province}
                                        />
                                        <p className="text-xs text-text-muted mt-1">
                                            Definida en el carrito
                                        </p>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-medium text-text-primary mb-2">
                                            Información Adicional
                                        </label>
                                        <div className="relative">
                                            <FileText className="absolute left-3 top-3 w-4 h-4 text-text-muted" />
                                            <textarea
                                                {...register('additionalInfo')}
                                                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                                                rows={3}
                                                placeholder="Ej: Piso, departamento, referencias..."
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white border border-border rounded-lg p-6">
                                <div className="flex items-center gap-2 mb-6">
                                    <CreditCard className="w-5 h-5 text-primary" />
                                    <h2 className="text-xl font-bold text-text-primary">Método de Pago</h2>
                                </div>

                                <div className="space-y-3">
                                    <label
                                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === 'mercado_pago'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={selectedPaymentMethod === PaymentMethod.MERCADO_PAGO}
                                                onChange={() => setSelectedPaymentMethod(PaymentMethod.MERCADO_PAGO)}
                                                className="w-4 h-4 text-primary"
                                            />
                                            <div>
                                                <p className="font-semibold text-text-primary">Mercado Pago</p>
                                                <p className="text-sm text-text-muted">
                                                    Tarjeta de crédito, débito, efectivo
                                                </p>
                                            </div>
                                        </div>
                                    </label>

                                    <label
                                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === 'modo'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={selectedPaymentMethod === PaymentMethod.MODO}
                                                onChange={() => setSelectedPaymentMethod(PaymentMethod.MODO)}
                                                className="w-4 h-4 text-primary"
                                            />
                                            <div>
                                                <p className="font-semibold text-text-primary">Modo</p>
                                                <p className="text-sm text-text-muted">Pago digital con CVU</p>
                                            </div>
                                        </div>
                                    </label>

                                    <label
                                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition-all ${selectedPaymentMethod === 'bank_transfer'
                                            ? 'border-primary bg-primary/5'
                                            : 'border-border hover:border-primary/50'
                                            }`}
                                    >
                                        <div className="flex items-center gap-4">
                                            <input
                                                type="radio"
                                                name="payment"
                                                checked={selectedPaymentMethod === PaymentMethod.BANK_TRANSFER}
                                                onChange={() => setSelectedPaymentMethod(PaymentMethod.BANK_TRANSFER)}
                                                className="w-4 h-4 text-primary"
                                            />
                                            <div>
                                                <p className="font-semibold text-text-primary">Transferencia Bancaria</p>
                                                <p className="text-sm text-success font-medium">¡10% de descuento!</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-bold text-success">-10%</p>
                                        </div>
                                    </label>
                                </div>

                                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg flex items-start gap-3">
                                    <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                                    <div className="text-sm text-blue-800">
                                        <p className="font-semibold mb-1">Información importante:</p>
                                        <p>
                                            {selectedPaymentMethod === PaymentMethod.BANK_TRANSFER
                                                ? 'Recibirás los datos bancarios por email para completar la transferencia.'
                                                : 'Serás redirigido a la plataforma de pago seleccionada para completar tu compra de forma segura.'}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-primary text-white rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    'Confirmar Pedido'
                                )}
                            </button>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white border border-border rounded-lg p-6 sticky top-24 space-y-6">
                                <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
                                    <ShoppingCart className="w-5 h-5" />
                                    Resumen del Pedido
                                </h2>

                                <div className="space-y-3 max-h-60 overflow-y-auto">
                                    {cart.items.map((item, index) => {
                                        const hasDiscount =
                                            typeof item.product.discount === 'number' && item.product.discount > 0;
                                        const finalPrice = hasDiscount
                                            ? item.product.price * (1 - item.product.discount! / 100)
                                            : item.product.price;

                                        return (
                                            <div key={index} className="flex gap-3">
                                                <div className="relative w-16 h-16 shrink-0">
                                                    <Image
                                                        src={item.product.images?.[0] || '/imagen-no-disponible.webp'}
                                                        alt={item.product.name}
                                                        fill
                                                        className="object-cover rounded"
                                                        sizes="64px"
                                                    />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-medium text-text-primary line-clamp-1">
                                                        {item.product.name}
                                                    </p>
                                                    {item.variant && (
                                                        <p className="text-xs text-text-muted">
                                                            {item.variant.size}
                                                            {item.variant.color &&
                                                                ` • ${colorLabels[item.variant.color as keyof typeof colorLabels]}`}
                                                        </p>
                                                    )}
                                                    <p className="text-sm text-text-muted">
                                                        {item.quantity} x ${finalPrice.toFixed(2)}
                                                    </p>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>

                                <div className="space-y-2 pt-4 border-t border-border">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Subtotal:</span>
                                        <span className="font-semibold">${subtotal.toFixed(2)}</span>
                                    </div>

                                    {cartDiscount > 0 && (
                                        <div className="flex justify-between text-sm text-success">
                                            <span>Descuentos:</span>
                                            <span className="font-semibold">-${cartDiscount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    {couponDiscount > 0 && (
                                        <div className="flex justify-between text-sm text-success">
                                            <span className="flex items-center gap-1">
                                                <Tag className="w-3 h-3" />
                                                Cupón:
                                            </span>
                                            <span className="font-semibold">-${couponDiscount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-sm">
                                        <span className="flex items-center gap-1">
                                            <Truck className="w-3 h-3" />
                                            Envío:
                                        </span>
                                        <span className={`font-semibold ${shippingCost === 0 ? 'text-success' : ''}`}>
                                            {shippingCost === 0 ? '¡GRATIS!' : `$${shippingCost.toFixed(2)}`}
                                        </span>
                                    </div>

                                    {bankTransferDiscount > 0 && (
                                        <div className="flex justify-between text-sm text-success">
                                            <span>Desc. Transferencia (10%):</span>
                                            <span className="font-semibold">-${bankTransferDiscount.toFixed(2)}</span>
                                        </div>
                                    )}

                                    <div className="flex justify-between text-lg font-bold pt-2 border-t border-border">
                                        <span className="text-text-primary">Total:</span>
                                        <span className="text-primary">${finalTotal.toFixed(2)}</span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-border space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <Shield className="w-4 h-4 text-primary" />
                                        <span>Pago 100% seguro</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-text-muted">
                                        <Truck className="w-4 h-4 text-primary" />
                                        <span>Envío con seguimiento</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}