import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Return, ReturnSchema } from './schemas/return.schema';
import { ReturnService } from './return.service';
import { ReturnController } from './return.controller';
import { CartModule } from '../cart/cart.module';
import { OrderModule } from '../order/order.module';
import { PaymentModule } from '../payment/payment.module';
import { UserModule } from '../user/user.module';
import { MailModule } from '../common/mail/mail.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Return.name,
        schema: ReturnSchema,
      },
    ]),
    CartModule,
    OrderModule,
    MailModule,
    PaymentModule,
    UserModule,
  ],
  controllers: [ReturnController],
  providers: [ReturnService],
  exports: [ReturnService],
})
export class ReturnModule {}
