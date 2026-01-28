import { OrderStatus, PaymentMethod } from '../../types/order.types';

export const ORDER_STATUS_CONFIG = {
    [OrderStatus.PENDING]: {
        label: 'Pendiente',
        color: 'text-warning',
        bg: 'bg-warning/10',
        description: 'La orden está siendo procesada',
    },
    [OrderStatus.PAYMENT_PENDING]: {
        label: 'Pago Pendiente',
        color: 'text-warning',
        bg: 'bg-warning/10',
        description: 'Esperando confirmación de pago',
    },
    [OrderStatus.PAID]: {
        label: 'Pagado',
        color: 'text-info',
        bg: 'bg-info/10',
        description: 'El pago fue confirmado',
    },
    [OrderStatus.PROCESSING]: {
        label: 'Procesando',
        color: 'text-info',
        bg: 'bg-info/10',
        description: 'Preparando tu pedido',
    },
    [OrderStatus.SHIPPED]: {
        label: 'Enviado',
        color: 'text-primary',
        bg: 'bg-primary/10',
        description: 'Tu pedido está en camino',
    },
    [OrderStatus.DELIVERED]: {
        label: 'Entregado',
        color: 'text-success',
        bg: 'bg-success/10',
        description: 'Pedido entregado exitosamente',
    },
    [OrderStatus.CANCELLED]: {
        label: 'Cancelado',
        color: 'text-destructive',
        bg: 'bg-destructive/10',
        description: 'La orden fue cancelada',
    },
    [OrderStatus.REFUND_PENDING]: {
        label: 'Devolución Pendiente',
        color: 'text-warning',
        bg: 'bg-warning/10',
        description: 'Procesando devolución',
    },
    [OrderStatus.REFUNDED]: {
        label: 'Reembolsado',
        color: 'text-text-muted',
        bg: 'bg-muted',
        description: 'Reembolso completado',
    },
    [OrderStatus.FAILED]: {
        label: 'Fallido',
        color: 'text-destructive',
        bg: 'bg-destructive/10',
        description: 'La orden falló',
    },
} as const;

export const PAYMENT_METHOD_CONFIG = {
    [PaymentMethod.MERCADO_PAGO]: {
        id: PaymentMethod.MERCADO_PAGO,
        label: 'Mercado Pago',
        shortLabel: 'Mercado Pago',
        discount: 0,
        description: 'Tarjetas de crédito, débito y efectivo',
    },
    [PaymentMethod.MODO]: {
        id: PaymentMethod.MODO,
        label: 'Modo',
        shortLabel: 'Modo',
        discount: 0,
        description: 'Transferencia inmediata con CVU',
    },
    [PaymentMethod.BANK_TRANSFER]: {
        id: PaymentMethod.BANK_TRANSFER,
        label: 'Transferencia Bancaria',
        shortLabel: 'Transferencia',
        discount: 10,
        description: '10% de descuento adicional',
    },
} as const;


export const CANCELLABLE_ORDER_STATUSES = [
    OrderStatus.PENDING,
    OrderStatus.PAYMENT_PENDING,
];

export const FINAL_ORDER_STATUSES = [
    OrderStatus.DELIVERED,
    OrderStatus.CANCELLED,
    OrderStatus.REFUNDED,
];