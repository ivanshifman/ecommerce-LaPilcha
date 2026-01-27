'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import {
    ArrowLeft,
    Package,
    Calendar,
    CreditCard,
    MapPin,
    Truck,
    CheckCircle2,
    XCircle,
    Clock,
    AlertCircle,
    Loader2,
} from 'lucide-react';
import { useAuth } from '../../../../store/authStore';
import { useOrders, useOrderActions } from '../../../../store/orderStore';
import { handleApiError } from '../../../../api/error-handler';
import { showSuccess, showError } from '../../../../lib/notifications';
import { OrderStatus, PaymentMethod } from '../../../../types/order.types';

const STATUS_CONFIG = {
    [OrderStatus.PENDING]: {
        label: 'Pendiente',
        color: 'text-warning',
        bg: 'bg-warning/10',
        icon: Clock,
    },
    [OrderStatus.PAYMENT_PENDING]: {
        label: 'Pago Pendiente',
        color: 'text-warning',
        bg: 'bg-warning/10',
        icon: Clock,
    },
    [OrderStatus.PAID]: {
        label: 'Pagado',
        color: 'text-info',
        bg: 'bg-info/10',
        icon: CheckCircle2,
    },
    [OrderStatus.PROCESSING]: {
        label: 'Procesando',
        color: 'text-info',
        bg: 'bg-info/10',
        icon: Package,
    },
    [OrderStatus.SHIPPED]: {
        label: 'Enviado',
        color: 'text-primary',
        bg: 'bg-primary/10',
        icon: Truck,
    },
    [OrderStatus.DELIVERED]: {
        label: 'Entregado',
        color: 'text-success',
        bg: 'bg-success/10',
        icon: CheckCircle2,
    },
    [OrderStatus.CANCELLED]: {
        label: 'Cancelado',
        color: 'text-destructive',
        bg: 'bg-destructive/10',
        icon: XCircle,
    },
    [OrderStatus.REFUND_PENDING]: {
        label: 'Devolución Pendiente',
        color: 'text-warning',
        bg: 'bg-warning/10',
        icon: AlertCircle,
    },
    [OrderStatus.REFUNDED]: {
        label: 'Reembolsado',
        color: 'text-text-muted',
        bg: 'bg-muted',
        icon: CheckCircle2,
    },
    [OrderStatus.FAILED]: {
        label: 'Fallido',
        color: 'text-destructive',
        bg: 'bg-destructive/10',
        icon: XCircle,
    },
};

const PAYMENT_METHOD_LABELS = {
    [PaymentMethod.MERCADO_PAGO]: 'Mercado Pago',
    [PaymentMethod.MODO]: 'Modo',
    [PaymentMethod.BANK_TRANSFER]: 'Transferencia Bancaria',
};

const CANCELLABLE_STATUSES = [
    OrderStatus.PENDING,
    OrderStatus.PAYMENT_PENDING,
];

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const orderId = params?.id as string;

    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { currentOrder, isLoading } = useOrders();
    const { fetchOrderById, cancelOrder, clearCurrentOrder } = useOrderActions();

    const [isCancelling, setIsCancelling] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [cancelReason, setCancelReason] = useState('');

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/orders');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated && orderId) {
            fetchOrderById(orderId).catch(() => {
                showError('Error al cargar orden');
                router.push('/orders');
            });
        }

        return () => {
            clearCurrentOrder();
        };
    }, [isAuthenticated, orderId, fetchOrderById, clearCurrentOrder, router]);

    const handleCancelOrder = async () => {
        if (!cancelReason.trim()) {
            showError('Por favor ingresa un motivo de cancelación');
            return;
        }

        setIsCancelling(true);
        try {
            await cancelOrder(orderId, { reason: cancelReason });
            showSuccess('Orden cancelada exitosamente');
            setShowCancelModal(false);
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al cancelar orden');
        } finally {
            setIsCancelling(false);
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
    const statusConfig = STATUS_CONFIG[order.status];
    const StatusIcon = statusConfig.icon;
    const canCancel = CANCELLABLE_STATUSES.includes(order.status);
    const showPaymentButton = order.status === OrderStatus.PAYMENT_PENDING && order.paymentMethod !== PaymentMethod.BANK_TRANSFER

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-6xl mx-auto px-4 py-8">
                <button
                    onClick={() => router.push('/orders')}
                    className="flex items-center gap-2 text-text-muted hover:text-primary mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Volver a mis órdenes
                </button>

                <div className="mb-6 flex items-start justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-text-primary mb-2">
                            Orden #{order.orderNumber}
                        </h1>
                        <div className="flex items-center gap-3 text-sm text-text-muted">
                            <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {new Date(order.createdAt!).toLocaleDateString('es-AR', {
                                    day: '2-digit',
                                    month: 'long',
                                    year: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                })}
                            </span>
                        </div>
                    </div>

                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${statusConfig.bg}`}>
                        <StatusIcon className={`w-5 h-5 ${statusConfig.color}`} />
                        <span className={`font-semibold ${statusConfig.color}`}>
                            {statusConfig.label}
                        </span>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <div className="bg-white border border-border rounded-lg p-6">
                            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                                <Package className="w-5 h-5" />
                                Productos
                            </h2>

                            <div className="space-y-4">
                                {order.items.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex gap-4 pb-4 border-b border-border last:border-0"
                                    >
                                        <div className="relative w-20 h-20 shrink-0">
                                            <Image
                                                src={item.image || '/imagen-no-disponible.webp'}
                                                alt={item.name}
                                                fill
                                                className="object-cover rounded-lg"
                                                sizes="80px"
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-semibold text-text-primary mb-1">
                                                {item.name}
                                            </h3>
                                            <p className="text-sm text-text-muted mb-2">
                                                Código: {item.code}
                                            </p>
                                            {item.variant?.size && (
                                                <p className="text-sm text-text-secondary">
                                                    Talle: {item.variant.size}
                                                </p>
                                            )}
                                            {item.variant?.color && (
                                                <p className="text-sm text-text-secondary">
                                                    Color: {item.variant.color}
                                                </p>
                                            )}
                                        </div>

                                        <div className="text-right">
                                            <p className="text-sm text-text-muted mb-1">
                                                Cantidad: {item.quantity}
                                            </p>
                                            <p className="font-bold text-primary">
                                                ${item.subtotal.toFixed(2)}
                                            </p>
                                            {item.discount > 0 && (
                                                <p className="text-xs text-destructive">
                                                    -{item.discount}% desc.
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white border border-border rounded-lg p-6">
                            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                                <MapPin className="w-5 h-5" />
                                Dirección de Envío
                            </h2>

                            <div className="space-y-2 text-text-secondary">
                                <p className="font-semibold text-text-primary">
                                    {order.shippingAddress.fullName}
                                </p>
                                <p>{order.shippingAddress.address}</p>
                                <p>
                                    {order.shippingAddress.city}, {order.shippingAddress.state}{' '}
                                    {order.shippingAddress.zipCode}
                                </p>
                                <p>{order.shippingAddress.country || 'Argentina'}</p>
                                {order.shippingAddress.phone && (
                                    <p className="flex items-center gap-2 mt-3">
                                        <span className="text-text-muted">Teléfono:</span>
                                        {order.shippingAddress.phone}
                                    </p>
                                )}
                            </div>

                            {order.trackingNumber && (
                                <div className="mt-4 pt-4 border-t border-border">
                                    <div className="flex items-center gap-2 text-primary">
                                        <Truck className="w-5 h-5" />
                                        <div>
                                            <p className="text-sm text-text-muted">
                                                Número de seguimiento
                                            </p>
                                            <p className="font-mono font-semibold">
                                                {order.trackingNumber}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {order.statusHistory && (
                            <div className="bg-white border border-border rounded-lg p-6">
                                <h2 className="text-xl font-bold text-text-primary mb-4">
                                    Notas del Pedido
                                </h2>
                                <p className="text-text-secondary">{order.statusHistory[0].note}</p>
                            </div>
                        )}
                    </div>

                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-white border border-border rounded-lg p-6">
                            <h2 className="text-xl font-bold text-text-primary mb-4">
                                Resumen
                            </h2>

                            <div className="space-y-3">
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

                                {order.bankTransferDiscount && order.bankTransferDiscount > 0 && (
                                    <div className="flex justify-between text-success">
                                        <span>Desc. Transferencia (10%)</span>
                                        <span>-${order.bankTransferDiscount.toFixed(2)}</span>
                                    </div>
                                )}

                                {order.couponApplied && (
                                    <div className="flex justify-between text-success">
                                        <span>Cupón ({order.couponApplied.code})</span>
                                        <span>-${order.couponApplied.discountAmount.toFixed(2)}</span>
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

                                <div className="pt-3 border-t border-border flex justify-between">
                                    <span className="font-bold text-text-primary text-lg">
                                        Total
                                    </span>
                                    <span className="font-bold text-primary text-xl">
                                        ${order.total.toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-border rounded-lg p-6">
                            <h2 className="text-xl font-bold text-text-primary mb-4 flex items-center gap-2">
                                <CreditCard className="w-5 h-5" />
                                Pago
                            </h2>

                            <div className="space-y-3">
                                <div>
                                    <p className="text-sm text-text-muted mb-1">Método de pago</p>
                                    <p className="font-semibold text-text-primary">
                                        {order.paymentMethod
                                            ? PAYMENT_METHOD_LABELS[order.paymentMethod]
                                            : 'No especificado'}
                                    </p>
                                </div>

                                {order.paymentDetails?.transactionId && (
                                    <div>
                                        <p className="text-sm text-text-muted mb-1">
                                            ID de transacción
                                        </p>
                                        <p className="font-mono text-sm text-text-primary">
                                            {order.paymentDetails.transactionId}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {showPaymentButton && (
                            <button
                                onClick={() => router.push(`/checkout/payment/${orderId}`)}
                                className="w-full py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-semibold cursor-pointer mb-3"
                            >
                                Realizar Pago
                            </button>
                        )}

                        {canCancel && (
                            <button
                                onClick={() => setShowCancelModal(true)}
                                className="w-full py-3 border-2 border-destructive text-destructive rounded-lg hover:bg-destructive hover:text-white transition-colors font-semibold cursor-pointer"
                            >
                                Cancelar Orden
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {showCancelModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-xl font-bold text-text-primary mb-4">
                            Cancelar Orden
                        </h3>
                        <p className="text-text-secondary mb-4">
                            Por favor indica el motivo de la cancelación:
                        </p>
                        <textarea
                            value={cancelReason}
                            onChange={(e) => setCancelReason(e.target.value)}
                            className="w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 mb-4"
                            rows={4}
                            placeholder="Ej: Cambié de opinión, encontré mejor precio..."
                        />
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowCancelModal(false)}
                                disabled={isCancelling}
                                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                            >
                                Volver
                            </button>
                            <button
                                onClick={handleCancelOrder}
                                disabled={isCancelling || !cancelReason.trim()}
                                className="flex-1 px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                            >
                                {isCancelling ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Cancelando...
                                    </>
                                ) : (
                                    'Confirmar Cancelación'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}