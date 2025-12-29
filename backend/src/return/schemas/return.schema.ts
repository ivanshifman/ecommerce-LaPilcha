import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ReturnStatus } from '../enums/return-status.enum';
import { ReturnReason, ReturnResolution } from '../enums/return-reason.enum';

export type ReturnDocument = HydratedDocument<Return>;

@Schema({ timestamps: true, versionKey: false, collection: 'returns' })
export class Return {
  @Prop({ type: Types.ObjectId, ref: 'Order', required: true, index: true })
  order!: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  user?: Types.ObjectId;

  @Prop({ unique: true, uppercase: true })
  returnNumber!: string;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        variant: {
          size: { type: String, trim: true },
          color: { type: String, trim: true },
          _id: false,
        },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true },
        reason: {
          type: String,
          enum: Object.values(ReturnReason),
          required: true,
        },
        condition: { type: String },
        image: { type: String },
      },
    ],
    default: [],
  })
  items!: {
    product: Types.ObjectId;
    name: string;
    variant?: { size?: string; color?: string };
    quantity: number;
    unitPrice: number;
    reason: ReturnReason;
    condition?: string;
    image?: string;
  }[];

  @Prop({
    enum: Object.values(ReturnStatus),
    default: ReturnStatus.REQUESTED,
    index: true,
  })
  status!: ReturnStatus;

  @Prop({
    enum: Object.values(ReturnReason),
    required: true,
  })
  primaryReason!: ReturnReason;

  @Prop()
  customerComment?: string;

  @Prop({ type: [String], default: [] })
  customerImages?: string[];

  @Prop({ required: true, min: 0 })
  requestedAmount!: number;

  @Prop({ min: 0 })
  approvedAmount?: number;

  @Prop({ min: 0 })
  refundedAmount?: number;

  @Prop({
    enum: Object.values(ReturnResolution),
    default: ReturnResolution.FULL_REFUND,
  })
  resolution!: ReturnResolution;

  @Prop()
  trackingNumber?: string;

  @Prop()
  receivedAt?: Date;

  @Prop()
  inspectedAt?: Date;

  @Prop()
  refundedAt?: Date;

  @Prop()
  approvedAt?: Date;

  @Prop()
  rejectedAt?: Date;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  approvedBy?: Types.ObjectId;

  @Prop({ type: Types.ObjectId, ref: 'User' })
  rejectedBy?: Types.ObjectId;

  @Prop()
  adminNotes?: string;

  @Prop()
  rejectionReason?: string;

  @Prop()
  inspectionNotes?: string;

  @Prop({
    type: [
      {
        status: {
          type: String,
          enum: Object.values(ReturnStatus),
          required: true,
        },
        timestamp: { type: Date, default: Date.now },
        note: String,
        updatedBy: { type: Types.ObjectId, ref: 'User' },
      },
    ],
    default: [],
  })
  statusHistory!: {
    status: ReturnStatus;
    timestamp: Date;
    note?: string;
    updatedBy?: Types.ObjectId;
  }[];

  @Prop({ default: false })
  requiresPickup!: boolean;

  @Prop()
  pickupAddress?: string;

  @Prop()
  pickupScheduledAt?: Date;

  @Prop({ default: false })
  stockRestored!: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

export const ReturnSchema = SchemaFactory.createForClass(Return);

ReturnSchema.index({ user: 1, status: 1 });
ReturnSchema.index({ status: 1, createdAt: -1 });

ReturnSchema.pre('save', function (next) {
  if (this.isNew && !this.returnNumber) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.returnNumber = `RMA-${dateStr}-${random}`;
  }

  next();
});
