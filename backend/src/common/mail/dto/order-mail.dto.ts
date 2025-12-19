export interface OrderMailItemDto {
  name: string;
  image?: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
  variant?: {
    size?: string;
  };
}

export interface OrderMailDto {
  orderNumber: string;
  createdAt: Date;
  items: OrderMailItemDto[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  paymentMethod?: string;
  shippingAddress: {
    fullName: string;
    address: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
  };
}
