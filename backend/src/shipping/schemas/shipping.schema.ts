import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ShippingMethod, ShippingStatus } from '../enums/shipping.enum';

export type ShippingDocument = HydratedDocument<Shipping>;

@Schema({ timestamps: true, versionKey: false, collection: 'shippings' })
export class Shipping {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, unique: true, index: true })
  order!: Types.ObjectId;

  @Prop({
    enum: Object.values(ShippingMethod),
    required: true,
  })
  method!: ShippingMethod;

  @Prop({
    enum: Object.values(ShippingStatus),
    default: ShippingStatus.PENDING,
    index: true,
  })
  status!: ShippingStatus;

  @Prop()
  trackingNumber?: string;

  @Prop()
  carrier?: string;

  @Prop({ required: true, min: 0 })
  cost!: number;

  @Prop({ min: 0, default: 0 })
  weight?: number;

  @Prop({
    type: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      country: { type: String, default: 'Argentina' },
      additionalInfo: String,
    },
    required: true,
    _id: false,
  })
  address!: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    additionalInfo?: string;
  };

  @Prop()
  estimatedDeliveryDate?: Date;

  @Prop()
  actualDeliveryDate?: Date;

  @Prop()
  dispatchedAt?: Date;

  @Prop()
  preparedAt?: Date;

  @Prop({
    type: [
      {
        status: { type: String, enum: Object.values(ShippingStatus), required: true },
        timestamp: { type: Date, default: Date.now },
        location: String,
        note: String,
        updatedBy: { type: Types.ObjectId, ref: 'User' },
      },
    ],
    default: [],
  })
  trackingHistory!: {
    status: ShippingStatus;
    timestamp: Date;
    location?: string;
    note?: string;
    updatedBy?: Types.ObjectId;
  }[];

  @Prop()
  notes?: string;

  @Prop()
  adminNotes?: string;

  @Prop()
  labelUrl?: string;

  @Prop({ default: false })
  requiresSignature?: boolean;

  @Prop()
  deliveredTo?: string;

  @Prop()
  failureReason?: string;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ShippingSchema = SchemaFactory.createForClass(Shipping);

ShippingSchema.index({ status: 1, createdAt: -1 });
ShippingSchema.index({ trackingNumber: 1 }, { sparse: true });

ShippingSchema.pre('save', function (next) {
  if (this.isNew) {
    this.trackingHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  } else if (this.isModified('status')) {
    this.trackingHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});
