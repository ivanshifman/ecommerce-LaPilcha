import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import MercadoPagoConfig, { Preference, Payment as MPPayment, PaymentRefund } from 'mercadopago';
import { PaymentStrategy } from './payment-strategy.interface';
import { PaymentDocument } from '../schemas/payment.schema';
import { PaymentStatus } from '../enums/payment-status.enum';
import { MercadoPagoPreferenceBody } from '../types/mercadopago.type';

interface MercadoPagoWebhookPayload {
  data?: {
    id?: string;
  };
}

@Injectable()
export class MercadoPagoStrategy implements PaymentStrategy {
  private readonly logger = new Logger(MercadoPagoStrategy.name);
  private client: MercadoPagoConfig;

  constructor(private readonly configService: ConfigService) {
    const accessToken = this.configService.get<string>('MERCADO_PAGO_ACCESS_TOKEN');
    if (!accessToken) {
      throw new Error('MERCADO_PAGO_ACCESS_TOKEN no configurado');
    }

    this.client = new MercadoPagoConfig({
      accessToken,
      options: { timeout: 5000 },
    });
  }

  async createPayment(
    payment: PaymentDocument,
    userEmail: string,
  ): Promise<{
    checkoutUrl: string;
    externalId?: string;
    preferenceId?: string;
  }> {
    const backUrl = this.configService.get<string>('BACKEND_URL');
    const notificationUrl = `${this.configService.get<string>('BACKEND_URL')}/payments/webhook/mercadopago`;
    const isProd = this.configService.get('NODE_ENV') === 'production';
    const preference = new Preference(this.client);

    const body: MercadoPagoPreferenceBody = {
      items: [
        {
          id: payment._id.toString(),
          title: `Orden ${payment.order.toString()}`,
          quantity: 1,
          unit_price: payment.amount,
          currency_id: 'ARS',
        },
      ],
      payer: { email: userEmail },
      back_urls: {
        success: `${backUrl}/payments/payment/success`,
        failure: `${backUrl}/payments/payment/failure`,
        pending: `${backUrl}/payments/payment/pending`,
      },
      notification_url: notificationUrl,
      external_reference: payment._id.toString(),
      statement_descriptor: 'EL PAISANO',
    };

    if (isProd) {
      body.auto_return = 'approved';
    }

    const response = await preference.create({ body });

    return {
      checkoutUrl: response.init_point!,
      preferenceId: response.id,
    };
  }

  async processWebhook(payload: MercadoPagoWebhookPayload): Promise<{
    externalId: string;
    status: string;
    metadata?: Record<string, any>;
  }> {
    const paymentId = payload.data?.id;

    if (!paymentId) {
      throw new Error('Payment ID no encontrado en webhook');
    }

    try {
      const payment = new MPPayment(this.client);
      const paymentInfo = await payment.get({ id: paymentId });
      const status = this.mapMercadoPagoStatus(paymentInfo.status!);

      return {
        externalId: paymentInfo.id!.toString(),
        status,
        metadata: {
          statusDetail: paymentInfo.status_detail,
          paymentMethodId: paymentInfo.payment_method_id,
          paymentTypeId: paymentInfo.payment_type_id,
          transactionAmount: paymentInfo.transaction_amount,
          dateApproved: paymentInfo.date_approved,
          external_reference: paymentInfo.external_reference,
        },
      };
    } catch (error) {
      if (this.configService.get('NODE_ENV') !== 'production') {
        this.logger.error(`❌ Error consultando pago ${paymentId} en MP:`, error);
      }

      const errorMessage =
        error instanceof Error
          ? error.message
          : typeof error === 'object' && error !== null && 'error' in error
            ? String((error as Record<string, unknown>).error)
            : '';
      if (errorMessage.includes('resource not found') || errorMessage.includes('not_found')) {
        if (this.configService.get('NODE_ENV') !== 'production') {
          this.logger.warn(`⚠️ Pago ${paymentId} no encontrado en MP`);
        }

        return {
          externalId: paymentId,
          status: PaymentStatus.PENDING,
          metadata: { error: 'Payment not yet created in MP' },
        };
      }

      throw error;
    }
  }

  async refundPayment(externalId: string): Promise<void> {
    this.logger.log(`💰 Iniciando reembolso de MP: ${externalId}`);

    try {
      const refundClient = new PaymentRefund(this.client);
      await refundClient.create({
        body: {},
        payment_id: externalId,
      });

      this.logger.log(`✅ Reembolso de MP procesado: ${externalId}`);
    } catch (error) {
      this.logger.error(`❌ Error en reembolso de MP:`, error);
      throw new Error('No se pudo procesar el reembolso en Mercado Pago');
    }
  }

  async getPaymentStatus(externalId: string): Promise<string> {
    const payment = new MPPayment(this.client);
    const paymentInfo = await payment.get({ id: externalId });
    return this.mapMercadoPagoStatus(paymentInfo.status!);
  }

  private mapMercadoPagoStatus(mpStatus: string): string {
    const statusMap: Record<string, PaymentStatus> = {
      pending: PaymentStatus.PENDING,
      approved: PaymentStatus.APPROVED,
      authorized: PaymentStatus.AUTHORIZED,
      in_process: PaymentStatus.IN_PROCESS,
      in_mediation: PaymentStatus.IN_MEDIATION,
      rejected: PaymentStatus.REJECTED,
      cancelled: PaymentStatus.CANCELLED,
      refunded: PaymentStatus.REFUNDED,
      charged_back: PaymentStatus.CHARGED_BACK,
    };

    return statusMap[mpStatus] || PaymentStatus.PENDING;
  }
}
