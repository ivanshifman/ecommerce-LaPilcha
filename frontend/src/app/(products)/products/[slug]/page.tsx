'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Heart, ShoppingCart, Share2, Ruler, Package, Truck, Shield } from 'lucide-react';
import { useProductActions, useProducts } from '../../../../store/productStore';
import { useWishlistActions, useWishlist } from '../../../../store/wishlistStore';
import { useCartActions, useCart } from '../../../../store/cartStore';
import { useAuth } from '../../../../store/authStore';
import { ProductImageGallery } from '../../../../components/product/ProductImageGallery';
import { ProductInfo } from '../../../../components/product/ProductInfo';
import { SizeSelector } from '../../../../components/product/SizeSelector';
import { QuantitySelector } from '../../../../components/product/QuantitySelector';
import { ProductTabs } from '../../../../components/product/ProductTabs';
import { RelatedProducts } from '../../../../components/product/RelatedProducts';
import { SizeGuideModal } from '../../../../components/product/SizeGuideModal';
import { ColorVariantSelector } from '../../../../components/product/ColorVariantSelector';
import { showSuccess, showError } from '../../../../lib/notifications';
import { colorLabels } from '../../../../utils/colorMap';
import { genderLabels } from '../../../../utils/genderLabels';
import { handleApiError } from '../../../../api/error-handler';
import { UserRole } from '../../../../types/auth.types';

export default function ProductDetailPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const { currentProduct, isLoading } = useProducts();
    const { fetchProductBySlug, clearCurrentProduct } = useProductActions();
    const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistActions();
    const { hydrated } = useWishlist();
    const { addToCart, fetchCart } = useCartActions();
    const { user } = useAuth();
    const { cart } = useCart();

    const [selectedSize, setSelectedSize] = useState<string | null>(null);
    const [quantity, setQuantity] = useState(1);
    const [isAddingToCart, setIsAddingToCart] = useState(false);
    const [isTogglingWishlist, setIsTogglingWishlist] = useState(false);
    const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

    const isAdmin = user?.role === UserRole.ADMIN;
    const inWishlist = hydrated && currentProduct ? isInWishlist(currentProduct.id) : false;
    const hasSizes = currentProduct?.sizes && currentProduct.sizes.length > 0;

    useEffect(() => {
        if (user && !isAdmin) {
            fetchCart().catch(console.error);
        }
    }, [user, isAdmin]);

    useEffect(() => {
        if (slug) {
            fetchProductBySlug(slug).catch((err) => {
                console.error('Error fetching product:', err);
                router.push('/products');
            });
        }

        return () => {
            clearCurrentProduct();
        };
    }, [slug, fetchProductBySlug, clearCurrentProduct, router]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary" />
            </div>
        );
    }

    if (!currentProduct) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-text-primary mb-4">Producto no encontrado</h1>
                <button
                    onClick={() => router.push('/products')}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                    Volver a productos
                </button>
            </div>
        );
    }

    const hasDiscount = typeof currentProduct.discount === 'number' && currentProduct.discount > 0;
    const finalPrice = hasDiscount
        ? currentProduct.price * (1 - currentProduct.discount! / 100)
        : currentProduct.price;

    const selectedSizeData = currentProduct.sizes?.find(s => s.size === selectedSize);

    const availableStock = selectedSizeData
        ? Math.max(0, selectedSizeData.stock - selectedSizeData.reserved)
        : 0;

    const cartItem = cart?.items?.find(
        item => item.product.id === currentProduct.id && item.variant?.size === selectedSize
    );
    const quantityInCart = cartItem?.quantity || 0;
    const maxQuantityToAdd = Math.max(0, availableStock - quantityInCart);
    const maxQuantity = maxQuantityToAdd;

    const handleAddToCart = async () => {
        if (isAdmin) return;

        if (hasSizes && !selectedSize) {
            showError('Por favor, selecciona un talle');
            return;
        }

        if (hasSizes && maxQuantity === 0) {
            showError('No hay stock disponible para agregar');
            return;
        }

        if (hasSizes && quantity > maxQuantity) {
            showError(`Solo puedes agregar ${maxQuantity} unidades más`);
            return;
        }

        setIsAddingToCart(true);
        try {
            await addToCart({
                product: currentProduct.id,
                variant: hasSizes ? { size: selectedSize!, color: currentProduct.color } : { color: currentProduct.color },
                quantity,
            });
            showSuccess(`${quantity} ${quantity === 1 ? 'producto agregado' : 'productos agregados'} al carrito`);
            setSelectedSize(null);
            setQuantity(1);
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al agregar al carrito');
        } finally {
            setIsAddingToCart(false);
        }
    };

    const handleToggleWishlist = async () => {
        if (isAdmin) return;

        setIsTogglingWishlist(true);
        try {
            if (inWishlist) {
                await removeFromWishlist(currentProduct.id);
                showSuccess('Eliminado de favoritos');
            } else {
                await addToWishlist(currentProduct.id);
                showSuccess('Agregado a favoritos');
            }
        } catch (err) {
            const apiError = handleApiError(err);
            showError(apiError.message || 'Error al actualizar favoritos');
        } finally {
            setIsTogglingWishlist(false);
        }
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: currentProduct.name,
                    text: currentProduct.description,
                    url: window.location.href,
                });
            } catch (err) {
                console.log('Error sharing:', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            showSuccess('Link copiado al portapapeles');
        }
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex items-center gap-2 text-sm text-text-muted mb-6">
                    <button onClick={() => router.push('/')} className="hover:text-primary transition-colors cursor-pointer">
                        Inicio
                    </button>
                    <span>/</span>
                    <button onClick={() => router.push('/products')} className="hover:text-primary transition-colors cursor-pointer">
                        Productos
                    </button>
                    {currentProduct.gender && (
                        <>
                            <span>/</span>
                            <span className="text-text-primary font-medium">
                                {genderLabels[currentProduct.gender]}
                            </span>
                        </>
                    )}
                    {currentProduct.category && (
                        <>
                            <span>/</span>
                            <span className="text-text-primary font-medium">{currentProduct.category}</span>
                        </>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                    <ProductImageGallery images={currentProduct.images || []} productName={currentProduct.name} />

                    <div className="flex flex-col">
                        <div className="mb-6">
                            <div className="flex items-start justify-between mb-2">
                                <div className="flex-1">
                                    {currentProduct.brand && (
                                        <p className="text-sm text-text-muted uppercase tracking-wide mb-1">
                                            {currentProduct.brand}
                                        </p>
                                    )}
                                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                                        {currentProduct.name}
                                    </h1>
                                </div>
                                {!isAdmin && (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleToggleWishlist}
                                            disabled={isTogglingWishlist}
                                            className="p-2 border border-border rounded-lg hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
                                            title={inWishlist ? 'Eliminar de favoritos' : 'Agregar a favoritos'}
                                        >
                                            <Heart
                                                className={`w-5 h-5 transition-colors ${inWishlist ? 'fill-primary text-primary' : 'text-text-muted'
                                                    }`}
                                            />
                                        </button>
                                        <button
                                            onClick={handleShare}
                                            className="p-2 border border-border rounded-lg hover:bg-accent transition-colors cursor-pointer"
                                            title="Compartir"
                                        >
                                            <Share2 className="w-5 h-5 text-text-muted" />
                                        </button>
                                    </div>
                                )}
                            </div>

                            <div className="flex items-baseline gap-3 mb-4">
                                <span className="text-3xl font-bold text-primary">
                                    ${finalPrice.toFixed(2)}
                                </span>
                                {hasDiscount && (
                                    <>
                                        <span className="text-xl text-text-muted line-through">
                                            ${currentProduct.price.toFixed(2)}
                                        </span>
                                        <span className="px-2 py-1 bg-destructive text-white text-sm font-medium rounded">
                                            -{currentProduct.discount}%
                                        </span>
                                    </>
                                )}
                            </div>

                            <ProductInfo
                                color={colorLabels[currentProduct.color]}
                                category={currentProduct.category}
                                subcategory={currentProduct.subcategory}
                                material={currentProduct.material}
                                code={currentProduct.code}
                            />
                        </div>

                        {!isAdmin && (
                            <div className="mb-6">
                                <ColorVariantSelector
                                    currentProductId={currentProduct.id}
                                    currentColor={currentProduct.color}
                                    currentGender={currentProduct.gender}
                                    productName={currentProduct.name}
                                />
                            </div>
                        )}

                        {!isAdmin && hasSizes && (
                            <div className="mb-6">
                                <SizeSelector
                                    sizes={currentProduct.sizes!}
                                    selectedSize={selectedSize}
                                    onSizeSelect={(size) => {
                                        setSelectedSize(size);
                                        setQuantity(1);
                                    }}
                                />
                            </div>
                        )}

                        {!isAdmin && hasSizes && selectedSize && (
                            <div className="mb-6">
                                <QuantitySelector
                                    quantity={quantity}
                                    maxQuantity={maxQuantity}
                                    onQuantityChange={setQuantity}
                                />
                            </div>
                        )}

                        {!isAdmin && (
                            <button
                                onClick={handleAddToCart}
                                disabled={isAddingToCart || (hasSizes && (!selectedSize || maxQuantity === 0))}
                                className="w-full bg-primary text-white py-4 rounded-lg font-semibold text-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mb-4 cursor-pointer"
                            >
                                <ShoppingCart className="w-5 h-5" />
                                {isAddingToCart ? 'Agregando...' : 'Agregar al carrito'}
                            </button>
                        )}

                        <div className="grid grid-cols-2 gap-4 p-4 bg-accent rounded-lg">
                            <div className="flex items-center gap-3">
                                <Truck className="w-5 h-5 text-primary shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-text-primary">Envío gratis</p>
                                    <p className="text-xs text-text-muted">En compras +$50.000</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Package className="w-5 h-5 text-primary shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-text-primary">Devolución</p>
                                    <p className="text-xs text-text-muted">30 días gratis</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <Shield className="w-5 h-5 text-primary shrink-0" />
                                <div>
                                    <p className="text-sm font-medium text-text-primary">Garantía</p>
                                    <p className="text-xs text-text-muted">12 meses</p>
                                </div>
                            </div>
                            {hasSizes && (
                                <div className="flex items-center gap-3">
                                    <Ruler className="w-5 h-5 text-primary shrink-0" />
                                    <div>
                                        <button
                                            onClick={() => setIsSizeGuideOpen(true)}
                                            className="text-sm font-medium text-text-primary hover:text-primary transition-colors text-left cursor-pointer hover:underline"
                                        >
                                            Guía de talles
                                        </button>
                                        <p className="text-xs text-text-muted">Ver tabla</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <ProductTabs
                    description={currentProduct.description}
                    material={currentProduct.material}
                    category={currentProduct.category}
                />

                <RelatedProducts
                    currentProductId={currentProduct.id}
                    category={currentProduct.category}
                    gender={currentProduct.gender}
                />
            </div>

            {hasSizes && (
                <SizeGuideModal
                    isOpen={isSizeGuideOpen}
                    onClose={() => setIsSizeGuideOpen(false)}
                    category={currentProduct.category}
                    subcategory={currentProduct.subcategory}
                />
            )}
        </div>
    );
}