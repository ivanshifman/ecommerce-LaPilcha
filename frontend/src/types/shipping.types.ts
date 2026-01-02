export enum ShippingStatus {
  PENDING = 'pending',
  PREPARING = 'preparing',
  READY_FOR_PICKUP = 'ready_for_pickup',
  IN_TRANSIT = 'in_transit',
  OUT_FOR_DELIVERY = 'out_for_delivery',
  DELIVERED = 'delivered',
  FAILED = 'failed',
  RETURNED = 'returned',
}

export interface ShippingOption {
  method: string;
  methodLabel: string;
  cost: number;
  estimatedDays: string;
  isFree: boolean;
  description?: string;
}

export interface CalculateShippingDto {
  province: string;
  subtotal: number;
  weight?: number;
}

export interface TrackingHistory {
  status: ShippingStatus;
  timestamp: string;
  location?: string;
  note?: string;
  updatedBy?: string;
}

export interface Shipping {
  id: string;
  orderId: string;
  method: string;
  status: ShippingStatus;
  trackingNumber?: string;
  carrier?: string;
  cost: number;
  weight: number;
  address: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    additionalInfo?: string;
  };
  estimatedDeliveryDate?: string;
  actualDeliveryDate?: string;
  trackingHistory: TrackingHistory[];
  createdAt: string;
  updatedAt: string;
}