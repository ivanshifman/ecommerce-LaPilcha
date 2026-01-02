export enum ReturnStatus {
  REQUESTED = 'requested',
  PENDING_APPROVAL = 'pending_approval',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  SHIPPING = 'shipping',
  RECEIVED = 'received',
  INSPECTING = 'inspecting',
  APPROVED_REFUND = 'approved_refund',
  REFUNDED = 'refunded',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export enum ReturnReason {
  DEFECTIVE = 'defective',
  WRONG_SIZE = 'wrong_size',
  WRONG_COLOR = 'wrong_color',
  NOT_AS_DESCRIBED = 'not_as_described',
  CHANGED_MIND = 'changed_mind',
  DAMAGED_IN_SHIPPING = 'damaged_in_shipping',
  DUPLICATE_ORDER = 'duplicate_order',
  OTHER = 'other',
}

export interface ReturnItem {
  product: string;
  size?: string;
  color?: string;
  quantity: number;
  reason: ReturnReason;
  condition?: string;
}

export interface CreateReturnDto {
  orderId: string;
  items: ReturnItem[];
  primaryReason: ReturnReason;
  customerComment?: string;
  customerImages?: string[];
}

export interface Return {
  id: string;
  returnNumber: string;
  orderId: string;
  status: ReturnStatus;
  items: ReturnItem[];
  primaryReason: ReturnReason;
  customerComment?: string;
  requestedAmount: number;
  approvedAmount?: number;
  refundedAmount?: number;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}