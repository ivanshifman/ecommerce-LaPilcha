import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Payment, PaymentSchema } from './schemas/payment.schema';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { MailModule } from '../common/mail/mail.module';
import { CartModule } from '../cart/cart.module';
import { OrderModule } from '../order/order.module';
import { UserModule } from '../user/user.module';
import { MercadoPagoStrategy } from './strategies/mercadopago.strategy';
import { ModoStrategy } from './strategies/modo.strategy';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Payment.name, schema: PaymentSchema }]),
    CartModule,
    OrderModule,
    MailModule,
    UserModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, MercadoPagoStrategy, ModoStrategy],
  exports: [PaymentService],
})
export class PaymentModule {}
