import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { SentMessageInfo } from 'nodemailer';
import { OrderMailDto } from './dto/order-mail.dto';
import { OrderMailTemplates } from './templates/order-mail.templates';

@Injectable()
export class MailService {
  constructor(
    private readonly mailerService: MailerService,
    private readonly configService: ConfigService,
  ) {}

  async sendMail(to: string, subject: string, html: string): Promise<SentMessageInfo> {
    return this.mailerService.sendMail({
      to,
      subject,
      html,
    });
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<SentMessageInfo> {
    const frontend = this.configService.get<string>('FRONTEND_URL') ?? '';
    const url = `${frontend}/reset-password?token=${encodeURIComponent(token)}`;

    const html = `
      <p>Has solicitado restablecer tu contraseña.</p>
      <p>Haz click <a href="${url}">aquí</a> para crear una nueva contraseña.</p>
      <p>Si no solicitaste esto, ignora este correo.</p>
    `;

    return this.sendMail(to, 'Restablecer contraseña', html);
  }

  async sendVerificationCode(to: string, code: string): Promise<SentMessageInfo> {
    const html = `
      <p>Tu código de verificación es:</p>
      <h2>${code}</h2>
      <p>Este código expirará en 1 hora.</p>
    `;
    return this.sendMail(to, 'Código de verificación', html);
  }

  async sendVerificationLink(to: string, token: string): Promise<SentMessageInfo> {
    const frontend = this.configService.get<string>('FRONTEND_URL') ?? '';
    const url = `${frontend}/verify-email?token=${encodeURIComponent(token)}`;

    const html = `<p>Verifica tu correo haciendo click <a href="${url}">aquí</a>.</p>`;

    return this.sendMail(to, 'Verificar correo', html);
  }

  async sendBankTransferInstructions(
    email: string,
    data: {
      orderNumber: string;
      amount: number;
      paymentId: string;
      originalAmount?: number;
      discount?: number;
    },
  ): Promise<SentMessageInfo> {
    return this.sendMail(
      email,
      `Instrucciones de pago - Orden ${data.orderNumber}`,
      OrderMailTemplates.bankTransferInstructions(data),
    );
  }

  async sendBankTransferConfirmed(email: string, orderNumber: string): Promise<SentMessageInfo> {
    return this.sendMail(
      email,
      `Pago confirmado - Orden ${orderNumber}`,
      OrderMailTemplates.bankTransferConfirmed(orderNumber),
    );
  }

  async sendOrderConfirmation(email: string, order: OrderMailDto): Promise<SentMessageInfo> {
    return this.sendMail(
      email,
      `Confirmación de orden ${order.orderNumber}`,
      OrderMailTemplates.confirmation(order),
    );
  }

  async sendOrderRefunded(
    email: string,
    order: {
      orderNumber: string;
      total: number;
      paymentMethod: string;
    },
  ): Promise<SentMessageInfo> {
    return this.sendMail(
      email,
      `Reembolso de orden ${order.orderNumber}`,
      OrderMailTemplates.refunded(order),
    );
  }

  async sendOrderCancellation(email: string, orderNumber: string): Promise<SentMessageInfo> {
    return this.sendMail(
      email,
      `Orden ${orderNumber} cancelada`,
      OrderMailTemplates.cancelled(orderNumber),
    );
  }

  async sendOrderShipped(
    email: string,
    orderNumber: string,
    trackingNumber?: string,
  ): Promise<SentMessageInfo> {
    return this.sendMail(
      email,
      `Tu orden ${orderNumber} fue enviada`,
      OrderMailTemplates.shipped(orderNumber, trackingNumber),
    );
  }

  async sendOrderDelivered(email: string, orderNumber: string): Promise<SentMessageInfo> {
    return this.sendMail(
      email,
      `Orden ${orderNumber} entregada`,
      OrderMailTemplates.delivered(orderNumber),
    );
  }

  async sendReadyForPickup(email: string, orderNumber: string): Promise<SentMessageInfo> {
    return this.sendMail(
      email,
      `Orden ${orderNumber} lista para retirar`,
      OrderMailTemplates.readyForPickup(orderNumber),
    );
  }

  async sendReturnRequested(
    email: string,
    returnNumber: string,
    orderNumber: string,
  ): Promise<SentMessageInfo> {
    return this.sendMail(
      email,
      `Solicitud de devolución ${returnNumber}`,
      OrderMailTemplates.returnRequested(returnNumber, orderNumber),
    );
  }

  async sendReturnApproved(
    email: string,
    returnNumber: string,
    approvedAmount: number,
  ): Promise<SentMessageInfo> {
    return this.sendMail(
      email,
      `Devolución aprobada ${returnNumber}`,
      OrderMailTemplates.returnApproved(returnNumber, approvedAmount),
    );
  }

  async sendReturnRejected(
    email: string,
    returnNumber: string,
    reason: string,
  ): Promise<SentMessageInfo> {
    return this.sendMail(
      email,
      `Devolución rechazada ${returnNumber}`,
      OrderMailTemplates.returnRejected(returnNumber, reason),
    );
  }

  async sendReturnReceived(email: string, returnNumber: string): Promise<SentMessageInfo> {
    return this.sendMail(
      email,
      `Producto recibido - ${returnNumber}`,
      OrderMailTemplates.returnReceived(returnNumber),
    );
  }

  async sendReturnRefundProcessed(
    email: string,
    returnNumber: string,
    refundedAmount: number,
    paymentMethod: string,
  ): Promise<SentMessageInfo> {
    return this.sendMail(
      email,
      `Reembolso procesado - ${returnNumber}`,
      OrderMailTemplates.refundProcessed(returnNumber, refundedAmount, paymentMethod),
    );
  }

  async sendContactForm(data: {
    name: string;
    email: string;
    phone?: string;
    subject: string;
    message: string;
    isAuthenticated?: boolean;
    userId?: string;
  }): Promise<SentMessageInfo> {
    const adminEmail = this.configService.get<string>('ADMIN_EMAIL') || 'info@lapilcha.com';

    return this.sendMail(
      adminEmail,
      `[Contacto] ${data.subject} - ${data.name}`,
      OrderMailTemplates.sendContactForm(data),
    );
  }
}
