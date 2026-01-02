export enum CouponType {
  PERCENTAGE = 'percentage',
  FIXED_AMOUNT = 'fixed_amount',
  FREE_SHIPPING = 'free_shipping',
}

export enum CouponStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  EXPIRED = 'expired',
}

export interface Coupon {
  id: string;
  code: string;
  description: string;
  type: CouponType;
  discountValue?: number;
  minPurchaseAmount?: number;
  maxDiscountAmount?: number;
  startDate: string;
  endDate: string;
  usageLimit?: number;
  usageCount: number;
  status: CouponStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ValidateCouponDto {
  code: string;
  orderTotal: number;
  userId?: string;
  guestEmail?: string;
  cartCategories?: string[];
  cartProducts?: string[];
}

export interface CouponValidationResponse {
  valid: boolean;
  coupon?: Coupon;
  discountAmount?: number;
  freeShipping?: boolean;
  message?: string;
}