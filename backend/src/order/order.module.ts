import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { CartModule } from '../cart/cart.module';
import { ProductModule } from '../product/product.module';
import { UserModule } from '../user/user.module';
import { MailModule } from '../common/mail/mail.module';
import { OrderJob } from './jobs/order.job';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    CartModule,
    ProductModule,
    UserModule,
    MailModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderJob],
  exports: [OrderService],
})
export class OrderModule {}
