import { OrderStatus } from '../enums/order-status.enum';
import { PaymentMethod } from '../enums/payment-method.enum';

export class OrderItemResponseDto {
  productId!: string;
  name!: string;
  code!: string;
  variant?: {
    size?: string;
    color?: string;
  };
  quantity!: number;
  unitPrice!: number;
  discount!: number;
  subtotal!: number;
  image?: string;
}

export class ShippingAddressResponseDto {
  fullName!: string;
  phone!: string;
  address!: string;
  city!: string;
  state!: string;
  zipCode!: string;
  country!: string;
  additionalInfo?: string;
}

export class PaymentDetailsResponseDto {
  transactionId?: string;
  status?: string;
  paidAt?: Date;
  paidAtLocal?: string;
}

export class StatusHistoryResponseDto {
  status!: OrderStatus;
  statusLabel!: string;
  timestamp!: Date;
  timestampLocal!: string;
  note?: string;
  updatedBy?: string;
}

export class GuestInfoDto {
  fullName!: string;
  email!: string;
  phone!: string;
}

export class OrderResponseDto {
  id!: string;
  orderNumber!: string;
  userId?: string;
  guestInfo?: GuestInfoDto;
  items!: OrderItemResponseDto[];
  subtotal!: number;
  discount!: number;
  shippingCost!: number;
  total!: number;
  status!: OrderStatus;
  statusLabel!: string;
  paymentMethod?: PaymentMethod;
  paymentMethodLabel?: string;
  paymentDetails?: PaymentDetailsResponseDto;
  shippingAddress!: ShippingAddressResponseDto;
  statusHistory!: StatusHistoryResponseDto[];
  notes?: string;
  adminNotes?: string;
  trackingNumber?: string;
  estimatedDelivery?: Date;
  estimatedDeliveryLocal?: string;
  deliveredAt?: Date;
  deliveredAtLocal?: string;
  cancelledAt?: Date;
  cancelledAtLocal?: string;
  cancellationReason?: string;
  canBeCancelled!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdAtLocal?: string;
  updatedAtLocal?: string;
}

export class PaginatedOrderResponseDto {
  orders!: OrderResponseDto[];
  total!: number;
  page!: number;
  limit!: number;
  totalPages!: number;
}
