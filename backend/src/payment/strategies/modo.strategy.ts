import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios, { AxiosInstance } from 'axios';
import { PaymentStrategy } from './payment-strategy.interface';
import { PaymentDocument } from '../schemas/payment.schema';
import { PaymentStatus } from '../enums/payment-status.enum';

interface ModoCheckoutResponse {
  id: string;
  checkout_url: string;
  status: string;
}

interface ModoPaymentResponse {
  id: string;
  status: string;
  amount: number;
  currency: string;
}

interface ModoWebhookPayload {
  data?: {
    id?: string;
  };
}

@Injectable()
export class ModoStrategy implements PaymentStrategy {
  private readonly logger = new Logger(ModoStrategy.name);
  private client: AxiosInstance;

  constructor(private configService: ConfigService) {
    const apiKey = this.configService.get<string>('MODO_API_KEY');
    if (!apiKey) {
      throw new Error('MODO_API_KEY no configurado');
    }

    this.client = axios.create({
      baseURL: 'https://api.modo.com.ar/v1',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 5000,
    });
  }

  async createPayment(payment: PaymentDocument): Promise<{
    checkoutUrl: string;
    externalId?: string;
    preferenceId?: string;
  }> {
    const backUrl = this.configService.get<string>('FRONTEND_URL');
    const notificationUrl = `${this.configService.get<string>('BACKEND_URL')}/payments/webhook/modo`;

    const response = await this.client.post<ModoCheckoutResponse>('/checkout', {
      amount: payment.amount,
      currency: 'ARS',
      external_reference: payment._id.toString(),
      description: `Orden ${payment.order.toString()}`,
      notification_url: notificationUrl,
      return_url: `${backUrl}/payment/success`,
      cancel_url: `${backUrl}/payment/failure`,
    });

    this.logger.log(`✅ Checkout de Modo creado: ${response.data.id}`);

    return {
      checkoutUrl: response.data.checkout_url,
      externalId: response.data.id,
    };
  }

  async processWebhook(payload: ModoWebhookPayload): Promise<{
    externalId: string;
    status: string;
    metadata?: Record<string, any>;
  }> {
    const paymentId = payload.data?.id;

    if (!paymentId) {
      throw new Error('Payment ID no encontrado en webhook de Modo');
    }

    const response = await this.client.get<ModoPaymentResponse>(`/payments/${paymentId}`);
    const status = this.mapModoStatus(response.data.status);

    return {
      externalId: paymentId,
      status,
      metadata: response.data,
    };
  }

  async refundPayment(externalId: string): Promise<void> {
    this.logger.log(`💰 Iniciando reembolso de Modo: ${externalId}`);

    try {
      await this.client.post(`/payments/${externalId}/refund`);
      this.logger.log(`✅ Reembolso de Modo procesado: ${externalId}`);
    } catch (error) {
      this.logger.error(`❌ Error en reembolso de Modo:`, error);
      throw new Error('No se pudo procesar el reembolso en Modo');
    }
  }

  async getPaymentStatus(externalId: string): Promise<string> {
    const response = await this.client.get<ModoPaymentResponse>(`/payments/${externalId}`);
    return this.mapModoStatus(response.data.status);
  }

  private mapModoStatus(modoStatus: string): string {
    const statusMap: Record<string, PaymentStatus> = {
      pending: PaymentStatus.PENDING,
      approved: PaymentStatus.APPROVED,
      processing: PaymentStatus.IN_PROCESS,
      rejected: PaymentStatus.REJECTED,
      cancelled: PaymentStatus.CANCELLED,
      refunded: PaymentStatus.REFUNDED,
    };

    return statusMap[modoStatus] || PaymentStatus.PENDING;
  }
}
