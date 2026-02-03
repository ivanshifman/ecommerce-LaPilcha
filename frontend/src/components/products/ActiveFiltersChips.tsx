'use client';

import { X, Percent } from 'lucide-react';
import { genderLabels } from '../../utils/genderLabels';
import { colorLabels } from '../../utils/colorMap';
import type { ProductFilters } from '../../types/product.types';

interface ActiveFiltersChipsProps {
    filters: ProductFilters;
    onRemoveFilter: (key: keyof ProductFilters, value?: ProductFilters[keyof ProductFilters]) => void;
}

export function ActiveFiltersChips({ filters, onRemoveFilter }: ActiveFiltersChipsProps) {
    const hasActiveFilters = [
        filters.category,
        filters.subcategory,
        filters.gender,
        filters.color,
        filters.size,
        filters.brand,
        filters.priceMin,
        filters.priceMax,
        filters.onDiscount,
    ].filter(Boolean).length > 0;

    if (!hasActiveFilters) {
        return null;
    }

    return (
        <div className="flex flex-wrap gap-2">
            {/* Gender */}
            {filters.gender && filters.gender in genderLabels && (
                <Chip
                    label={genderLabels[filters.gender as keyof typeof genderLabels]}
                    onRemove={() => onRemoveFilter('gender')}
                />
            )}

            {/* Category */}
            {filters.category && (
                <Chip
                    label={`Categoría: ${filters.category}`}
                    onRemove={() => onRemoveFilter('category')}
                />
            )}

            {/* Subcategory */}
            {filters.subcategory && (
                <Chip
                    label={`Subcategoría: ${filters.subcategory}`}
                    onRemove={() => onRemoveFilter('subcategory')}
                />
            )}

            {/* Discount */}
            {filters.onDiscount && (
                <Chip
                    label="Solo en oferta"
                    icon={<Percent className="w-3 h-3" />}
                    variant="destructive"
                    onRemove={() => onRemoveFilter('onDiscount')}
                />
            )}

            {/* Color */}
            {filters.color && (
                <Chip
                    label={`Color: ${colorLabels[filters.color as keyof typeof colorLabels]}`}
                    onRemove={() => onRemoveFilter('color')}
                />
            )}

            {/* Size */}
            {filters.size && (
                <Chip
                    label={`Talle: ${filters.size}`}
                    onRemove={() => onRemoveFilter('size')}
                />
            )}

            {/* Brand */}
            {filters.brand && (
                <Chip
                    label={`Marca: ${filters.brand}`}
                    onRemove={() => onRemoveFilter('brand')}
                />
            )}

            {/* Price Range */}
            {(filters.priceMin || filters.priceMax) && (
                <Chip
                    label={`Precio: $${filters.priceMin || 0} - $${filters.priceMax || '∞'}`}
                    onRemove={() => {
                        onRemoveFilter('priceMin');
                        onRemoveFilter('priceMax');
                    }}
                />
            )}
        </div>
    );
}

interface ChipProps {
    label: string;
    icon?: React.ReactNode;
    variant?: 'default' | 'destructive';
    onRemove: () => void;
}

function Chip({ label, icon, variant = 'default', onRemove }: ChipProps) {
    const variantClasses = {
        default: 'bg-primary/10 text-primary hover:bg-primary/20',
        destructive: 'bg-destructive/10 text-destructive hover:bg-destructive/20',
    };

    return (
        <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm transition-colors ${variantClasses[variant]}`}
        >
            {icon}
            {label}
            <button
                title="Eliminar filtro"
                onClick={onRemove}
                className="rounded-full p-0.5 hover:bg-black/10 transition-colors"
            >
                <X className="w-3 h-3" />
            </button>
        </span>
    );
}