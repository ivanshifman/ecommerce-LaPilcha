import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { CouponType, CouponStatus } from '../enums/coupon-type.enum';

export type CouponDocument = HydratedDocument<Coupon>;

@Schema({ timestamps: true, versionKey: false, collection: 'coupons' })
export class Coupon {
  @Prop({ required: true, unique: true, uppercase: true, trim: true })
  code!: string;

  @Prop({ required: true })
  description!: string;

  @Prop({
    enum: Object.values(CouponType),
    required: true,
  })
  type!: CouponType;

  @Prop({ min: 0 })
  discountValue?: number;

  @Prop({ min: 0 })
  minPurchaseAmount?: number;

  @Prop({ min: 0 })
  maxDiscountAmount?: number;

  @Prop({ required: true })
  startDate!: Date;

  @Prop({ required: true })
  endDate!: Date;

  @Prop({ min: 0 })
  usageLimit?: number;

  @Prop({ default: 0, min: 0 })
  usageCount!: number;

  @Prop({
    min: 1,
    default: undefined,
  })
  usageLimitPerUser?: number;

  @Prop({ type: [String], default: [] })
  applicableCategories?: string[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }], default: [] })
  applicableProducts?: Types.ObjectId[];

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  restrictedToUsers?: Types.ObjectId[];

  @Prop({ default: false })
  firstPurchaseOnly!: boolean;

  @Prop({
    enum: Object.values(CouponStatus),
    default: CouponStatus.ACTIVE,
    index: true,
  })
  status!: CouponStatus;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  createdBy?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}

export const CouponSchema = SchemaFactory.createForClass(Coupon);

CouponSchema.index({ code: 1, status: 1 });
CouponSchema.index({ endDate: 1 });
