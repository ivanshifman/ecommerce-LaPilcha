import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Coupon, CouponSchema } from './schemas/coupon.schema';
import { CouponUsage, CouponUsageSchema } from './schemas/coupon-usage.schema';
import { CouponController } from './coupon.controller';
import { CouponService } from './coupon.service';
import { UserModule } from '../user/user.module';
import { ExpireCouponsJob } from './jobs/expire-coupons.job';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Coupon.name, schema: CouponSchema },
      { name: CouponUsage.name, schema: CouponUsageSchema },
    ]),
    UserModule,
  ],
  controllers: [CouponController],
  providers: [CouponService, ExpireCouponsJob],
  exports: [CouponService],
})
export class CouponModule {}
