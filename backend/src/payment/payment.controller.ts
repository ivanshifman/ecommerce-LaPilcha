/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  UseGuards,
  Req,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { Request } from 'express';
import { PaymentService } from './payment.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '../cart/guards/optional-jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AuthenticatedUserDto } from '../auth/dto/authenticated-user.dto';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { MongoIdDto } from '../common/dto/mongo-id.dto';
import { getCookieCart } from '../common/utils/request.util';
import { CART_COOKIE } from '../common/utils/cookie.util';
import { PaymentMethod } from '../order/enums/payment-method.enum';
import { UserRole } from '../user/common/enums/userRole.enum';
import { MercadoPagoWebhookHeaders } from './types/mercadopago-webhook.type';

@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  async createPayment(@Req() req: Request, @Body() dto: CreatePaymentDto) {
    const user = req.user as AuthenticatedUserDto | undefined;
    const anonymousCartId = getCookieCart(req, CART_COOKIE);
    return await this.paymentService.createPayment(dto, user?.id, anonymousCartId);
  }

  @Get('webhook/mercadopago')
  @HttpCode(HttpStatus.OK)
  async mercadoPagoWebhookGet(
    @Req() req: Request,
    @Query('id') id?: string,
    @Query('topic') topic?: string,
    @Query('data.id') dataId?: string,
  ) {
    return this.processMercadoPagoWebhook(req, {}, id, topic, dataId);
  }

  @Post('webhook/mercadopago')
  @HttpCode(HttpStatus.OK)
  async mercadoPagoWebhookPost(
    @Req() req: Request,
    @Body() payload: any,
    @Query('id') id?: string,
    @Query('topic') topic?: string,
    @Query('data.id') dataId?: string,
  ) {
    return this.processMercadoPagoWebhook(req, payload, id, topic, dataId);
  }

  private async processMercadoPagoWebhook(
    req: Request,
    payload: any,
    id?: string,
    topic?: string,
    dataId?: string,
  ) {
    if (topic && topic !== 'payment') {
      return { message: `Topic ${topic} ignorado, esperando topic "payment"` };
    }

    const headers: MercadoPagoWebhookHeaders = {
      signature: req.headers['x-signature'] as string | undefined,
      requestId: req.headers['x-request-id'] as string | undefined,
    };

    const paymentId = payload?.data?.id || dataId || id;

    if (!paymentId) {
      return { message: 'Webhook recibido sin ID de pago' };
    }

    if (paymentId.includes('-') && paymentId.split('-').length > 2) {
      return { message: 'PreferenceId recibido, esperando payment ID real' };
    }

    const normalizedPayload = { data: { id: paymentId } };

    try {
      await this.paymentService.processWebhook(
        PaymentMethod.MERCADO_PAGO,
        normalizedPayload,
        headers,
      );
      return { message: 'Webhook procesado correctamente', paymentId };
    } catch {
      return {
        message: 'Webhook recibido pero pendiente de procesamiento',
        note: 'Se procesará cuando el pago se complete en MP',
      };
    }
  }

  @Post('webhook/modo')
  @HttpCode(HttpStatus.OK)
  async modoWebhook(@Body() payload: any) {
    // TODO: Implementar validación de firma cuando se necesite mayor seguridad

    await this.paymentService.processWebhook(PaymentMethod.MODO, payload);
    return { message: 'Webhook procesado' };
  }

  @UseGuards(JwtAuthGuard)
  @Get('order/:id')
  async getPaymentByOrderId(@Req() req: Request, @Param() params: MongoIdDto) {
    const user = req.user as AuthenticatedUserDto;
    return await this.paymentService.getPaymentByOrderId(params.id, user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-payments')
  async getMyPayments(@Req() req: Request) {
    const user = req.user as AuthenticatedUserDto;
    return await this.paymentService.getMyPayments(user.id);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  async getAllPayments() {
    return await this.paymentService.getAllPayments();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post(':id/refund')
  async refundPayment(@Req() req: Request, @Param() params: MongoIdDto) {
    const admin = req.user as AuthenticatedUserDto;
    return await this.paymentService.refundPayment(params.id, admin.id);
  }
}
