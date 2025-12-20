import { PaymentMethod } from '../../order/enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export class PaymentResponseDto {
  id!: string;
  orderId!: string;
  amount!: number;
  method!: PaymentMethod;
  status!: PaymentStatus;
  checkoutUrl?: string;
  externalId?: string;
  createdAt?: Date;
  paidAt?: Date;
}
