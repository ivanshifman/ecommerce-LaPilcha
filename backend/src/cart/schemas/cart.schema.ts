import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true, versionKey: false, collection: 'carts' })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: false })
  user?: Types.ObjectId;

  @Prop({ type: String, sparse: true, unique: true })
  anonymousId?: string;

  @Prop({
    type: [
      {
        product: { type: Types.ObjectId, ref: 'Product', required: true },
        variant: {
          size: { type: String, trim: true },
          color: { type: String, trim: true },
          _id: false,
        },
        quantity: { type: Number, required: true, min: 1, default: 1 },
        addedAt: { type: Date, default: Date.now },
        priceAtAdd: { type: Number, required: true },
      },
    ],
    default: [],
  })
  items!: {
    product: Types.ObjectId;
    variant?: { size?: string; color?: string };
    quantity: number;
    addedAt: Date;
    priceAtAdd: number;
  }[];

  createdAt?: Date;
  updatedAt?: Date;

  @Prop({ type: Date, default: null })
  expiresAt?: Date;
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.index({ user: 1 });
CartSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

CartSchema.pre('save', function (next) {
  if (this.anonymousId && !this.user) {
    const thirtyDays = 30 * 24 * 60 * 60 * 1000;
    this.expiresAt = new Date(Date.now() + thirtyDays);
  } else {
    this.expiresAt = undefined;
  }
  next();
});
