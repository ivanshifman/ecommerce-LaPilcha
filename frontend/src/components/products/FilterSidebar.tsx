'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { useProductActions, useProducts } from '../../store/productStore';
import type { ProductFilters } from '../../types/product.types';
import { ColorEnum, GenderEnum } from '../../types/product.types';
import { colorMap, colorLabels } from '../../utils/colorMap';
import { genderLabels } from '../../utils/genderLabels';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    filters: ProductFilters;
    onFilterChange: (key: keyof ProductFilters, value: string | number | undefined) => void;
}

export function FilterSidebar({ isOpen, onClose, filters, onFilterChange }: Props) {
    const { fetchCategories, fetchSubcategories, fetchSizes } = useProductActions();
    const { sizes, categories } = useProducts();
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [brands] = useState<string[]>(['Nike', 'Adidas', 'Puma', 'Reebok']);

    const [expandedSections, setExpandedSections] = useState({
        category: true,
        subcategory: true,
        gender: true,
        color: true,
        price: true,
        size: true,
        brand: true,
    });

    useEffect(() => {
        fetchCategories().catch(console.error);
        fetchSizes().catch(console.error);
    }, [fetchCategories, fetchSizes]);

    useEffect(() => {
        if (filters.category) {
            fetchSubcategories(filters.category)
                .then(setSubcategories)
                .catch(console.error);
        } else {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setSubcategories([]);
        }
    }, [filters.category, fetchSubcategories]);

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleClearFilters = () => {
        onFilterChange('category', undefined);
        onFilterChange('subcategory', undefined);
        onFilterChange('gender', undefined);
        onFilterChange('color', undefined);
        onFilterChange('size', undefined);
        onFilterChange('brand', undefined);
        onFilterChange('priceMin', undefined);
        onFilterChange('priceMax', undefined);
    };

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={onClose}
            />

            <aside
                className={`fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 transform transition-transform duration-400 overflow-y-auto ${isOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="sticky top-0 bg-white border-b border-border px-6 py-4 flex items-center justify-between z-10">
                    <h2 className="text-lg font-bold text-text-primary">Filtros</h2>
                    <button
                        title='Cerrar filtros'
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Category */}
                    <div className="border-b border-border pb-4">
                        <button
                            onClick={() => toggleSection('category')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="font-semibold text-text-primary">Categoría</h3>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.category ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {expandedSections.category && (
                            <div className="space-y-2">
                                {categories.map((cat) => (
                                    <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={filters.category === cat}
                                            onChange={(e) =>
                                                onFilterChange('category', e.target.checked ? cat : undefined)
                                            }
                                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                                        />
                                        <span className="text-sm text-text-secondary">{cat}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Subcategory */}
                    {subcategories.length > 0 && (
                        <div className="border-b border-border pb-4">
                            <button
                                onClick={() => toggleSection('subcategory')}
                                className="w-full flex items-center justify-between mb-3"
                            >
                                <h3 className="font-semibold text-text-primary">Subcategoría</h3>
                                <ChevronDown
                                    className={`w-4 h-4 transition-transform ${expandedSections.subcategory ? 'rotate-180' : ''
                                        }`}
                                />
                            </button>
                            {expandedSections.subcategory && (
                                <div className="space-y-2">
                                    {subcategories.map((subcat) => (
                                        <label key={subcat} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="subcategory"
                                                checked={filters.subcategory === subcat}
                                                onChange={(e) =>
                                                    onFilterChange('subcategory', e.target.checked ? subcat : undefined)
                                                }
                                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                                            />
                                            <span className="text-sm text-text-secondary">{subcat}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Gender */}
                    <div className="border-b border-border pb-4">
                        <button
                            onClick={() => toggleSection('gender')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="font-semibold text-text-primary">Género</h3>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.gender ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {expandedSections.gender && (
                            <div className="space-y-2">
                                {Object.values(GenderEnum).map((gender) => (
                                    <label key={gender} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="gender"
                                            checked={filters.gender === gender}
                                            onChange={(e) =>
                                                onFilterChange('gender', e.target.checked ? gender : undefined)
                                            }
                                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                                        />
                                        <span className="text-sm text-text-secondary">
                                            {genderLabels[gender]}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Color */}
                    <div className="border-b border-border pb-4">
                        <button
                            onClick={() => toggleSection('color')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="font-semibold text-text-primary">Color</h3>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.color ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {expandedSections.color && (
                            <div className="grid grid-cols-4 gap-3">
                                {Object.values(ColorEnum).map((color) => (
                                    <button
                                        key={color}
                                        onClick={() =>
                                            onFilterChange('color', filters.color === color ? undefined : color)
                                        }
                                        className={`relative w-10 h-10 rounded-full border-2 transition-all ${filters.color === color
                                            ? 'border-primary scale-110'
                                            : 'border-border hover:scale-105'
                                            }`}
                                        style={{ backgroundColor: colorMap[color] }}
                                        title={colorLabels[color]}
                                    >
                                        {filters.color === color && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full shadow-md" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Size - AHORA DINÁMICO */}
                    <div className="border-b border-border pb-4">
                        <button
                            onClick={() => toggleSection('size')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="font-semibold text-text-primary">Talle</h3>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.size ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {expandedSections.size && (
                            <div className="grid grid-cols-3 gap-2">
                                {sizes.length > 0 ? (
                                    sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() =>
                                                onFilterChange('size', filters.size === size ? undefined : size)
                                            }
                                            className={`py-2 text-sm font-medium rounded-md transition-colors ${filters.size === size
                                                ? 'bg-primary text-white'
                                                : 'bg-accent text-text-primary hover:bg-accent-dark'
                                                }`}
                                        >
                                            {size}
                                        </button>
                                    ))
                                ) : (
                                    <p className="col-span-3 text-sm text-text-muted text-center">
                                        No hay talles disponibles
                                    </p>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Brand */}
                    <div className="border-b border-border pb-4">
                        <button
                            onClick={() => toggleSection('brand')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="font-semibold text-text-primary">Marca</h3>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.brand ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {expandedSections.brand && (
                            <div className="space-y-2">
                                {brands.map((brand) => (
                                    <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="radio"
                                            name="brand"
                                            checked={filters.brand === brand}
                                            onChange={(e) =>
                                                onFilterChange('brand', e.target.checked ? brand : undefined)
                                            }
                                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20"
                                        />
                                        <span className="text-sm text-text-secondary">{brand}</span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Price Range */}
                    <div className="pb-4">
                        <button
                            onClick={() => toggleSection('price')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <h3 className="font-semibold text-text-primary">Precio</h3>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.price ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {expandedSections.price && (
                            <div className="space-y-3">
                                <div>
                                    <label className="text-xs text-text-muted mb-1 block">Mínimo</label>
                                    <input
                                        type="number"
                                        value={filters.priceMin || ''}
                                        onChange={(e) => onFilterChange('priceMin', Number(e.target.value) || undefined)}
                                        placeholder="$0"
                                        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted mb-1 block">Máximo</label>
                                    <input
                                        type="number"
                                        value={filters.priceMax || ''}
                                        onChange={(e) => onFilterChange('priceMax', Number(e.target.value) || undefined)}
                                        placeholder="$1000"
                                        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={handleClearFilters}
                        className="w-full py-2 border border-border text-text-primary rounded-lg hover:bg-accent transition-colors text-sm font-medium"
                    >
                        Limpiar filtros
                    </button>
                </div>
            </aside>
        </>
    );
}