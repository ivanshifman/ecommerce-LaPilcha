import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ShippingZone, ShippingMethod } from '../enums/shipping.enum';

export type ShippingRateDocument = HydratedDocument<ShippingRate>;

@Schema({ timestamps: true, versionKey: false, collection: 'shipping_rates' })
export class ShippingRate {
  @Prop({
    enum: Object.values(ShippingZone),
    required: true,
    index: true,
  })
  zone!: ShippingZone;

  @Prop({
    enum: Object.values(ShippingMethod),
    required: true,
    index: true,
  })
  method!: ShippingMethod;

  @Prop({ required: true, min: 0 })
  basePrice!: number;

  @Prop({ min: 0, default: 0 })
  pricePerKg?: number;

  @Prop({ min: 0, default: 0 })
  freeShippingThreshold?: number;

  @Prop({ min: 1, default: 3 })
  estimatedDaysMin!: number;

  @Prop({ min: 1, default: 7 })
  estimatedDaysMax!: number;

  @Prop({ default: true })
  isActive!: boolean;

  @Prop()
  description?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ShippingRateSchema = SchemaFactory.createForClass(ShippingRate);

ShippingRateSchema.index({ zone: 1, method: 1 }, { unique: true });
