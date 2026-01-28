'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import {
    ArrowLeft,
    CreditCard,
    Building2,
    Smartphone,
    AlertCircle,
    Loader2,
    CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../../../../../store/authStore';
import { useOrders, useOrderActions } from '../../../../../store/orderStore';
import { handleApiError } from '../../../../../api/error-handler';
import { showSuccess, showError } from '../../../../../lib/notifications';
import { OrderStatus, PaymentMethod } from '../../../../../types/order.types';
import { paymentService } from '../../../../../services/payment.service';
import { PAYMENT_METHOD_CONFIG } from '../../../../../lib/constants/business';

const PAYMENT_ICONS = {
    [PaymentMethod.MERCADO_PAGO]: CreditCard,
    [PaymentMethod.MODO]: Smartphone,
    [PaymentMethod.BANK_TRANSFER]: Building2,
} as const;

const paymentMethods = Object.values(PAYMENT_METHOD_CONFIG);

export default function OrderPaymentPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params?.id as string;

    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { currentOrder, isLoading } = useOrders();
    const { fetchOrderById, clearCurrentOrder } = useOrderActions();

    const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/orders');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated && orderId) {
            fetchOrderById(orderId).catch((err) => {
                const apiError = handleApiError(err);
                showError(apiError.message || 'Error al cargar orden');
                router.push('/orders');
            });
        }

        return () => {
            clearCurrentOrder();
        };
    }, [isAuthenticated, orderId, fetchOrderById, clearCurrentOrder, router]);

    useEffect(() => {
        if (currentOrder?.paymentMethod) {
            setSelectedMethod(currentOrder.paymentMethod);
        }
    }, [currentOrder]);

    useEffect(() => {
        if (currentOrder && currentOrder.paymentMethod === PaymentMethod.BANK_TRANSFER) {
            showError('Esta orden fue configurada para pago por transferencia bancaria');
            router.push(`/orders/${orderId}`);
        }
    }, [currentOrder, orderId, router]);

    const handlePayment = async () => {
        if (!selectedMethod || !currentOrder) return;

        setIsProcessing(true);
        try {
            const payment = await paymentService.createPayment({
                orderId: currentOrder.id,
                method: selectedMethod,
            });

            showSuccess('Redirigiendo al pago...');

            if (payment.checkoutUrl) {
                window.location.href = payment.checkoutUrl;
            } else {
                router.push(`/orders/${orderId}`);
                showSuccess('Instrucciones de pago enviadas por email');
            }
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al procesar el pago');
        } finally {
            setIsProcessing(false);
        }
    };

    if (authLoading || isLoading || !currentOrder) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return null;
    }

    const order = currentOrder;

    if (order.status !== OrderStatus.PAYMENT_PENDING && order.status !== OrderStatus.PENDING) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="bg-white border border-border rounded-lg p-8 max-w-md w-full text-center">
                    <AlertCircle className="w-16 h-16 text-warning mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                        Esta orden no requiere pago
                    </h2>
                    <p className="text-text-muted mb-6">
                        La orden ya fue pagada o está en un estado que no permite realizar el pago.
                    </p>
                    <button
                        onClick={() => router.push(`/orders/${orderId}`)}
                        className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                    >
                        Ver Orden
                    </button>
                </div>
            </div>
        );
    }

    const calculateDiscount = (method: PaymentMethod) => {
        if (method === PaymentMethod.BANK_TRANSFER) {
            return order.total * 0.1;
        }
        return 0;
    };

    const calculateTotal = (method: PaymentMethod) => {
        return order.total - calculateDiscount(method);
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-8">
                <button
                    onClick={() => router.push(`/orders/${orderId}`)}
                    className="flex items-center gap-2 text-text-muted hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver a la orden
                </button>

                <div className="mb-6">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        Completar Pago
                    </h1>
                    <p className="text-text-muted">
                        Orden #{order.orderNumber}
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <div className="bg-white border border-border rounded-lg p-6 mb-6">
                            <h2 className="text-xl font-bold text-text-primary mb-4">
                                Método de pago seleccionado
                            </h2>

                            <div className="space-y-3">
                                {paymentMethods.map((method) => {
                                    const Icon = PAYMENT_ICONS[method.id];
                                    const isSelected = selectedMethod === method.id;
                                    const discount = calculateDiscount(method.id);
                                    const isOriginalMethod = currentOrder?.paymentMethod === method.id;

                                    return (
                                        <button
                                            key={method.id}
                                            onClick={() => setSelectedMethod(method.id)}
                                            disabled={!isOriginalMethod}
                                            className={`w-full p-4 border-2 rounded-lg text-left transition-all ${!isOriginalMethod
                                                ? 'opacity-40 cursor-not-allowed'
                                                : 'cursor-pointer'
                                                } ${isSelected
                                                    ? 'border-primary bg-primary/5'
                                                    : 'border-border hover:border-primary/50'
                                                }`}
                                        >
                                            <div className="flex items-center gap-4">
                                                <div
                                                    className={`p-3 rounded-lg ${isSelected
                                                        ? 'bg-primary text-white'
                                                        : 'bg-accent'
                                                        }`}
                                                >
                                                    <Icon className="w-6 h-6" />
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="font-bold text-text-primary">
                                                            {method.label}
                                                        </h3>
                                                        {method.discount > 0 && isOriginalMethod && (
                                                            <span className="px-2 py-0.5 bg-success text-white text-xs font-bold rounded-full">
                                                                -{method.discount}%
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-text-muted">
                                                        {method.description}
                                                    </p>
                                                    {discount > 0 && isOriginalMethod && (
                                                        <p className="text-sm text-success font-semibold mt-1">
                                                            Ahorras ${discount.toFixed(2)}
                                                        </p>
                                                    )}
                                                </div>
                                                {isSelected && (
                                                    <CheckCircle2 className="w-6 h-6 text-primary" />
                                                )}
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                            <div className="flex gap-3">
                                <AlertCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                                <div className="text-sm text-text-primary">
                                    <p className="font-semibold mb-1">Importante</p>
                                    <p>
                                        Una vez procesado el pago, recibirás un email de confirmación
                                        con los detalles de tu orden.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="bg-white border border-border rounded-lg p-6 sticky top-4">
                            <h2 className="text-xl font-bold text-text-primary mb-4">
                                Resumen de Pago
                            </h2>

                            <div className="space-y-4 mb-6">
                                {order.items.slice(0, 2).map((item, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="relative w-16 h-16 shrink-0">
                                            <Image
                                                src={item.image || '/imagen-no-disponible.webp'}
                                                alt={item.name}
                                                fill
                                                className="object-cover rounded"
                                                sizes="64px"
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-text-primary line-clamp-2">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-text-muted">
                                                x{item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {order.items.length > 2 && (
                                    <p className="text-sm text-text-muted text-center">
                                        +{order.items.length - 2} productos más
                                    </p>
                                )}
                            </div>

                            <div className="space-y-2 py-4 border-t border-border">
                                <div className="flex justify-between text-text-secondary">
                                    <span>Subtotal</span>
                                    <span>${order.subtotal.toFixed(2)}</span>
                                </div>

                                {order.discount > 0 && (
                                    <div className="flex justify-between text-success">
                                        <span>Descuento</span>
                                        <span>-${order.discount.toFixed(2)}</span>
                                    </div>
                                )}

                                <div className="flex justify-between text-text-secondary">
                                    <span>Envío</span>
                                    <span>
                                        {order.shippingCost === 0
                                            ? 'Gratis'
                                            : `$${order.shippingCost.toFixed(2)}`}
                                    </span>
                                </div>

                                {selectedMethod &&
                                    calculateDiscount(selectedMethod) > 0 && (
                                        <div className="flex justify-between text-success font-semibold">
                                            <span>Desc. Transferencia</span>
                                            <span>
                                                -${calculateDiscount(selectedMethod).toFixed(2)}
                                            </span>
                                        </div>
                                    )}

                                <div className="pt-2 border-t border-border flex justify-between">
                                    <span className="font-bold text-text-primary text-lg">
                                        Total a pagar
                                    </span>
                                    <span className="font-bold text-primary text-xl">
                                        $
                                        {selectedMethod
                                            ? calculateTotal(selectedMethod).toFixed(2)
                                            : order.total.toFixed(2)}
                                    </span>
                                </div>
                            </div>

                            <button
                                onClick={handlePayment}
                                disabled={!selectedMethod || isProcessing}
                                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-semibold flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isProcessing ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Procesando...
                                    </>
                                ) : (
                                    <>
                                        <CreditCard className="w-5 h-5" />
                                        Continuar al Pago
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
};