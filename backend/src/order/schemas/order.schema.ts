import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { PaymentMethod } from '../enums/payment-method.enum';
import { OrderStatus } from '../enums/order-status.enum';
import { ShippingMethod } from '../../shipping/enums/shipping.enum';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ timestamps: true, versionKey: false, collection: 'orders' })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', index: true })
  user?: Types.ObjectId;

  @Prop({ unique: true, uppercase: true })
  orderNumber!: string;

  @Prop({
    type: {
      email: { type: String, required: true, lowercase: true, trim: true },
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
    },
    _id: false,
  })
  guestInfo?: {
    email: string;
    fullName: string;
    phone: string;
  };

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        name: { type: String, required: true },
        code: { type: String, required: true },
        variant: {
          size: { type: String, trim: true },
          color: { type: String, trim: true },
          _id: false,
        },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        discount: { type: Number, default: 0, min: 0, max: 100 },
        subtotal: { type: Number, required: true, min: 0 },
        image: { type: String },
      },
    ],
    default: [],
  })
  items!: {
    product: Types.ObjectId;
    name: string;
    code: string;
    variant?: { size?: string; color?: string };
    quantity: number;
    unitPrice: number;
    discount: number;
    subtotal: number;
    image?: string;
  }[];

  @Prop({ required: true, min: 0 })
  subtotal!: number;

  @Prop({ default: 0, min: 0 })
  discount!: number;

  @Prop({ default: 0, min: 0 })
  shippingCost!: number;

  @Prop({ min: 0, default: 0 })
  totalWeight?: number;

  @Prop({ required: true, min: 0 })
  total!: number;

  @Prop({
    enum: Object.values(OrderStatus),
    default: OrderStatus.PENDING,
    index: true,
  })
  status!: OrderStatus;

  @Prop({
    enum: Object.values(PaymentMethod),
    required: false,
  })
  paymentMethod?: PaymentMethod;

  @Prop({
    enum: Object.values(ShippingMethod),
    required: false,
  })
  shippingMethod?: ShippingMethod;

  @Prop({
    type: {
      transactionId: String,
      status: String,
      paidAt: Date,
      metadata: Object,
    },
    _id: false,
  })
  paymentDetails?: {
    transactionId?: string;
    status?: string;
    paidAt?: Date;
    metadata?: Record<string, any>;
  };

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
  shippingAddress!: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    additionalInfo?: string;
  };

  @Prop({
    type: [
      {
        status: { type: String, enum: Object.values(OrderStatus), required: true },
        timestamp: { type: Date, default: Date.now },
        note: String,
        updatedBy: { type: Types.ObjectId, ref: 'User' },
      },
    ],
    default: [],
  })
  statusHistory!: {
    status: OrderStatus;
    timestamp: Date;
    note?: string;
    updatedBy?: Types.ObjectId;
  }[];

  @Prop()
  notes?: string;

  @Prop()
  adminNotes?: string;

  @Prop()
  trackingNumber?: string;

  @Prop()
  estimatedDelivery?: Date;

  @Prop()
  deliveredAt?: Date;

  @Prop()
  cancelledAt?: Date;

  @Prop()
  cancellationReason?: string;

  @Prop({ default: false })
  emailSent?: boolean;

  @Prop({ default: false, index: true })
  isGuest!: boolean;

  createdAt?: Date;

  updatedAt?: Date;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

OrderSchema.index({ user: 1, status: 1 });
OrderSchema.index({ user: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });
OrderSchema.index({ 'paymentDetails.transactionId': 1 }, { sparse: true });

OrderSchema.pre('save', function (next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    this.orderNumber = `ORD-${dateStr}-${random}`;
  }

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

  if (!this.user && !this.guestInfo) {
    return next(new Error('La orden debe tener un usuario registrado o información de invitado'));
  }

  this.isGuest = !this.user;

  next();
});
