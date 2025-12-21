import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ConflictException,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as crypto from 'crypto';
import { Payment, PaymentDocument } from './schemas/payment.schema';
import { MercadoPagoStrategy } from './strategies/mercadopago.strategy';
import { ModoStrategy } from './strategies/modo.strategy';
import { PaymentStrategy } from './strategies/payment-strategy.interface';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaymentMethod } from '../order/enums/payment-method.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { OrderStatus } from '../order/enums/order-status.enum';
import { MailService } from '../common/mail/mail.service';
import { UserService } from '../user/user.service';
import { OrderService } from 'src/order/order.service';
import {
  MercadoPagoWebhookHeaders,
  //   MercadoPagoWebhookPayload,
} from './types/mercadopago-webhook.type';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private strategies: Map<PaymentMethod, PaymentStrategy>;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private readonly configService: ConfigService,
    private readonly mercadoPagoStrategy: MercadoPagoStrategy,
    private readonly modoStrategy: ModoStrategy,
    private readonly mailService: MailService,
    private readonly orderService: OrderService,
    private readonly userService: UserService,
  ) {
    this.strategies = new Map<PaymentMethod, PaymentStrategy>();
    this.strategies.set(PaymentMethod.MERCADO_PAGO, this.mercadoPagoStrategy);
    this.strategies.set(PaymentMethod.MODO, this.modoStrategy);
  }

  async createPayment(userId: string, dto: CreatePaymentDto): Promise<PaymentResponseDto> {
    if (this.configService.get('NODE_ENV') !== 'production') {
      this.logger.log(`💳 Creando pago para orden ${dto.orderId}`);
    }

    const order = await this.orderService.findById(dto.orderId);

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (order.user.toString() !== userId) {
      throw new BadRequestException('No tienes permiso para pagar esta orden');
    }

    if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PAYMENT_PENDING) {
      throw new BadRequestException(
        `No se puede crear un pago para una orden en estado: ${order.status}`,
      );
    }

    const existingPayment = await this.paymentModel
      .findOne({
        order: dto.orderId,
        status: { $in: [PaymentStatus.PENDING, PaymentStatus.APPROVED, PaymentStatus.IN_PROCESS] },
      })
      .exec();

    if (existingPayment) {
      throw new ConflictException('Ya existe un pago activo para esta orden');
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const payment = new this.paymentModel({
      order: new Types.ObjectId(dto.orderId),
      user: new Types.ObjectId(userId),
      amount: order.total,
      method: dto.method,
      status: PaymentStatus.PENDING,
    });

    await payment.save();

    const strategy = this.strategies.get(dto.method);
    if (!strategy) {
      throw new BadRequestException('Método de pago no soportado');
    }

    try {
      const paymentData = await strategy.createPayment(payment, user.email);

      payment.checkoutUrl = paymentData.checkoutUrl;
      payment.preferenceId = paymentData.preferenceId;
      payment.externalId = paymentData.externalId;
      await payment.save();

      order.status = OrderStatus.PAYMENT_PENDING;
      order.paymentMethod = dto.method;
      await order.save();

      if (this.configService.get('NODE_ENV') !== 'production') {
        this.logger.log(`✅ Pago creado: ${payment._id.toString()}`);
      }

      return this.toPaymentResponseDto(payment);
    } catch (error) {
      payment.status = PaymentStatus.REJECTED;
      payment.errorMessage = error instanceof Error ? error.message : 'Error al crear el pago';
      await payment.save();
      throw new BadRequestException('No se pudo crear el pago. Intenta nuevamente.');
    }
  }

  async processWebhook(
    method: PaymentMethod,
    payload: any,
    headers?: MercadoPagoWebhookHeaders,
  ): Promise<void> {
    if (this.configService.get('NODE_ENV') !== 'production') {
      this.logger.log(`📥 Webhook recibido de ${method}`);
    }

    if (
      method === PaymentMethod.MERCADO_PAGO &&
      this.configService.get('NODE_ENV') === 'production'
    ) {
      this.verifyMercadoPagoSignature(payload, headers?.signature, headers?.requestId);
    }

    const strategy = this.strategies.get(method);
    if (!strategy) {
      throw new BadRequestException('Método de pago no soportado');
    }

    try {
      const webhookData = await strategy.processWebhook(payload);

      let payment: PaymentDocument | null = await this.paymentModel
        .findOne({
          $or: [{ externalId: webhookData.externalId }, { preferenceId: webhookData.externalId }],
        })
        .exec();

      if (!payment && webhookData.metadata?.external_reference) {
        payment = await this.paymentModel.findById(webhookData.metadata.external_reference).exec();
      }

      if (!payment) {
        payment = await this.paymentModel
          .findOne({
            status: PaymentStatus.PENDING,
            externalId: { $exists: false },
            method: method,
          })
          .sort({ createdAt: -1 })
          .exec();
      }

      if (!payment) {
        if (this.configService.get('NODE_ENV') !== 'production') {
          this.logger.error(`❌ Pago no encontrado para externalId: ${webhookData.externalId}`);
        }
        return;
      }

      if (!payment.externalId) {
        payment.externalId = webhookData.externalId;
      }

      const oldStatus = payment.status;
      const newStatus = webhookData.status as PaymentStatus;

      if (oldStatus === newStatus) {
        return;
      }

      payment.status = newStatus;
      payment.metadata = webhookData.metadata;

      if (newStatus === PaymentStatus.APPROVED) {
        payment.paidAt = new Date();
      } else if (newStatus === PaymentStatus.REFUNDED) {
        payment.refundedAt = new Date();
      }

      await payment.save();
      await this.updateOrderByPaymentStatus(payment);
    } catch (error) {
      if (this.configService.get('NODE_ENV') !== 'production') {
        this.logger.error(`❌ Error procesando webhook:`, error);
      }
    }
  }

  private async updateOrderByPaymentStatus(payment: PaymentDocument): Promise<void> {
    const order = await this.orderService.findById(payment.order.toString());

    if (!order) {
      if (this.configService.get('NODE_ENV') !== 'production') {
        this.logger.error(`❌ Orden no encontrada: ${payment.order.toString()}`);
      }
      return;
    }

    const user = await this.userService.findById(order.user.toString());

    switch (payment.status) {
      case PaymentStatus.APPROVED:
        if (order.status === OrderStatus.PAID) {
          return;
        }

        order.status = OrderStatus.PAID;
        order.paymentDetails = {
          transactionId: payment.externalId,
          status: payment.status,
          paidAt: payment.paidAt,
          metadata: payment.metadata,
        };
        await order.save();

        if (user && payment.status === PaymentStatus.APPROVED) {
          const shouldSendEmail = await this.orderService.markEmailSentIfNotSent(
            order._id.toString(),
          );

          if (shouldSendEmail) {
            try {
              await this.mailService.sendOrderConfirmation(user.email, {
                orderNumber: order.orderNumber,
                createdAt: order.createdAt ?? new Date(),
                items: order.items,
                subtotal: order.subtotal,
                discount: order.discount,
                shippingCost: order.shippingCost,
                total: order.total,
                paymentMethod: order.paymentMethod,
                shippingAddress: {
                  fullName: order.shippingAddress.fullName,
                  address: order.shippingAddress.address,
                  city: order.shippingAddress.city,
                  province: order.shippingAddress.state,
                  postalCode: order.shippingAddress.zipCode,
                  country: order.shippingAddress.country,
                },
              });
            } catch (emailError) {
              this.logger.error(
                `❌ Error enviando email para orden ${order.orderNumber}`,
                emailError,
              );
            }
          }
        }
        break;

      case PaymentStatus.REJECTED:
      case PaymentStatus.CANCELLED:
        if (order.status === OrderStatus.PAYMENT_PENDING) {
          order.status = OrderStatus.FAILED;
          await order.save();
        }
        break;

      case PaymentStatus.REFUNDED:
        order.status = OrderStatus.REFUNDED;
        await order.save();
        break;

      case PaymentStatus.IN_PROCESS:
      case PaymentStatus.PENDING:
        if (order.status !== OrderStatus.PAYMENT_PENDING) {
          order.status = OrderStatus.PAYMENT_PENDING;
          await order.save();
        }
        break;
    }
  }

  async getPaymentByOrderId(orderId: string, userId: string): Promise<PaymentResponseDto> {
    const order = await this.orderService.findById(orderId);

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (order.user.toString() !== userId) {
      throw new BadRequestException('No tienes permiso para ver este pago');
    }

    const payment = await this.paymentModel
      .findOne({ order: orderId })
      .sort({ createdAt: -1 })
      .exec();

    if (!payment) {
      throw new NotFoundException('No se encontró un pago para esta orden');
    }

    return this.toPaymentResponseDto(payment);
  }

  async getMyPayments(userId: string): Promise<PaymentResponseDto[]> {
    const payments = await this.paymentModel.find({ user: userId }).sort({ createdAt: -1 }).exec();

    return payments.map((payment) => this.toPaymentResponseDto(payment));
  }

  async getAllPayments(): Promise<PaymentResponseDto[]> {
    const payments = await this.paymentModel.find().sort({ createdAt: -1 }).exec();
    return payments.map((payment) => this.toPaymentResponseDto(payment));
  }

  async refundPayment(paymentId: string, adminId: string): Promise<PaymentResponseDto> {
    this.logger.log(`💰 Admin ${adminId} solicitando reembolso para pago: ${paymentId}`);

    const payment = await this.paymentModel.findById(paymentId).exec();

    if (!payment) {
      throw new NotFoundException('Pago no encontrado');
    }

    if (payment.status !== PaymentStatus.APPROVED) {
      throw new BadRequestException('Solo se pueden reembolsar pagos aprobados');
    }

    if (!payment.externalId) {
      throw new BadRequestException('No se puede reembolsar: falta ID externo');
    }

    const strategy = this.strategies.get(payment.method);
    if (!strategy) {
      throw new BadRequestException('Método de pago no soportado');
    }

    try {
      await strategy.refundPayment(payment.externalId);

      payment.status = PaymentStatus.REFUNDED;
      payment.refundedAt = new Date();
      await payment.save();

      const order = await this.orderService.findById(payment.order.toString());
      if (order) {
        order.status = OrderStatus.REFUNDED;
        await order.save();
      }

      this.logger.log(`✅ Reembolso procesado exitosamente: ${payment._id.toString()}`);

      return this.toPaymentResponseDto(payment);
    } catch (error) {
      this.logger.error(`❌ Error procesando reembolso:`, error);
      throw new BadRequestException('No se pudo procesar el reembolso');
    }
  }

  private verifyMercadoPagoSignature(payload: any, signature?: string, requestId?: string) {
    if (!signature || !requestId) {
      throw new ForbiddenException('Headers de firma faltantes');
    }

    const secret = this.configService.get<string>('MERCADO_PAGO_WEBHOOK_SECRET');
    if (!secret) {
      throw new Error('Webhook secret no configurado');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const manifest = `id:${payload.data?.id};request-id:${requestId};`;

    const expectedSignature = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

    if (expectedSignature !== signature) {
      throw new ForbiddenException('Firma de webhook inválida');
    }
  }

  private toPaymentResponseDto(payment: PaymentDocument): PaymentResponseDto {
    return {
      id: payment._id.toString(),
      orderId: payment.order.toString(),
      amount: payment.amount,
      method: payment.method,
      status: payment.status,
      checkoutUrl: payment.checkoutUrl,
      externalId: payment.externalId,
      createdAt: payment.createdAt,
      paidAt: payment.paidAt,
    };
  }
}
