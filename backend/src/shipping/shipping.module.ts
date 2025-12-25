import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Shipping, ShippingSchema } from './schemas/shipping.schema';
import { ShippingRate, ShippingRateSchema } from './schemas/shipping-rate.schema';
import { ShippingService } from './shipping.service';
import { ShippingCalculatorService } from './shipping-calculator.service';
import { ShippingController } from './shipping.controller';
import { OrderModule } from '../order/order.module';
import { MailModule } from '../common/mail/mail.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Shipping.name, schema: ShippingSchema },
      { name: ShippingRate.name, schema: ShippingRateSchema },
    ]),
    MailModule,
    UserModule,
    forwardRef(() => OrderModule),
  ],
  controllers: [ShippingController],
  providers: [ShippingService, ShippingCalculatorService],
  exports: [ShippingService, ShippingCalculatorService],
})
export class ShippingModule {}
