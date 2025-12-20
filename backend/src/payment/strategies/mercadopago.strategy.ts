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

  constructor(private configService: ConfigService) {
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
    const backUrl = this.configService.get<string>('FRONTEND_URL');
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
        success: `${backUrl}/payment/success`,
        failure: `${backUrl}/payment/failure`,
        pending: `${backUrl}/payment/pending`,
      },
      notification_url: notificationUrl,
      external_reference: payment._id.toString(),
      statement_descriptor: 'LA PILCHA',
    };

    if (isProd) {
      body.auto_return = 'approved';
    }

    const response = await preference.create({ body });

    this.logger.log(`✅ Preferencia de MP creada: ${response.id ?? 'unknown'}`);

    return {
      checkoutUrl: response.init_point!,
      preferenceId: response.id,
      externalId: response.id,
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
      },
    };
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
