'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Heart, Menu, ShoppingCart } from 'lucide-react';
import { TopBar } from './TopBar';
import { CategoryDropdown } from './CategoryDropdown';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { MobileMenu } from './MobileMenu';
import { WishlistSidebar } from './WishlistSidebar';
import { CartSidebar } from './CartSidebar';
import { useWishlist, useWishlistActions } from '../../store/wishlistStore';
import { useCart, useCartActions } from '../../store/cartStore';
import { useProductActions, useProducts } from '../../store/productStore';
import { genderLabels } from '../../utils/genderLabels';

export function Navbar() {
  const { count: wishlistCount } = useWishlist();
  const { cart } = useCart();
  const { genders } = useProducts();
  const { fetchWishlist } = useWishlistActions();
  const { fetchCart } = useCartActions();
  const { fetchGenders } = useProductActions();

  const headerRef = useRef<HTMLElement>(null);
  const [openGender, setOpenGender] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [wishlistOpen, setWishlistOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);

  const cartItemsCount = cart?.items?.reduce((acc, item) => acc + item.quantity, 0) || 0;

  useEffect(() => {
    fetchWishlist().catch(console.error);
    fetchCart().catch(console.error);
  }, [fetchWishlist, fetchCart]);

  useEffect(() => {
    fetchGenders().catch(console.error);
  }, [fetchGenders]);

  const handleSearchOpen = () => {
    setUserMenuOpen(false);
    setOpenGender(null);
    setWishlistOpen(false);
    setCartOpen(false);
    window.dispatchEvent(new Event('navbar-menu-open'));
  };

  const handleUserMenuOpen = () => {
    setUserMenuOpen(true);
    setOpenGender(null);
    setWishlistOpen(false);
    setCartOpen(false);
    window.dispatchEvent(new Event('navbar-menu-open'));
  };

  const handleMobileMenuOpen = () => {
    setMobileOpen(true);
    setUserMenuOpen(false);
    setOpenGender(null);
    setWishlistOpen(false);
    setCartOpen(false);
    window.dispatchEvent(new Event('navbar-menu-open'));
  };

  const handleCategoryOpen = (gender: string | null) => {
    setOpenGender(gender);
    setUserMenuOpen(false);
    setWishlistOpen(false);
    setCartOpen(false);
    if (gender) {
      window.dispatchEvent(new Event('navbar-menu-open'));
    }
  };

  const handleWishlistOpen = () => {
    setWishlistOpen(true);
    setUserMenuOpen(false);
    setOpenGender(null);
    setCartOpen(false);
    window.dispatchEvent(new Event('navbar-menu-open'));
  };

  const handleCartOpen = () => {
    setCartOpen(true);
    setUserMenuOpen(false);
    setOpenGender(null);
    setWishlistOpen(false);
    window.dispatchEvent(new Event('navbar-menu-open'));
  };

  return (
    <>
      <header
        ref={headerRef}
        className="sticky top-0 z-50 bg-background shadow-[0_2px_8px_-4px_rgba(0,0,0,0.12)]"
      >
        <TopBar />

        <nav className="max-w-7xl mx-auto px-3 py-1.5 md:px-4 md:py-2">
          <div className="flex items-center justify-between">
            <div className="hidden md:flex items-center gap-2">
              {genders.map((gender) => (
                <CategoryDropdown
                  key={gender}
                  gender={gender}
                  label={genderLabels[gender as keyof typeof genderLabels] || gender}
                  openGender={openGender}
                  setOpenGender={handleCategoryOpen}
                />
              ))}
            </div>

            <Link
              href="/"
              className="md:absolute md:left-1/2 md:-translate-x-1/2"
            >
              <Image
                src="/LOGO_LA_PILCHA.png"
                alt="Logo"
                width={90}
                height={90}
                loading='eager'
                className="md:w-[120px]"
              />
            </Link>

            <div className="flex items-center gap-1.5 md:gap-2">
              <div className="hidden md:block">
                <SearchBar onOpen={handleSearchOpen} />
              </div>

              <div className="md:hidden">
                <SearchBar onOpen={handleSearchOpen} />
              </div>

              <button
                onClick={handleWishlistOpen}
                className="relative p-1.5 md:p-2 hover:bg-accent rounded-full transition-colors cursor-pointer"
                aria-label="Favoritos"
              >
                <Heart className="w-5 h-5 text-text-primary" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </button>

              <UserMenu
                onOpen={handleUserMenuOpen}
                isOpen={userMenuOpen}
                onClose={() => setUserMenuOpen(false)}
              />

              <button
                onClick={handleCartOpen}
                className="relative p-2 hover:bg-accent rounded-full transition-colors cursor-pointer"
                aria-label="Carrito de compras"
              >
                <ShoppingCart className="w-5 h-5 text-text-muted" />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    {cartItemsCount > 9 ? '9+' : cartItemsCount}
                  </span>
                )}
              </button>

              <button
                onClick={handleMobileMenuOpen}
                className="md:hidden p-2 hover:bg-accent rounded-full transition-colors cursor-pointer"
                aria-label="Abrir menú"
              >
                <Menu className="w-6 h-6 text-text-primary" />
              </button>
            </div>
          </div>
        </nav>

        <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
      </header>

      <WishlistSidebar isOpen={wishlistOpen} onClose={() => setWishlistOpen(false)} />
      <CartSidebar isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
}