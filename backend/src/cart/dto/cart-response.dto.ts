export class CartItemResponseDto {
  product!: {
    id: string;
    name: string;
    price: number;
    discount?: number;
    finalPrice: number;
    images?: string[];
    slug?: string;
    status: boolean;
    color: string;
    brand?: string;
  };
  variant?: {
    size?: string;
    color?: string;
  };
  quantity!: number;
  subtotal!: number;
  availableStock!: number;
  isAvailable!: boolean;
  priceAtAdd!: number;
  currentPrice!: number;
  priceChanged!: boolean;
}

export class CartResponseDto {
  id?: string;
  items!: CartItemResponseDto[];
  itemCount!: number;
  subtotal!: number;
  discount!: number;
  total!: number;
  isAnonymous!: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  createdAtLocal?: string;
  updatedAtLocal?: string;
}
