export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping',
}

export const COUPON_TYPE_LABELS: Record<CouponType, string> = {
  [CouponType.PERCENTAGE]: 'Porcentaje de Descuento',
  [CouponType.FIXED_AMOUNT]: 'Monto Fijo',
  [CouponType.FREE_SHIPPING]: 'Envío Gratis',
};

export enum CouponStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}
