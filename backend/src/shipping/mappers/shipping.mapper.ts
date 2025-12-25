import { ShippingDocument } from '../schemas/shipping.schema';
import {
  ShippingResponseDto,
  TrackingHistoryDto,
  ShippingAddressDto,
} from '../dto/shipping-response.dto';
import { SHIPPING_STATUS_LABELS, SHIPPING_METHOD_LABELS } from '../enums/shipping.enum';
import { DateFormatUtil } from '../../common/utils/date-format.util';

export class ShippingMapper {
  static toShippingResponseDto(shipping: ShippingDocument): ShippingResponseDto {
    return {
      id: shipping._id.toString(),
      orderId: shipping.order.toString(),
      method: shipping.method,
      methodLabel: SHIPPING_METHOD_LABELS[shipping.method],
      status: shipping.status,
      statusLabel: SHIPPING_STATUS_LABELS[shipping.status],
      trackingNumber: shipping.trackingNumber,
      carrier: shipping.carrier,
      cost: shipping.cost,
      weight: shipping.weight,
      address: this.toShippingAddressDto(shipping.address),
      estimatedDeliveryDate: shipping.estimatedDeliveryDate,
      estimatedDeliveryDateLocal: DateFormatUtil.toReadable(shipping.estimatedDeliveryDate),
      actualDeliveryDate: shipping.actualDeliveryDate,
      actualDeliveryDateLocal: DateFormatUtil.toReadable(shipping.actualDeliveryDate),
      dispatchedAt: shipping.dispatchedAt,
      dispatchedAtLocal: DateFormatUtil.toReadable(shipping.dispatchedAt),
      preparedAt: shipping.preparedAt,
      preparedAtLocal: DateFormatUtil.toReadable(shipping.preparedAt),
      trackingHistory: this.toTrackingHistoryDto(shipping.trackingHistory),
      notes: shipping.notes,
      adminNotes: shipping.adminNotes,
      labelUrl: shipping.labelUrl,
      requiresSignature: shipping.requiresSignature,
      deliveredTo: shipping.deliveredTo,
      failureReason: shipping.failureReason,
      createdAt: shipping.createdAt,
      updatedAt: shipping.updatedAt,
      createdAtLocal: DateFormatUtil.toReadable(shipping.createdAt),
      updatedAtLocal: DateFormatUtil.toReadable(shipping.updatedAt),
    };
  }

  static toShippingAddressDto(address: ShippingDocument['address']): ShippingAddressDto {
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

  static toTrackingHistoryDto(history: ShippingDocument['trackingHistory']): TrackingHistoryDto[] {
    return history.map((h) => ({
      status: h.status,
      statusLabel: SHIPPING_STATUS_LABELS[h.status],
      timestamp: h.timestamp,
      timestampLocal: DateFormatUtil.toReadable(h.timestamp) ?? '',
      location: h.location,
      note: h.note,
      updatedBy: h.updatedBy?.toString(),
    }));
  }
}
