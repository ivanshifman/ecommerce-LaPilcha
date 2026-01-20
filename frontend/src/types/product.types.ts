export enum ColorEnum {
    BLACK = 'negro',
    WHITE = 'blanco',
    RED = 'rojo',
    BLUE = 'azul',
    GREEN = 'verde',
    YELLOW = 'amarillo',
    GRAY = 'gris',
    BROWN = 'marron',
}

export enum GenderEnum {
    MALE = 'male',
    FEMALE = 'female',
    UNISEX = 'unisex',
    KID = 'kid',
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
    status?: boolean;
    material?: string;
    brand?: string;
    images?: string[];
    color: ColorEnum;
    discount?: number;
    tags?: string[];
    gender?: GenderEnum;
    slug?: string;
    metaDescription?: string;
    featured?: boolean;
    salesCount?: number;
    rating?: number;
    reviewsCount?: number;
    sizes?: ProductSize[];
    productGroup?: string;
    weight?: number;
    totalStock: number;
    availableSizes: string[];
    createdAt: string;
    updatedAt: string;
}

export interface ProductFilters {
    category?: string;
    subcategory?: string;
    priceMin?: number;
    priceMax?: number;
    color?: ColorEnum;
    gender?: GenderEnum;
    brand?: string;
    size?: string;
    featured?: boolean;
    search?: string;
    sortBy?: 'price' | 'salesCount' | 'rating' | 'createdAt';
    order?: 'asc' | 'desc';
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