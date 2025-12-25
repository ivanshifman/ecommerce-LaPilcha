import { ShippingMethod, ShippingStatus } from '../enums/shipping.enum';

export class TrackingHistoryDto {
  status!: ShippingStatus;
  statusLabel!: string;
  timestamp!: Date;
  timestampLocal!: string;
  location?: string;
  note?: string;
  updatedBy?: string;
}

export class ShippingAddressDto {
  fullName!: string;
  phone!: string;
  address!: string;
  city!: string;
  state!: string;
  zipCode!: string;
  country!: string;
  additionalInfo?: string;
}

export class ShippingResponseDto {
  id!: string;
  orderId!: string;
  method!: ShippingMethod;
  methodLabel!: string;
  status!: ShippingStatus;
  statusLabel!: string;
  trackingNumber?: string;
  carrier?: string;
  cost!: number;
  weight?: number;
  address!: ShippingAddressDto;
  estimatedDeliveryDate?: Date;
  estimatedDeliveryDateLocal?: string;
  actualDeliveryDate?: Date;
  actualDeliveryDateLocal?: string;
  dispatchedAt?: Date;
  dispatchedAtLocal?: string;
  preparedAt?: Date;
  preparedAtLocal?: string;
  trackingHistory!: TrackingHistoryDto[];
  notes?: string;
  adminNotes?: string;
  labelUrl?: string;
  requiresSignature?: boolean;
  deliveredTo?: string;
  failureReason?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdAtLocal?: string;
  updatedAtLocal?: string;
}

export class ShippingOptionDto {
  method!: ShippingMethod;
  methodLabel!: string;
  cost!: number;
  estimatedDays!: string;
  isFree!: boolean;
  description?: string;
}
