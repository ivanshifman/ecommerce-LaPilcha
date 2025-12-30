import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Coupon, CouponDocument } from '../schemas/coupon.schema';
import { CouponStatus } from '../enums/coupon-type.enum';

@Injectable()
export class ExpireCouponsJob {
  private readonly logger = new Logger(ExpireCouponsJob.name);

  constructor(@InjectModel(Coupon.name) private couponModel: Model<CouponDocument>) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT, {
    name: 'expire-coupons',
    timeZone: 'America/Argentina/Buenos_Aires',
  })
  async handleExpireCoupons() {
    this.logger.log('🗓️ Verificando cupones expirados...');

    try {
      const now = new Date();

      const result = await this.couponModel.updateMany(
        {
          status: CouponStatus.ACTIVE,
          endDate: { $lt: now },
        },
        {
          $set: { status: CouponStatus.EXPIRED },
        },
      );

      if (result.modifiedCount > 0) {
        this.logger.log(`✅ ${result.modifiedCount} cupones marcados como expirados`);
      } else {
        this.logger.log('✅ No hay cupones para expirar');
      }
    } catch (error) {
      this.logger.error('❌ Error al expirar cupones:', error);
    }
  }
}
