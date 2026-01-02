export enum ColorEnum {
  NEGRO = 'negro',
  BLANCO = 'blanco',
  GRIS = 'gris',
  AZUL = 'azul',
  ROJO = 'rojo',
  VERDE = 'verde',
  AMARILLO = 'amarillo',
  NARANJA = 'naranja',
  ROSA = 'rosa',
  MORADO = 'morado',
  MARRON = 'marrón',
  BEIGE = 'beige',
  MULTICOLOR = 'multicolor',
}

export enum GenderEnum {
  HOMBRE = 'hombre',
  MUJER = 'mujer',
  UNISEX = 'unisex',
  NINO = 'niño',
}

export interface ProductSize {
  size: string;
  stock: number;
  minStock: number;
  reserved: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  subcategory?: string;
  code: string;
  status: boolean;
  material?: string;
  brand?: string;
  images: string[];
  color: ColorEnum;
  discount: number;
  tags: string[];
  gender: string;
  slug: string;
  metaDescription?: string;
  featured: boolean;
  salesCount: number;
  rating: number;
  reviewsCount: number;
  sizes: ProductSize[];
  weight: number;
  totalStock: number;
  availableSizes: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  minPrice?: number;
  maxPrice?: number;
  color?: ColorEnum;
  gender?: GenderEnum;
  brand?: string;
  sizes?: string[];
  inStock?: boolean;
  featured?: boolean;
  search?: string;
  sortBy?: 'price' | 'salesCount' | 'rating' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedProducts {
  docs: Product[];
  totalDocs: number;
  limit: number;
  page: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}