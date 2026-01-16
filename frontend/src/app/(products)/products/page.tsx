'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { useProductActions, useProducts } from '../../../store/productStore';
import { useAuth } from '../../../store/authStore';
import { ProductGrid } from '../../../components/products/ProductGrid';
import { FilterSidebar } from '../../../components/products/FilterSidebar';
import { SortMenu } from '../../../components/products/SortMenu';
import { Pagination } from '../../../components/products/Pagination';
import { genderLabels } from '../../../utils/genderLabels';
import { colorLabels } from '../../../utils/colorMap';
import type { ProductFilters } from '../../../types/product.types';

function getPageTitle(filters: ProductFilters): string {
    if (filters.search) {
        return `Resultados para "${filters.search}"`;
    }

    const parts: string[] = [];

    if (filters.gender && filters.gender in genderLabels) {
        parts.push(genderLabels[filters.gender as keyof typeof genderLabels]);
    }

    if (filters.category) {
        parts.push(filters.category);
    }

    if (filters.subcategory) {
        parts.push(filters.subcategory);
    }

    if (parts.length > 0) {
        return parts.join(' - ');
    }

    return 'Todos los Productos';
}

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const { products, pagination, isLoading } = useProducts();
    const { fetchProducts } = useProductActions();
    const { user } = useAuth();

    const [filterOpen, setFilterOpen] = useState(false);
    const [sortOpen, setSortOpen] = useState(false);

    const [filters, setFilters] = useState<ProductFilters>({
        page: 1,
        limit: 12,
        sortBy: 'createdAt',
        order: 'desc',
    });

    useEffect(() => {
        const handleNavbarMenuOpen = () => {
            setFilterOpen(false);
            setSortOpen(false);
        };

        window.addEventListener('navbar-menu-open', handleNavbarMenuOpen);
        return () => window.removeEventListener('navbar-menu-open', handleNavbarMenuOpen);
    }, []);

    const updateURL = useCallback((newFilters: ProductFilters) => {
        const params = new URLSearchParams();

        Object.entries(newFilters).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                if (key === 'page' && value === 1) return;
                if (key === 'limit' && value === 12) return;
                if (key === 'sortBy' && value === 'createdAt') return;
                if (key === 'order' && value === 'desc') return;

                params.set(key, String(value));
            }
        });

        const queryString = params.toString();
        const newURL = queryString ? `${pathname}?${queryString}` : pathname;

        router.push(newURL, { scroll: false });
    }, [pathname, router]);

    useEffect(() => {
        const search = searchParams.get('search');
        const category = searchParams.get('category');
        const subcategory = searchParams.get('subcategory');
        const gender = searchParams.get('gender');
        const color = searchParams.get('color');
        const size = searchParams.get('size');
        const brand = searchParams.get('brand');
        const priceMin = searchParams.get('priceMin');
        const priceMax = searchParams.get('priceMax');
        const page = searchParams.get('page');
        const sortBy = searchParams.get('sortBy');
        const order = searchParams.get('order');

        const newFilters: ProductFilters = {
            page: page ? parseInt(page) : 1,
            limit: 12,
            sortBy: (sortBy as ProductFilters['sortBy']) || 'createdAt',
            order: (order as 'asc' | 'desc') || 'desc',
            search: search || undefined,
            category: category || undefined,
            subcategory: subcategory || undefined,
            gender: (gender as ProductFilters['gender']) || undefined,
            color: color as ProductFilters['color'] || undefined,
            size: size || undefined,
            brand: brand || undefined,
            priceMin: priceMin ? parseFloat(priceMin) : undefined,
            priceMax: priceMax ? parseFloat(priceMax) : undefined,
        };

        setFilters(newFilters);
        fetchProducts(newFilters).catch(console.error);
    }, [searchParams, fetchProducts]);

    const handleFilterChange = (
        key: keyof ProductFilters,
        value: ProductFilters[keyof ProductFilters]
    ) => {
        const newFilters: ProductFilters = {
            ...filters,
            [key]: value,
            page: 1,
        };

        if (value !== undefined) {
            if (key === 'gender') {
                newFilters.category = undefined;
                newFilters.subcategory = undefined;
                newFilters.size = undefined;
                newFilters.brand = undefined;
                newFilters.color = undefined;
                newFilters.priceMin = undefined;
                newFilters.priceMax = undefined;
            }

            if (key === 'category') {
                newFilters.subcategory = undefined;
                newFilters.size = undefined;
                newFilters.brand = undefined;
            }

            if (key === 'subcategory') {
                newFilters.size = undefined;
            }
        }

        setFilters(newFilters);
        updateURL(newFilters);
        fetchProducts(newFilters).catch(console.error);
    };

    const handleSortChange = (sortBy: string, order: 'asc' | 'desc') => {
        const newFilters = {
            ...filters,
            sortBy: sortBy as ProductFilters['sortBy'],
            order,
        };
        setFilters(newFilters);
        updateURL(newFilters);
        fetchProducts(newFilters).catch(console.error);
    };

    const handlePageChange = (page: number) => {
        const newFilters = { ...filters, page };
        setFilters(newFilters);
        updateURL(newFilters);
        fetchProducts(newFilters).catch(console.error);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleClearAllFilters = () => {
        const cleanFilters: ProductFilters = {
            page: 1,
            limit: 12,
            sortBy: 'createdAt',
            order: 'desc',
        };
        setFilters(cleanFilters);
        updateURL(cleanFilters);
        fetchProducts(cleanFilters).catch(console.error);
    };

    const handleApplyFilters = (newFilters: ProductFilters) => {
        setFilters(newFilters);
        updateURL(newFilters);
        fetchProducts(newFilters).catch(console.error);
    };

    const activeFiltersCount = [
        filters.category,
        filters.subcategory,
        filters.gender,
        filters.color,
        filters.size,
        filters.brand,
        filters.priceMin,
        filters.priceMax,
    ].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-background">
            <FilterSidebar
                isOpen={filterOpen}
                onClose={() => setFilterOpen(false)}
                filters={filters}
                onApplyFilters={handleApplyFilters}
                onClearAll={handleClearAllFilters}
            />

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="mb-8">
                    <div className="flex flex-wrap items-center gap-2 text-sm text-text-muted mb-3">
                        <Link href="/" className="hover:text-primary transition-colors">
                            Inicio
                        </Link>
                        <span>/</span>
                        <span className="text-text-primary font-medium">Productos</span>
                    </div>

                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        {getPageTitle(filters)}
                    </h1>
                    <p className="text-text-muted">
                        {pagination ? `${pagination.totalDocs} productos encontrados` : 'Cargando...'}
                    </p>

                    {activeFiltersCount > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {filters.category && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                    Categoría: {filters.category}
                                    <button
                                        title='Eliminar filtro'
                                        onClick={() => handleFilterChange('category', undefined)}
                                        className="hover:bg-primary/20 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.subcategory && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                    Subcategoría: {filters.subcategory}
                                    <button
                                        title='Eliminar filtro'
                                        onClick={() => handleFilterChange('subcategory', undefined)}
                                        className="hover:bg-primary/20 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.gender && filters.gender in genderLabels && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                    {genderLabels[filters.gender as keyof typeof genderLabels]}
                                    <button
                                        title='Eliminar filtro'
                                        onClick={() => handleFilterChange('gender', undefined)}
                                        className="hover:bg-primary/20 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.color && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                    Color: {colorLabels[filters.color as keyof typeof colorLabels]}
                                    <button
                                        title='Eliminar filtro'
                                        onClick={() => handleFilterChange('color', undefined)}
                                        className="hover:bg-primary/20 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.size && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                    Talle: {filters.size}
                                    <button
                                        title='Eliminar filtro'
                                        onClick={() => handleFilterChange('size', undefined)}
                                        className="hover:bg-primary/20 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {filters.brand && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                    Marca: {filters.brand}
                                    <button
                                        title='Eliminar filtro'
                                        onClick={() => handleFilterChange('brand', undefined)}
                                        className="hover:bg-primary/20 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                            {(filters.priceMin || filters.priceMax) && (
                                <span className="inline-flex items-center gap-1 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm">
                                    Precio: ${filters.priceMin || 0} - ${filters.priceMax || '∞'}
                                    <button
                                        title='Eliminar filtro'
                                        onClick={() => {
                                            handleFilterChange('priceMin', undefined);
                                            handleFilterChange('priceMax', undefined);
                                        }}
                                        className="hover:bg-primary/20 rounded-full p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                </span>
                            )}
                        </div>
                    )}
                </div>

                <div className="flex items-center justify-between mb-6 gap-4">
                    <button
                        onClick={() => setFilterOpen(true)}
                        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-lg hover:bg-accent transition-colors"
                    >
                        <Filter className="w-5 h-5 text-text-primary" />
                        <span className="font-medium text-text-primary">Filtros</span>
                        {activeFiltersCount > 0 && (
                            <span className="ml-1 px-2 py-0.5 bg-primary text-white text-xs rounded-full">
                                {activeFiltersCount}
                            </span>
                        )}
                    </button>

                    <div className="relative">
                        <button
                            onClick={() => setSortOpen(!sortOpen)}
                            className="flex items-center gap-2 px-4 py-2.5 bg-white border border-border rounded-lg hover:bg-accent transition-colors"
                        >
                            <SlidersHorizontal className="w-5 h-5 text-text-primary" />
                            <span className="font-medium text-text-primary">Ordenar</span>
                        </button>
                        <SortMenu
                            isOpen={sortOpen}
                            onClose={() => setSortOpen(false)}
                            sortBy={filters.sortBy || 'createdAt'}
                            order={filters.order || 'desc'}
                            onSortChange={handleSortChange}
                        />
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                    </div>
                ) : products.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-xl text-text-muted mb-4">No se encontraron productos</p>
                        {activeFiltersCount > 0 && (
                            <button
                                onClick={handleClearAllFilters}
                                className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                            >
                                Limpiar todos los filtros
                            </button>
                        )}
                    </div>
                ) : (
                    <>
                        <ProductGrid products={products} user={user} />
                        {pagination && pagination.totalPages > 1 && (
                            <Pagination
                                currentPage={pagination.page}
                                totalPages={pagination.totalPages}
                                hasNextPage={pagination.hasNextPage}
                                hasPrevPage={pagination.hasPrevPage}
                                onPageChange={handlePageChange}
                            />
                        )}
                    </>
                )}
            </div>
        </div>
    );
}