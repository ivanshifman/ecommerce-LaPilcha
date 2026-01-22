import { Product } from './product.types';

export enum OrderStatus {
  PENDING = 'pending',
  PAYMENT_PENDING = 'payment_pending',
  PAID = 'paid',
  PROCESSING = 'processing',
  SHIPPED = 'shipped',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  REFUND_PENDING = 'refund_pending',
  REFUNDED = 'refunded',
  FAILED = 'failed',
}

export enum PaymentMethod {
  MERCADO_PAGO = 'mercado_pago',
  MODO = 'modo',
  BANK_TRANSFER = 'bank_transfer',
}

export enum ShippingMethod {
  STANDARD = 'standard',
  EXPRESS = 'express',
  PICKUP = 'pickup',
}

export interface OrderItem {
  product: Product | string;
  name: string;
  image?: string;
  variant?: {
    size?: string;
    color?: string;
  };
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  additionalInfo?: string;
}

export interface StatusHistory {
  status: OrderStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  user?: string;
  isGuest: boolean;
  guestInfo?: {
    email: string;
    name: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  totalWeight: number;
  status: OrderStatus;
  paymentMethod?: PaymentMethod;
  paymentDetails?: {
    transactionId?: string;
    status?: string;
    paidAt?: string;
    metadata?: Record<string, unknown>;
  };
  shippingMethod?: ShippingMethod;
  shippingAddress: ShippingAddress;
  statusHistory: StatusHistory[];
  couponApplied?: {
    code: string;
    type: string;
    discountAmount: number;
    freeShipping: boolean;
  };
  emailSent: boolean;
  deliveredAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderDto {
  items: {
    product: string;
    variant?: {
      size?: string;
      color?: string;
    };
    quantity: number;
  }[];
  shippingAddress: ShippingAddress;
  shippingMethod: ShippingMethod;
  couponCode?: string;
  guestInfo?: {
    email: string;
    name: string;
  };
}

export interface CancelOrderDto {
  reason: string;
}

export interface OrderQueryDto {
  status?: OrderStatus;
  page?: number;
  limit?: number;
  startDate?: string;
  endDate?: string;
}

export interface PaginatedOrders {
  orders: Order[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}