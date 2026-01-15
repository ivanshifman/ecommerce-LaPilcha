'use client';

import { ProductCard } from '../products/ProductCard';
import type { Product } from '../../types/product.types';
import type { User } from '../../types/auth.types';

interface Props {
    products: Product[];
    user: User | null;
}

export function ProductGrid({ products, user }: Props) {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard key={product.id} product={product} user={user} />
            ))}
        </div>
    );
}