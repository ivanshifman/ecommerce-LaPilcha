'use client';

import { Check } from 'lucide-react';
import type { ProductSize } from '../../types/product.types';

interface Props {
    sizes: ProductSize[];
    selectedSize: string | null;
    onSizeSelect: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSizeSelect }: Props) {
    const availableSizes = sizes.filter(
        s => s.stock - s.reserved > 0
    );

    const outOfStockSizes = sizes.filter(
        s => s.stock - s.reserved <= 0
    );

    const selectedSizeData = sizes.find(s => s.size === selectedSize);
    const isSelectedOutOfStock =
    selectedSizeData
        ? selectedSizeData.stock - selectedSizeData.reserved <= 0
        : false;

    return (
        <div>
            <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-text-primary">
                    Seleccionar talle
                </label>
                {selectedSize && (
                    <span
                        className={`text-sm font-medium ${isSelectedOutOfStock ? 'text-error' : 'text-success'
                            }`}
                    >
                        {isSelectedOutOfStock ? 'Sin stock' : 'Disponible'}
                    </span>
                )}
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                {availableSizes.map((sizeObj) => (
                    <button
                        key={sizeObj.size}
                        onClick={() => onSizeSelect(sizeObj.size)}
                        className={`relative py-3 px-2 text-sm font-medium rounded-lg border-2 transition-all cursor-pointer ${selectedSize === sizeObj.size
                            ? 'border-primary bg-primary text-white'
                            : 'border-border hover:border-primary bg-white text-text-primary'
                            }`}
                    >
                        {sizeObj.size}
                        {selectedSize === sizeObj.size && (
                            <div className="absolute -top-1 -right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                                <Check className="w-3 h-3 text-white" />
                            </div>
                        )}
                    </button>
                ))}

                {outOfStockSizes.map((sizeObj) => (
                    <button
                        key={sizeObj.size}
                        disabled
                        className="relative py-3 px-2 text-sm font-medium rounded-lg border-2 border-border bg-muted text-text-muted cursor-not-allowed"
                    >
                        {sizeObj.size}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="w-full h-0.5 bg-text-muted transform rotate-45" />
                        </div>
                    </button>
                ))}
            </div>

            {!selectedSize && (
                <p className="text-sm text-text-muted mt-2">
                    Por favor, selecciona un talle
                </p>
            )}
        </div>
    );
}