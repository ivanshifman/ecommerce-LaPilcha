'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Search, X } from 'lucide-react';
import { useProductActions } from '../../store/productStore';
import type { Product } from '../../types/product.types';

interface Props {
  onOpen?: () => void;
}


export function SearchBar({ onOpen }: Props) {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Product[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const { searchProducts } = useProductActions();
    const router = useRouter();
    const searchRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            return;
        }

        const timeoutId = setTimeout(async () => {
            setIsLoading(true);
            try {
                const products = await searchProducts(query);
                setResults(products);
            } catch (error) {
                console.error('Search failed:', error);
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [query, searchProducts]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            router.push(`/products?search=${encodeURIComponent(query)}`);
            setIsOpen(false);
            setQuery('');
        }
    };

    const handleClear = () => {
        setQuery('');
        setResults([]);
        inputRef.current?.focus();
    };

    return (
        <div ref={searchRef} className="relative">
            {!isOpen && (
                <button
                    onClick={() => {
                        onOpen?.();
                        setIsOpen(true);
                        setTimeout(() => inputRef.current?.focus(), 100);
                    }}
                    className="p-2 hover:bg-accent rounded-full transition-colors"
                    aria-label="Buscar"
                >
                    <Search className="w-5 h-5 text-text-muted" />
                </button>
            )}

            {isOpen && (
                <div className="absolute z-50 top-full mt-4 w-[85vw] max-w-[300px] left-1/2 -translate-x-[60%] sm:left-auto sm:right-0 sm:translate-x-0 bg-white shadow-lg rounded-lg border border-border overflow-hidden"
                >
                    <form onSubmit={handleSearch} className="p-3">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                            <input
                                ref={inputRef}
                                type="text"
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                placeholder="Buscar productos..."
                                className="w-full pl-9 pr-9 py-1.5 text-sm border border-border rounded-md  focus:outline-none focus:ring-2 focus:ring-primary/20"
                            />
                            {query && (
                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                                    aria-label="Limpiar búsqueda"
                                >
                                    <X className="w-4 h-4 text-text-muted" />
                                </button>
                            )}
                        </div>
                    </form>

                    {query && (
                        <div className="max-h-56 overflow-y-auto border-t border-border">
                            {isLoading ? (
                                <div className="p-4 text-center text-text-muted">Buscando...</div>
                            ) : results.length > 0 ? (
                                <div className="p-2">
                                    {results.map((product) => (
                                        <Link
                                            key={product.id}
                                            href={`/products/${product.slug}`}
                                            onClick={() => {
                                                setIsOpen(false);
                                                setQuery('');
                                            }}
                                            className="flex items-center gap-2 p-2 hover:bg-accent rounded-md transition-colors"
                                        >
                                            <Image
                                                src={product.images?.[0] || '/placeholder.png'}
                                                alt={product.name}
                                                width={40}
                                                height={40}
                                                className="w-10 h-10 rounded object-cover"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-sm text-text-primary truncate">
                                                    {product.name}
                                                </p>
                                                <p className="text-xs text-text-muted">
                                                    ${product.price.toFixed(2)}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            ) : (
                                <div className="p-4 text-center text-text-muted">
                                    No se encontraron productos
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
