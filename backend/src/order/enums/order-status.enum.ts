export enum OrderStatus {
  PENDING = 'pending',
  PAYMENT_PENDING = 'payment_pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.PENDING]: 'Pendiente',
  [OrderStatus.PAYMENT_PENDING]: 'Pago Pendiente',
  [OrderStatus.PAID]: 'Pagado',
  [OrderStatus.PROCESSING]: 'Procesando',
  [OrderStatus.SHIPPED]: 'Enviado',
  [OrderStatus.DELIVERED]: 'Entregado',
  [OrderStatus.CANCELLED]: 'Cancelado',
  [OrderStatus.REFUNDED]: 'Reembolsado',
  [OrderStatus.FAILED]: 'Fallido',
};

export const CANCELLABLE_STATUSES = [OrderStatus.PENDING, OrderStatus.PAYMENT_PENDING];

export const FINAL_STATUSES = [OrderStatus.DELIVERED, OrderStatus.CANCELLED, OrderStatus.REFUNDED];
