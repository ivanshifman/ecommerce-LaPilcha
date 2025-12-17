import { ProductDocument } from '../../product/schemas/product.schema';
import { Types } from 'mongoose';

export type CartItemPopulated = {
  product: ProductDocument | null;
  variant?: {
    size?: string;
    color?: string;
  };
  quantity: number;
  addedAt: Date;
  priceAtAdd: number;
};

export type CartPopulated = {
  _id: Types.ObjectId;
  items: CartItemPopulated[];
  createdAt?: Date;
  updatedAt?: Date;
};
