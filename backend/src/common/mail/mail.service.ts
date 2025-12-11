import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { SentMessageInfo } from 'nodemailer';

@Injectable()
export class MailService {
  constructor(
    private readonly mailer: MailerService,
    private readonly config: ConfigService,
  ) {}

  async sendMail(to: string, subject: string, html: string): Promise<SentMessageInfo> {
    return this.mailer.sendMail({
      to,
      subject,
      html,
    });
  }

  async sendResetPasswordEmail(to: string, token: string): Promise<SentMessageInfo> {
    const frontend = this.config.get<string>('FRONTEND_URL') ?? '';
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
    const frontend = this.config.get<string>('FRONTEND_URL') ?? '';
    const url = `${frontend}/verify-email?token=${encodeURIComponent(token)}`;

    const html = `<p>Verifica tu correo haciendo click <a href="${url}">aquí</a>.</p>`;

    return this.sendMail(to, 'Verificar correo', html);
  }
}
