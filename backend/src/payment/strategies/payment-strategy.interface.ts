import { PaymentDocument } from '../schemas/payment.schema';

export interface PaymentStrategy {
  createPayment(
    payment: PaymentDocument,
    userEmail: string,
  ): Promise<{
    checkoutUrl: string;
    externalId?: string;
    preferenceId?: string;
  }>;

  processWebhook(payload: any): Promise<{
    externalId: string;
    status: string;
    metadata?: Record<string, any>;
  }>;

  refundPayment(externalId: string): Promise<void>;

  getPaymentStatus(externalId: string): Promise<string>;
}
