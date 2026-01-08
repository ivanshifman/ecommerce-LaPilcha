import { OrderDocument } from '../schemas/order.schema';
import {
  OrderResponseDto,
  OrderItemResponseDto,
  ShippingAddressResponseDto,
  PaymentDetailsResponseDto,
  StatusHistoryResponseDto,
} from '../dto/order-response.dto';
import { ORDER_STATUS_LABELS, CANCELLABLE_STATUSES } from '../enums/order-status.enum';
import { PAYMENT_METHOD_LABELS } from '../enums/payment-method.enum';
import { SHIPPING_METHOD_LABELS } from '../../shipping/enums/shipping.enum';
import { DateFormatUtil } from '../../common/utils/date-format.util';

export class OrderMapper {
  static toOrderItemResponseDto(item: OrderDocument['items'][0]): OrderItemResponseDto {
    return {
      productId: item.product.toString(),
      name: item.name,
      code: item.code,
      variant: item.variant,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      discount: item.discount,
      subtotal: item.subtotal,
      image: item.image,
    };
  }

  static toShippingAddressResponseDto(
    address: OrderDocument['shippingAddress'],
  ): ShippingAddressResponseDto {
    return {
      fullName: address.fullName,
      phone: address.phone,
      address: address.address,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      country: address.country,
      additionalInfo: address.additionalInfo,
    };
  }

  static toPaymentDetailsResponseDto(
    payment: OrderDocument['paymentDetails'],
  ): PaymentDetailsResponseDto | undefined {
    if (!payment) return undefined;

    return {
      transactionId: payment.transactionId,
      status: payment.status,
      paidAt: payment.paidAt,
      paidAtLocal: DateFormatUtil.toReadable(payment.paidAt),
    };
  }

  static toStatusHistoryResponseDto(
    history: OrderDocument['statusHistory'],
  ): StatusHistoryResponseDto[] {
    return history.map((h) => ({
      status: h.status,
      statusLabel: ORDER_STATUS_LABELS[h.status] || h.status,
      timestamp: h.timestamp,
      timestampLocal: DateFormatUtil.toReadable(h.timestamp) ?? '',
      note: h.note,
      updatedBy: h.updatedBy?.toString(),
    }));
  }

  static toOrderResponseDto(order: OrderDocument, isAdmin = false): OrderResponseDto {
    const canBeCancelled = CANCELLABLE_STATUSES.includes(order.status);

    return {
      id: order._id.toString(),
      orderNumber: order.orderNumber,
      userId: order.user?.toString() || '',
      guestInfo: order.guestInfo,
      items: order.items.map((item) => OrderMapper.toOrderItemResponseDto(item)),
      couponApplied: order.couponApplied
        ? {
            code: order.couponApplied.code,
            type: order.couponApplied.couponType,
            discountAmount: order.couponApplied.discountAmount,
            freeShipping: order.couponApplied.freeShipping,
          }
        : undefined,
      subtotal: order.subtotal,
      discount: order.discount,
      shippingCost: order.shippingCost,
      totalWeight: order.totalWeight,
      bankTransferDiscount: order.bankTransferDiscount,
      total: order.total,
      status: order.status,
      statusLabel: ORDER_STATUS_LABELS[order.status] || order.status,
      paymentMethod: order.paymentMethod,
      paymentMethodLabel: order.paymentMethod
        ? PAYMENT_METHOD_LABELS[order.paymentMethod]
        : undefined,
      shippingMethod: order.shippingMethod,
      shippingMethodLabel: order.shippingMethod
        ? SHIPPING_METHOD_LABELS[order.shippingMethod]
        : undefined,
      paymentDetails: OrderMapper.toPaymentDetailsResponseDto(order.paymentDetails),
      shippingAddress: OrderMapper.toShippingAddressResponseDto(order.shippingAddress),
      statusHistory: OrderMapper.toStatusHistoryResponseDto(order.statusHistory),
      notes: order.notes,
      adminNotes: isAdmin ? order.adminNotes : undefined,
      trackingNumber: order.trackingNumber,
      estimatedDelivery: order.estimatedDelivery,
      estimatedDeliveryLocal: DateFormatUtil.toReadable(order.estimatedDelivery),
      deliveredAt: order.deliveredAt,
      deliveredAtLocal: DateFormatUtil.toReadable(order.deliveredAt),
      cancelledAt: order.cancelledAt,
      cancelledAtLocal: DateFormatUtil.toReadable(order.cancelledAt),
      cancellationReason: order.cancellationReason,
      canBeCancelled,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      createdAtLocal: DateFormatUtil.toReadable(order.createdAt),
      updatedAtLocal: DateFormatUtil.toReadable(order.updatedAt),
    };
  }
}
