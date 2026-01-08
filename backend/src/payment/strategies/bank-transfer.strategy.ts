/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { PaymentStrategy } from './payment-strategy.interface';
import { PaymentDocument } from '../schemas/payment.schema';
import { PaymentStatus } from '../enums/payment-status.enum';

@Injectable()
export class BankTransferStrategy implements PaymentStrategy {
  createPayment(
    payment: PaymentDocument,
    _email: string,
  ): Promise<{
    checkoutUrl: string;
    externalId?: string;
    preferenceId?: string;
  }> {
    return Promise.resolve({
      checkoutUrl: '',
      preferenceId: payment._id.toString(),
      externalId: `TRANSFER-${payment._id.toString()}`,
    });
  }

  processWebhook(_payload: any): Promise<{
    externalId: string;
    status: string;
    metadata?: Record<string, any>;
  }> {
    throw new Error('Las transferencias bancarias no usan webhooks automáticos');
  }

  refundPayment(_externalId: string): Promise<void> {
    throw new Error('Los reembolsos por transferencia deben procesarse manualmente');
  }

  async getPaymentStatus(_externalId: string): Promise<string> {
    return Promise.resolve(PaymentStatus.PENDING);
  }
}
