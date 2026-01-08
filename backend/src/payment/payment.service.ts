/* eslint-disable @typescript-eslint/no-unsafe-assignment */
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
import { BankTransferStrategy } from './strategies/bank-transfer.strategy';
import { PaymentStrategy } from './strategies/payment-strategy.interface';
import { StockService } from '../cart/stock.service';
import { ShippingService } from '../shipping/shipping.service';
import { UserService } from '../user/user.service';
import { OrderService } from '../order/order.service';
import { MailService } from '../common/mail/mail.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { PaymentResponseDto } from './dto/payment-response.dto';
import { PaymentMethod } from '../order/enums/payment-method.enum';
import { PaymentStatus } from './enums/payment-status.enum';
import { OrderStatus } from '../order/enums/order-status.enum';
import { ShippingMethod } from '../shipping/enums/shipping.enum';
import { MercadoPagoWebhookHeaders } from './types/mercadopago-webhook.type';

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);
  private strategies: Map<PaymentMethod, PaymentStrategy>;

  constructor(
    @InjectModel(Payment.name) private paymentModel: Model<PaymentDocument>,
    private readonly configService: ConfigService,
    private readonly mercadoPagoStrategy: MercadoPagoStrategy,
    private readonly modoStrategy: ModoStrategy,
    private readonly bankTransferStrategy: BankTransferStrategy,
    private readonly mailService: MailService,
    private readonly orderService: OrderService,
    private readonly shippingService: ShippingService,
    private readonly stockService: StockService,
    private readonly userService: UserService,
  ) {
    this.strategies = new Map<PaymentMethod, PaymentStrategy>();
    this.strategies.set(PaymentMethod.MERCADO_PAGO, this.mercadoPagoStrategy);
    this.strategies.set(PaymentMethod.MODO, this.modoStrategy);
    this.strategies.set(PaymentMethod.BANK_TRANSFER, this.bankTransferStrategy);
  }

  async createPayment(
    dto: CreatePaymentDto,
    userId?: string,
    anonymousCartId?: string,
  ): Promise<PaymentResponseDto> {
    const session = await this.paymentModel.db.startSession();
    session.startTransaction();

    try {
      if (this.configService.get('NODE_ENV') !== 'production') {
        this.logger.log(`💳 Creando pago para orden ${dto.orderId}`);
      }

      const order = await this.orderService.findById(dto.orderId);
      if (!order) throw new NotFoundException('Orden no encontrada');

      if (userId && order.user && order.user.toString() !== userId) {
        throw new BadRequestException('No tienes permiso para pagar esta orden');
      }
      if (!userId && !order.isGuest) {
        throw new BadRequestException('Esta orden pertenece a un usuario registrado');
      }
      if (order.status !== OrderStatus.PENDING && order.status !== OrderStatus.PAYMENT_PENDING) {
        throw new BadRequestException(
          `No se puede crear un pago para una orden en estado: ${order.status}`,
        );
      }

      const existingPayment = await this.paymentModel
        .findOne({
          order: dto.orderId,
          status: {
            $in: [PaymentStatus.PENDING, PaymentStatus.APPROVED, PaymentStatus.IN_PROCESS],
          },
        })
        .session(session);

      if (existingPayment) {
        throw new ConflictException('Ya existe un pago activo para esta orden');
      }

      let email: string;
      if (order.guestInfo?.email) {
        email = order.guestInfo.email;
      } else if (order.user) {
        const user = await this.userService.findById(order.user.toString());
        if (!user) throw new NotFoundException('Usuario no encontrado');
        email = user.email;
      } else {
        throw new BadRequestException('No se pudo determinar el email para el pago');
      }

      const orderObjectId = Types.ObjectId.isValid(dto.orderId)
        ? new Types.ObjectId(dto.orderId)
        : null;
      if (!orderObjectId) throw new BadRequestException('orderId inválido');

      const userObjectId =
        userId && Types.ObjectId.isValid(userId) ? new Types.ObjectId(userId) : undefined;
      const anonymousObjectId =
        anonymousCartId && Types.ObjectId.isValid(anonymousCartId)
          ? new Types.ObjectId(anonymousCartId)
          : undefined;

      const payment = new this.paymentModel({
        order: orderObjectId,
        user: userObjectId,
        anonymousId: anonymousObjectId,
        amount: order.total,
        method: dto.method,
        status: PaymentStatus.PENDING,
      });

      await payment.save({ session });

      const strategy = this.strategies.get(dto.method);
      if (!strategy) throw new BadRequestException('Método de pago no soportado');

      const paymentData = await strategy.createPayment(payment, email);

      payment.checkoutUrl = paymentData.checkoutUrl;
      payment.preferenceId = paymentData.preferenceId;
      payment.externalId = paymentData.externalId;
      await payment.save({ session });

      order.status = OrderStatus.PAYMENT_PENDING;
      order.paymentMethod = dto.method;
      await order.save({ session });

      await session.commitTransaction();
      await session.endSession();

      if (dto.method === PaymentMethod.BANK_TRANSFER) {
        try {
          const originalAmount = order.bankTransferDiscount
            ? order.total + order.bankTransferDiscount
            : order.total;

          await this.mailService.sendBankTransferInstructions(email, {
            orderNumber: order.orderNumber,
            amount: order.total,
            paymentId: payment._id.toString(),
            originalAmount: order.bankTransferDiscount ? originalAmount : undefined,
            discount: order.bankTransferDiscount,
          });
        } catch (emailError) {
          this.logger.error('Error enviando instrucciones de transferencia:', emailError);
        }
      }

      if (this.configService.get('NODE_ENV') !== 'production') {
        this.logger.log(`✅ Pago creado: ${payment._id.toString()}`);
      }

      return this.toPaymentResponseDto(payment);
    } catch (error) {
      await session.abortTransaction();
      await session.endSession();

      if (error instanceof ConflictException) throw error;

      throw new BadRequestException(
        error instanceof Error ? error.message : 'No se pudo crear el pago. Intenta nuevamente.',
      );
    }
  }

  async confirmBankTransfer(
    paymentId: string,
    adminId: string,
    transactionReference?: string,
    note?: string,
  ): Promise<PaymentResponseDto> {
    const payment = await this.paymentModel.findById(paymentId).exec();

    if (!payment) {
      throw new NotFoundException('Pago no encontrado');
    }

    if (payment.method !== PaymentMethod.BANK_TRANSFER) {
      throw new BadRequestException('Este método solo es válido para transferencias bancarias');
    }

    if (payment.status === PaymentStatus.APPROVED) {
      throw new BadRequestException('Este pago ya fue confirmado');
    }

    payment.status = PaymentStatus.APPROVED;
    payment.paidAt = new Date();
    payment.metadata = {
      ...payment.metadata,
      transactionReference,
      confirmedBy: adminId,
      confirmationNote: note,
      confirmedAt: new Date().toISOString(),
    };

    await payment.save();
    await this.updateOrderByPaymentStatus(payment);

    const order = await this.orderService.findById(payment.order.toString());
    if (order) {
      let email: string | null = null;
      if (order.user) {
        const user = await this.userService.findById(order.user.toString());
        email = user?.email ?? null;
      } else {
        email = this.orderService.getOrderEmail(order);
      }

      if (email) {
        try {
          await this.mailService.sendBankTransferConfirmed(email, order.orderNumber);
        } catch (emailError) {
          this.logger.error('Error enviando confirmación de transferencia:', emailError);
        }
      }
    }

    this.logger.log(`✅ Transferencia confirmada por admin ${adminId}: ${payment._id.toString()}`);

    return this.toPaymentResponseDto(payment);
  }

  async processWebhook(
    method: PaymentMethod,
    payload: any,
    headers?: MercadoPagoWebhookHeaders,
  ): Promise<void> {
    if (this.configService.get('NODE_ENV') !== 'production') {
      this.logger.log(`📥 Webhook recibido de ${method}`);
      this.logger.log('📦 Payload:', JSON.stringify(payload, null, 2));
      this.logger.log('📋 Headers:', JSON.stringify(headers, null, 2));
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (method === PaymentMethod.MERCADO_PAGO && payload?.data?.id) {
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
          $or: [
            { externalId: webhookData.externalId },
            { preferenceId: webhookData.externalId },
            { 'metadata.external_reference': webhookData.metadata?.external_reference },
          ],
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

      const oldStatus = payment.statusHistory.at(-1)?.status || payment.status;

      if (oldStatus === PaymentStatus.APPROVED) {
        return;
      }
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

    let email: string | null = null;
    if (order.user) {
      const user = await this.userService.findById(order.user.toString());
      email = user?.email ?? null;
    } else {
      email = this.orderService.getOrderEmail(order);
    }

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

        try {
          const existingShipping = await this.shippingService.findShippingByOrderId(
            order._id.toString(),
          );

          if (!existingShipping) {
            await this.shippingService.createShipping({
              orderId: order._id.toString(),
              method: order.shippingMethod || ShippingMethod.STANDARD,
              cost: order.shippingCost,
              weight: order.totalWeight || 0,
              carrier: undefined,
              notes: undefined,
              adminNotes: `Creado automáticamente al confirmar pago`,
            });

            this.logger.log(`✅ Shipping creado automáticamente para orden ${order.orderNumber}`);
          }
        } catch (error) {
          this.logger.error(`❌ Error creando shipping automático:`, error);
        }

        if (email && payment.status === PaymentStatus.APPROVED) {
          const shouldSendEmail = await this.orderService.markEmailSentIfNotSent(
            order._id.toString(),
          );

          if (shouldSendEmail) {
            try {
              await this.mailService.sendOrderConfirmation(email, {
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
        {
          if (
            order.status === OrderStatus.REFUNDED ||
            order.status === OrderStatus.REFUND_PENDING
          ) {
            this.logger.log(`ℹ️ Orden ${order.orderNumber} ya procesada como reembolsada`);
            return;
          }

          const isShippedOrDelivered =
            order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED;

          if (isShippedOrDelivered) {
            this.logger.warn(
              `⚠️ Reembolso para orden enviada: ${order.orderNumber}. ` +
                `El stock se devolverá cuando se reciba el producto.`,
            );

            order.status = OrderStatus.REFUND_PENDING;
            order.statusHistory.push({
              status: OrderStatus.REFUND_PENDING,
              timestamp: new Date(),
              note: 'Reembolso procesado. Pendiente devolución física del producto.',
            });
          } else {
            order.status = OrderStatus.REFUNDED;

            for (const item of order.items) {
              if (item.variant?.size) {
                await this.stockService.releaseStock(
                  item.product.toString(),
                  item.variant.size,
                  item.quantity,
                );
              }
            }
          }
          await order.save();

          if (order.user) {
            const user = await this.userService.findById(order.user.toString());
            if (user) {
              await this.mailService.sendOrderRefunded(user.email, {
                orderNumber: order.orderNumber,
                total: order.total,
                paymentMethod: order.paymentMethod || 'N/A',
              });
            }
          }
        }
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

    if (order.user && order.user.toString() !== userId) {
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

    const order = await this.orderService.findById(payment.order.toString());

    if (!order) {
      throw new NotFoundException('Orden no encontrada');
    }

    if (order.status === OrderStatus.SHIPPED || order.status === OrderStatus.DELIVERED) {
      throw new BadRequestException(
        'La orden ya fue enviada. El reembolso requiere devolución del producto.',
      );
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

      for (const item of order.items) {
        if (item.variant?.size) {
          await this.stockService.releaseStock(
            item.product.toString(),
            item.variant.size,
            item.quantity,
          );
        }
      }

      order.status = OrderStatus.REFUNDED;
      order.statusHistory.push({
        status: OrderStatus.REFUNDED,
        timestamp: new Date(),
        note: `Reembolso procesado por admin ${adminId}`,
        updatedBy: new Types.ObjectId(adminId),
      });
      await order.save();

      let email: string | null = null;

      if (order.user) {
        const user = await this.userService.findById(order.user.toString());
        email = user?.email ?? null;
      } else {
        email = this.orderService.getOrderEmail(order);
      }

      if (email) {
        await this.mailService.sendOrderRefunded(email, {
          orderNumber: order.orderNumber,
          total: order.total,
          paymentMethod: order.paymentMethod || 'N/A',
        });
      }

      return this.toPaymentResponseDto(payment);
    } catch (error) {
      if (this.configService.get('NODE_ENV') !== 'production') {
        this.logger.error(`❌ Error procesando reembolso:`, error);
      }
      throw new BadRequestException('No se pudo procesar el reembolso');
    }
  }

  async getPaymentByOrderIdAdmin(orderId: string): Promise<PaymentDocument> {
    const payment = await this.paymentModel
      .findOne({ order: new Types.ObjectId(orderId) })
      .sort({ createdAt: -1 })
      .exec();

    if (!payment) {
      throw new NotFoundException('No se encontró un pago para esta orden');
    }

    return payment;
  }

  private verifyMercadoPagoSignature(payload: any, signature?: string, requestId?: string) {
    if (!signature || !requestId) {
      this.logger.warn('⚠️ Headers de firma faltantes, se continúa');
      return;
    }

    const secret = this.configService.get<string>('MERCADO_PAGO_WEBHOOK_SECRET');
    if (!secret) {
      throw new Error('Webhook secret no configurado');
    }

    const parts = signature.split(',');
    let ts: string | undefined;
    let hash: string | undefined;

    for (const part of parts) {
      const [key, value] = part.split('=');
      if (key === 'ts') {
        ts = value;
      } else if (key === 'v1') {
        hash = value;
      }
    }

    if (!ts || !hash) {
      this.logger.error('❌ Formato de firma inválido:', signature);
      throw new ForbiddenException('Formato de firma inválido');
    }

    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const dataId = payload.data?.id || '';
    const manifestVariants = [
      `id:${dataId};request-id:${requestId};`,
      `ts:${ts};id:${dataId};request-id:${requestId};`,
      `id:${dataId};request-id:${requestId};ts:${ts};`,
    ];

    let validSignature = false;

    for (const manifest of manifestVariants) {
      const expectedSignature = crypto.createHmac('sha256', secret).update(manifest).digest('hex');

      if (expectedSignature === hash) {
        validSignature = true;
        break;
      }
    }

    if (!validSignature) {
      this.logger.error('❌ Firma inválida con todos los formatos probados');
      this.logger.warn('⚠️ Firma MP inválida, se continúa por validación vía API');
      return;
    }

    this.logger.log('✅ Firma verificada correctamente');
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
