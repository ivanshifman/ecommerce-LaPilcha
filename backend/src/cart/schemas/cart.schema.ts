import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({ timestamps: true, versionKey: false, collection: 'carts' })
export class Cart {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user!: Types.ObjectId;

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
      },
    ],
    default: [],
  })
  items!: {
    product: Types.ObjectId;
    variant?: { size?: string; color?: string };
    quantity: number;
  }[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);

CartSchema.index({ user: 1 });
