'use client';

import { Minus, Plus } from 'lucide-react';

interface Props {
    quantity: number;
    maxQuantity: number;
    quantityInCart?: number;
    onQuantityChange: (quantity: number) => void;
}

export function QuantitySelector({ quantity, maxQuantity, quantityInCart = 0, onQuantityChange }: Props) {
    const handleDecrease = () => {
        if (quantity > 1) {
            onQuantityChange(quantity - 1);
        }
    };

    const handleIncrease = () => {
        if (quantity < maxQuantity) {
            onQuantityChange(quantity + 1);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = Number(e.target.value);

        if (Number.isNaN(value)) return;

        if (value < 1) {
            onQuantityChange(1);
            return;
        }

        if (value > maxQuantity) {
            onQuantityChange(maxQuantity);
            return;
        }

        onQuantityChange(value);
    };


    return (
        <div>
            <label className="text-sm font-semibold text-text-primary mb-3 block">
                Cantidad
            </label>
            <div className="flex items-center gap-4">
                <div className="flex items-center border-2 border-border rounded-lg overflow-hidden">
                    <button
                        onClick={handleDecrease}
                        disabled={quantity <= 1}
                        className="p-3 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Disminuir cantidad"
                    >
                        <Minus className="w-4 h-4 text-text-primary" />
                    </button>
                    <input
                        type="number"
                        title='Cantidad'
                        min="1"
                        max={maxQuantity}
                        value={quantity}
                        onChange={handleInputChange}
                        className="w-16 text-center text-lg font-semibold text-text-primary bg-transparent focus:outline-none"
                    />
                    <button
                        onClick={handleIncrease}
                        disabled={quantity >= maxQuantity}
                        className="p-3 hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                        title="Aumentar cantidad"
                    >
                        <Plus className="w-4 h-4 text-text-primary" />
                    </button>
                </div>
                <span className="text-sm text-text-muted">
                    {maxQuantity === 0 ? (
                        <span className="text-destructive font-medium">
                            {quantityInCart > 0
                                ? `Ya tienes ${quantityInCart} en el carrito`
                                : 'Sin stock'}
                        </span>
                    ) : maxQuantity <= 3 ? (
                        <span className="text-warning font-medium">
                            {quantityInCart > 0
                                ? `Últimas ${maxQuantity} unidades (${quantityInCart} en carrito)`
                                : 'Últimas unidades'}
                        </span>
                    ) : maxQuantity <= 10 ? (
                        <span className="text-text-secondary">
                            {quantityInCart > 0
                                ? `Stock limitado (${quantityInCart} en carrito)`
                                : 'Stock limitado'}
                        </span>
                    ) : (
                        <span className="text-success font-medium">
                            {quantityInCart > 0
                                ? `Disponible (${quantityInCart} en carrito)`
                                : 'Disponible'}
                        </span>
                    )}
                </span>
            </div>
        </div>
    );
}