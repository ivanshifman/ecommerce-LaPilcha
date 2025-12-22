import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PaymentMethod } from '../../order/enums/payment-method.enum';
import { PaymentStatus } from '../enums/payment-status.enum';

export type PaymentDocument = HydratedDocument<Payment>;

@Schema({ timestamps: true, versionKey: false, collection: 'payments' })
export class Payment {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  order!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  user?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, index: true })
  anonymousId?: Types.ObjectId;

  @Prop({ required: true, min: 0 })
  amount!: number;

  @Prop({
    enum: Object.values(PaymentMethod),
    required: true,
  })
  method!: PaymentMethod;

  @Prop({
    enum: Object.values(PaymentStatus),
    default: PaymentStatus.PENDING,
    index: true,
  })
  status!: PaymentStatus;

  @Prop({ unique: true, sparse: true, index: true })
  externalId?: string;

  @Prop({ unique: true, sparse: true })
  preferenceId?: string;

  @Prop()
  checkoutUrl?: string;

  @Prop({ type: Object })
  metadata?: Record<string, any>;

  @Prop()
  errorMessage?: string;

  @Prop()
  paidAt?: Date;

  @Prop()
  refundedAt?: Date;

  @Prop({ type: [{ status: String, timestamp: Date, metadata: Object }], default: [] })
  statusHistory!: {
    status: PaymentStatus;
    timestamp: Date;
    metadata?: Record<string, any>;
  }[];

  createdAt?: Date;
  updatedAt?: Date;
}

export const PaymentSchema = SchemaFactory.createForClass(Payment);

PaymentSchema.index({ order: 1, status: 1 });
PaymentSchema.index({ user: 1, createdAt: -1 });

PaymentSchema.pre('save', function (next) {
  if (this.isNew) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  } else if (this.isModified('status')) {
    this.statusHistory.push({
      status: this.status,
      timestamp: new Date(),
    });
  }
  next();
});
