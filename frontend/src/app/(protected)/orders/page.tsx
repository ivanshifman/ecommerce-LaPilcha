'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    Package,
    Loader2,
    ChevronRight,
    Filter,
    Calendar,
    CreditCard,
    Truck,
    AlertCircle,
    CheckCircle2,
    XCircle,
    Clock,
} from 'lucide-react';
import { useAuth } from '../../../store/authStore';
import { useOrders, useOrderActions } from '../../../store/orderStore';
import { handleApiError } from '../../../api/error-handler';
import { showError } from '../../../lib/notifications';
import { OrderStatus, PaymentMethod } from '../../../types/order.types';
import type { OrderQueryDto } from '../../../types/order.types';

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
    [PaymentMethod.BANK_TRANSFER]: 'Transferencia',
};

export default function MyOrdersPage() {
    const router = useRouter();
    const { isAuthenticated, isLoading: authLoading } = useAuth();
    const { orders, pagination, isLoading } = useOrders();
    const { fetchMyOrders } = useOrderActions();

    const [filters, setFilters] = useState<OrderQueryDto>({
        page: 1,
        limit: 10,
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login?redirect=/orders');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated) {
            fetchMyOrders(filters).catch((err) => {
                const apiError = handleApiError(err);
                showError(apiError.message || 'Error al cargar órdenes');
            });
        }
    }, [isAuthenticated, filters, fetchMyOrders]);

    const handleFilterChange = (key: keyof OrderQueryDto, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Mis Órdenes</h1>
                    <p className="text-text-muted">
                        Historial completo de tus compras y su estado actual
                    </p>
                </div>

                <div className="bg-white border border-border rounded-lg p-4 mb-6">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-text-primary font-semibold hover:text-primary transition-colors"
                    >
                        <Filter className="w-5 h-5" />
                        Filtros
                        <ChevronRight
                            className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-90' : ''}`}
                        />
                    </button>

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Estado
                                </label>
                                <select
                                    title="Estado"
                                    value={filters.status || ''}
                                    onChange={(e) =>
                                        handleFilterChange('status', e.target.value || undefined)
                                    }
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Todos</option>
                                    {Object.entries(STATUS_CONFIG).map(([key, config]) => (
                                        <option key={key} value={key}>
                                            {config.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Desde
                                </label>
                                <input
                                    type="date"
                                    title="Desde"
                                    value={filters.startDate || ''}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">
                                    Hasta
                                </label>
                                <input
                                    type="date"
                                    title="Hasta"
                                    value={filters.endDate || ''}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white border border-border rounded-lg p-12 text-center">
                        <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-text-primary mb-2">
                            No tienes órdenes aún
                        </h2>
                        <p className="text-text-muted mb-6">
                            Explora nuestra tienda y realiza tu primera compra
                        </p>
                        <Link
                            href="/products"
                            className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                        >
                            Explorar Productos
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const statusConfig = STATUS_CONFIG[order.status];
                            const StatusIcon = statusConfig.icon;
                            const firstItem = order.items[0];

                            return (
                                <Link
                                    key={order.id}
                                    href={`/orders/${order.id}`}
                                    className="block bg-white border border-border rounded-lg p-6 hover:shadow-md transition-shadow"
                                >
                                    <div className="flex flex-col md:flex-row gap-6">
                                        {firstItem && (
                                            <div className="relative w-full md:w-24 h-24 shrink-0">
                                                <Image
                                                    src={firstItem.image || '/imagen-no-disponible.webp'}
                                                    alt={firstItem.name}
                                                    fill
                                                    className="object-cover rounded-lg"
                                                    sizes="96px"
                                                />
                                                {order.items.length > 1 && (
                                                    <div className="absolute -bottom-2 -right-2 bg-primary text-white text-xs font-bold px-2 py-1 rounded-full">
                                                        +{order.items.length - 1}
                                                    </div>
                                                )}
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-4 mb-3">
                                                <div>
                                                    <h3 className="text-lg font-bold text-text-primary mb-1">
                                                        Orden #{order.orderNumber}
                                                    </h3>
                                                    <div className="flex flex-wrap items-center gap-3 text-sm text-text-muted">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-4 h-4" />
                                                            {new Date(order.createdAt!).toLocaleDateString('es-AR', {
                                                                day: '2-digit',
                                                                month: 'short',
                                                                year: 'numeric',
                                                            })}
                                                        </span>
                                                        {order.paymentMethod && (
                                                            <span className="flex items-center gap-1">
                                                                <CreditCard className="w-4 h-4" />
                                                                {PAYMENT_METHOD_LABELS[order.paymentMethod]}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <Package className="w-4 h-4" />
                                                            {order.items.length}{' '}
                                                            {order.items.length === 1 ? 'producto' : 'productos'}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div
                                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg}`}
                                                >
                                                    <StatusIcon className={`w-4 h-4 ${statusConfig.color}`} />
                                                    <span className={`text-sm font-semibold ${statusConfig.color}`}>
                                                        {statusConfig.label}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="mb-3">
                                                <p className="text-sm text-text-secondary line-clamp-2">
                                                    {order.items.map((item) => item.name).join(', ')}
                                                </p>
                                            </div>

                                            <div className="flex items-center justify-between pt-3 border-t border-border">
                                                <span className="text-text-secondary">Total:</span>
                                                <span className="text-xl font-bold text-primary">
                                                    ${order.total.toFixed(2)}
                                                </span>
                                            </div>
                                        </div>

                                        <ChevronRight className="hidden md:block w-6 h-6 text-text-muted self-center" />
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}

                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            onClick={() => handlePageChange(pagination.page - 1)}
                            disabled={pagination.page === 1}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Anterior
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                                <button
                                    key={page}
                                    onClick={() => handlePageChange(page)}
                                    className={`w-10 h-10 rounded-lg font-semibold transition-colors ${page === pagination.page
                                        ? 'bg-primary text-white'
                                        : 'border border-border hover:bg-accent'
                                        }`}
                                >
                                    {page}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => handlePageChange(pagination.page + 1)}
                            disabled={pagination.page === pagination.totalPages}
                            className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Siguiente
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}