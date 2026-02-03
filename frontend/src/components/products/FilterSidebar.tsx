'use client';

import { useState, useEffect } from 'react';
import { X, ChevronDown, Percent } from 'lucide-react';
import { useProductActions, useProducts } from '../../store/productStore';
import type { ProductFilters } from '../../types/product.types';
import { ColorEnum, GenderEnum } from '../../types/product.types';
import { colorMap, colorLabels } from '../../utils/colorMap';
import { genderLabels } from '../../utils/genderLabels';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    filters: ProductFilters;
    onApplyFilters: (filters: ProductFilters) => void
    onClearAll: () => void;
}

const DEFAULT_FILTERS: ProductFilters = {
    gender: GenderEnum.MALE,
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    order: 'desc',
};

export function FilterSidebar({ isOpen, onClose, filters, onApplyFilters, onClearAll }: Props) {
    const {
        fetchFilteredCategories,
        fetchFilteredSubcategories,
        fetchFilteredSizes,
        fetchFilteredBrands,
    } = useProductActions();
    const { sizes, categories, brands } = useProducts();
    const [subcategories, setSubcategories] = useState<string[]>([]);
    const [tempFilters, setTempFilters] = useState<ProductFilters>({
        ...DEFAULT_FILTERS,
        ...filters,
        gender: filters.gender ?? GenderEnum.MALE,
    });

    const [expandedSections, setExpandedSections] = useState({
        category: true,
        subcategory: true,
        gender: true,
        color: true,
        price: true,
        size: true,
        brand: true,
        discount: true,
    });

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setTempFilters({
            ...DEFAULT_FILTERS,
            ...filters,
            gender: filters.gender ?? GenderEnum.MALE,
        });
    }, [filters]);


    useEffect(() => {
        const updateFilters = async () => {
            try {
                const baseFilters = { ...tempFilters };

                await fetchFilteredCategories(baseFilters);

                if (tempFilters.category) {
                    const subs = await fetchFilteredSubcategories(baseFilters);
                    setSubcategories(subs);
                } else {
                    setSubcategories([]);
                }

                await fetchFilteredSizes(baseFilters);
                await fetchFilteredBrands(baseFilters);

            } catch (error) {
                console.error('Error al actualizar filtros:', error);
            }
        };

        if (isOpen) {
            updateFilters();
        }
    }, [
        tempFilters,
        isOpen,
        fetchFilteredCategories,
        fetchFilteredSubcategories,
        fetchFilteredSizes,
        fetchFilteredBrands,
    ]);

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
    };

    const handleTempFilterChange = (
        key: keyof ProductFilters,
        value: string | number | undefined | boolean
    ) => {
        setTempFilters((prev) => {
            const next = {
                ...prev,
                [key]: value,
            };

            if (key === 'gender') {
                next.category = undefined;
                next.subcategory = undefined;
                next.size = undefined;
                next.brand = undefined;
                next.color = undefined;
                next.priceMin = undefined;
                next.priceMax = undefined;
                next.onDiscount = undefined;
            }

            if (key === 'category') {
                next.subcategory = undefined;
                next.size = undefined;
                next.brand = undefined;
                next.onDiscount = undefined;
            }

            if (key === 'subcategory') {
                next.size = undefined;
            }

            return next;
        });
    };

    const handleRadioChange = (key: keyof ProductFilters, value: string) => {
        if (tempFilters[key] === value) {
            handleTempFilterChange(key, undefined);
        } else {
            handleTempFilterChange(key, value);
        }
    };

    const handleApplyFilters = () => {
        onApplyFilters({
            ...tempFilters,
            page: 1,
        });

        onClose();
    };


    const handleClearFilters = () => {
        const resetFilters: ProductFilters = {
            ...DEFAULT_FILTERS,
        };

        setTempFilters(resetFilters);
        onClearAll();
        onClose();
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

                <div className="p-6 space-y-6 pb-32">
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
                                            checked={tempFilters.gender === gender}
                                            onChange={() => handleRadioChange('gender', gender)}
                                            className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                                        />
                                        <span className="text-sm text-text-secondary">
                                            {genderLabels[gender]}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        )}
                    </div>

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
                                {categories.length > 0 ? (
                                    categories.map((cat) => (
                                        <label key={cat} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="category"
                                                checked={tempFilters.category === cat}
                                                onChange={() => handleRadioChange('category', cat)}
                                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                                            />
                                            <span className="text-sm text-text-secondary">{cat}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-sm text-text-muted text-center">
                                        No hay categorías disponibles
                                    </p>
                                )}
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
                                                checked={tempFilters.subcategory === subcat}
                                                onChange={() => handleRadioChange('subcategory', subcat)}
                                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                                            />
                                            <span className="text-sm text-text-secondary">{subcat}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <div className="border-b border-border pb-4">
                        <button
                            onClick={() => toggleSection('discount')}
                            className="w-full flex items-center justify-between mb-3"
                        >
                            <div className="flex items-center gap-2">
                                <Percent className="w-4 h-4 text-primary" />
                                <h3 className="font-semibold text-text-primary">Ofertas</h3>
                            </div>
                            <ChevronDown
                                className={`w-4 h-4 transition-transform ${expandedSections.discount ? 'rotate-180' : ''
                                    }`}
                            />
                        </button>
                        {expandedSections.discount && (
                            <label className="flex items-center gap-3 cursor-pointer p-3 bg-destructive/5 rounded-lg border border-destructive/20 hover:bg-destructive/10 transition-colors">
                                <input
                                    type="checkbox"
                                    checked={tempFilters.onDiscount || false}
                                    onChange={(e) => handleTempFilterChange('onDiscount', e.target.checked || undefined)}
                                    className="w-4 h-4 rounded border-border text-destructive focus:ring-destructive/20 cursor-pointer"
                                />
                                <div className="flex-1">
                                    <span className="text-sm font-semibold text-text-primary block">
                                        Solo productos en oferta
                                    </span>
                                    <span className="text-xs text-text-muted">
                                        Ver productos con descuento
                                    </span>
                                </div>
                            </label>
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
                                            handleTempFilterChange('color', tempFilters.color === color ? undefined : color)
                                        }
                                        className={`relative w-10 h-10 rounded-full border-2 transition-all cursor-pointer ${tempFilters.color === color
                                            ? 'border-primary scale-110'
                                            : 'border-border hover:scale-105'
                                            }`}
                                        style={{ backgroundColor: colorMap[color] }}
                                        title={colorLabels[color]}
                                    >
                                        {tempFilters.color === color && (
                                            <div className="absolute inset-0 flex items-center justify-center">
                                                <div className="w-2 h-2 bg-white rounded-full shadow-md" />
                                            </div>
                                        )}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Size */}
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
                                                handleTempFilterChange('size', tempFilters.size === size ? undefined : size)
                                            }
                                            className={`py-2 text-sm font-medium rounded-md transition-colors cursor-pointer ${tempFilters.size === size
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
                            <div className="space-y-2 max-h-60 overflow-y-auto">
                                {brands.length > 0 ? (
                                    brands.map((brand) => (
                                        <label key={brand} className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="brand"
                                                checked={tempFilters.brand === brand}
                                                onChange={() => handleRadioChange('brand', brand)}
                                                className="w-4 h-4 rounded border-border text-primary focus:ring-primary/20 cursor-pointer"
                                            />
                                            <span className="text-sm text-text-secondary">{brand}</span>
                                        </label>
                                    ))
                                ) : (
                                    <p className="text-sm text-text-muted text-center">
                                        No hay marcas disponibles
                                    </p>
                                )}
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
                                        value={tempFilters.priceMin || ''}
                                        onChange={(e) => handleTempFilterChange('priceMin', Number(e.target.value) || undefined)}
                                        placeholder="$0"
                                        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-text-muted mb-1 block">Máximo</label>
                                    <input
                                        type="number"
                                        value={tempFilters.priceMax || ''}
                                        onChange={(e) => handleTempFilterChange('priceMax', Number(e.target.value) || undefined)}
                                        placeholder="$1000"
                                        className="w-full px-3 py-2 border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Botones fijos en el footer */}
                <div className="sticky bottom-0 bg-white border-t border-border px-6 py-4 space-y-2">
                    <button
                        onClick={handleApplyFilters}
                        className="w-full py-2.5 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors text-sm font-semibold"
                    >
                        Aplicar filtros
                    </button>
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