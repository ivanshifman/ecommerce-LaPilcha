import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CouponUsageDocument = HydratedDocument<CouponUsage>;

@Schema({ timestamps: true, versionKey: false, collection: 'coupon_usages' })
export class CouponUsage {
  @Prop({ type: Types.ObjectId, ref: 'Coupon', required: true, index: true })
  coupon!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  user?: Types.ObjectId;

  @Prop()
  guestEmail?: string;

  @Prop({ type: Types.ObjectId, ref: 'Order', required: true })
  order!: Types.ObjectId;

  @Prop({ required: true })
  couponCode!: string;

  @Prop({ required: true, min: 0 })
  discountApplied!: number;

  @Prop({ required: true, min: 0 })
  orderTotal!: number;

  createdAt?: Date;
}

export const CouponUsageSchema = SchemaFactory.createForClass(CouponUsage);

CouponUsageSchema.index({ user: 1, coupon: 1 });
CouponUsageSchema.index({ order: 1 });
