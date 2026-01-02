import { Product } from './product.types';

export interface CartItem {
  product: Product;
  variant?: {
    size?: string;
    color?: string;
  };
  quantity: number;
  addedAt: string;
  priceAtAdd: number;
  subtotal: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  discount: number;
  total: number;
  isAnonymous: boolean;
  createdAt: string;
  updatedAt: string;
  createdAtLocal: string;
  updatedAtLocal: string;
}

export interface AddToCartDto {
  product: string;
  variant?: {
    size?: string;
    color?: string;
  };
  quantity: number;
}

export interface UpdateCartItemDto {
  product: string;
  variant?: {
    size?: string;
    color?: string;
  };
  quantity: number;
}

export interface RemoveCartItemDto {
  product: string;
  variant?: {
    size?: string;
    color?: string;
  };
}