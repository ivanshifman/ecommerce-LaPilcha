'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { ShoppingCart } from 'lucide-react';
import { useCart, useCartActions } from '../../store/cartStore';

export function CartIcon() {
    const { cart } = useCart();
    const { fetchCart } = useCartActions();

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const itemCount = cart?.itemCount || 0;

    return (
        <Link
            href="/cart"
            className="relative p-2 hover:bg-accent rounded-full transition-colors"
            aria-label="Carrito de compras"
        >
            <ShoppingCart className="w-5 h-5 text-text-muted" />
            {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {itemCount > 9 ? '9+' : itemCount}
                </span>
            )}
        </Link>
    );
}