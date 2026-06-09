'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
    Package, ChevronRight, Filter, Calendar,
    CreditCard, Truck, AlertCircle, CheckCircle2,
    XCircle, Clock, User,
} from 'lucide-react';
import { useAuth } from '../../../../store/authStore';
import { useOrders, useOrderActions } from '../../../../store/orderStore';
import { handleApiError } from '../../../../api/error-handler';
import { showError } from '../../../../lib/notifications';
import { OrderStatus } from '../../../../types/order.types';
import type { OrderQueryDto } from '../../../../types/order.types';
import { ORDER_STATUS_CONFIG, PAYMENT_METHOD_CONFIG } from '../../../../lib/constants/business';

const STATUS_ICONS = {
    [OrderStatus.PENDING]: Clock,
    [OrderStatus.PAYMENT_PENDING]: Clock,
    [OrderStatus.PAID]: CheckCircle2,
    [OrderStatus.PROCESSING]: Package,
    [OrderStatus.SHIPPED]: Truck,
    [OrderStatus.DELIVERED]: CheckCircle2,
    [OrderStatus.CANCELLED]: XCircle,
    [OrderStatus.REFUND_PENDING]: AlertCircle,
    [OrderStatus.REFUNDED]: CheckCircle2,
    [OrderStatus.FAILED]: XCircle,
} as const;

export default function AdminOrdersClient() {
    const router = useRouter();
    const { user, isInitialized, isLoading: authLoading } = useAuth();
    const { orders, pagination, isLoading } = useOrders();
    const { fetchAllOrders } = useOrderActions();

    const [filters, setFilters] = useState<OrderQueryDto>({ page: 1, limit: 20 });
    const [showFilters, setShowFilters] = useState(false);

    // Protección de ruta en cliente
    useEffect(() => {
        if (isInitialized && (!user || user.role !== 'admin')) {
            router.replace('/');
        }
    }, [isInitialized, user, router]);

    useEffect(() => {
        if (user?.role === 'admin') {
            fetchAllOrders(filters).catch((err) => {
                showError(handleApiError(err).message || 'Error al cargar órdenes');
            });
        }
    }, [user, filters, fetchAllOrders]);

    const handleFilterChange = (key: keyof OrderQueryDto, value: any) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    if (!isInitialized || authLoading || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
            </div>
        );
    }

    if (!user || user.role !== 'admin') return null;

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">Todas las Órdenes</h1>
                    <p className="text-text-muted">Panel de administración — gestión global de pedidos</p>
                </div>

                {/* Filtros */}
                <div className="bg-white border border-border rounded-lg p-4 mb-6">
                    <button
                        type="button"
                        onClick={() => setShowFilters(!showFilters)}
                        className="flex items-center gap-2 text-text-primary font-semibold hover:text-primary transition-colors"
                    >
                        <Filter className="w-5 h-5" />
                        Filtros
                        <ChevronRight className={`w-4 h-4 transition-transform ${showFilters ? 'rotate-90' : ''}`} />
                    </button>

                    {showFilters && (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t border-border">
                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2">Estado</label>
                                <select
                                    title="Estado"
                                    value={filters.status || ''}
                                    onChange={(e) => handleFilterChange('status', e.target.value || undefined)}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                >
                                    <option value="">Todos</option>
                                    {Object.entries(ORDER_STATUS_CONFIG).map(([key, config]) => (
                                        <option key={key} value={key}>{config.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2" htmlFor="startDate">Desde</label>
                                <input
                                    type="date" id="startDate" title="Desde"
                                    value={filters.startDate || ''}
                                    onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-primary mb-2" htmlFor="endDate">Hasta</label>
                                <input
                                    type="date" id="endDate" title="Hasta"
                                    value={filters.endDate || ''}
                                    onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
                                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                                />
                            </div>
                        </div>
                    )}
                </div>

                {/* Lista */}
                {orders.length === 0 ? (
                    <div className="bg-white border border-border rounded-lg p-12 text-center">
                        <Package className="w-16 h-16 text-text-muted mx-auto mb-4" />
                        <h2 className="text-xl font-bold text-text-primary mb-2">No hay órdenes</h2>
                        <p className="text-text-muted">No se encontraron órdenes con los filtros aplicados</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => {
                            const statusConfig = ORDER_STATUS_CONFIG[order.status];
                            const StatusIcon = STATUS_ICONS[order.status];
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
                                                                day: '2-digit', month: 'short', year: 'numeric',
                                                            })}
                                                        </span>
                                                        {order.paymentMethod && (
                                                            <span className="flex items-center gap-1">
                                                                <CreditCard className="w-4 h-4" />
                                                                {PAYMENT_METHOD_CONFIG[order.paymentMethod].shortLabel}
                                                            </span>
                                                        )}
                                                        <span className="flex items-center gap-1">
                                                            <Package className="w-4 h-4" />
                                                            {order.items.length} {order.items.length === 1 ? 'producto' : 'productos'}
                                                        </span>
                                                        {/* Info del cliente */}
                                                        <span className="flex items-center gap-1">
                                                            <User className="w-4 h-4" />
                                                            {order.isGuest
                                                                ? `${order.guestInfo?.fullName} (invitado)`
                                                                : order.shippingAddress.fullName}
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${statusConfig.bg}`}>
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

                {/* Paginación */}
                {pagination && pagination.totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                        <button
                            type="button"
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
                                    type="button"
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
                            type="button"
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