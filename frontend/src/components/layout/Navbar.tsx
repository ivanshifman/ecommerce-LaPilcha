'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Heart, Menu } from 'lucide-react';
import { TopBar } from './TopBar';
import { CategoryDropdown } from './CategoryDropdown';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { CartIcon } from './CartIcon';
import { MobileMenu } from './MobileMenu';
import { useWishlist, useWishlistActions } from '../../store/wishlistStore';
import { useProductActions, useProducts } from '../../store/productStore';
import { genderLabels } from '../../utils/genderLabels';

export function Navbar() {
  const { count: wishlistCount } = useWishlist();
  const { genders } = useProducts();
  const { fetchWishlist } = useWishlistActions();
  const { fetchGenders } = useProductActions();

  const headerRef = useRef<HTMLElement>(null);
  const [openGender, setOpenGender] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    fetchWishlist().catch(console.error);
  }, [fetchWishlist]);

  useEffect(() => {
    fetchGenders().catch(console.error);
  }, [fetchGenders]);

  const handleSearchOpen = () => {
    setUserMenuOpen(false);
    setOpenGender(null);
    window.dispatchEvent(new Event('navbar-menu-open'));
  };

  const handleUserMenuOpen = () => {
    setUserMenuOpen(true);
    setOpenGender(null);
    window.dispatchEvent(new Event('navbar-menu-open'));
  };

  const handleMobileMenuOpen = () => {
    setMobileOpen(true);
    setUserMenuOpen(false);
    setOpenGender(null);
    window.dispatchEvent(new Event('navbar-menu-open'));
  };

  const handleCategoryOpen = (gender: string | null) => {
    setOpenGender(gender);
    setUserMenuOpen(false);
    if (gender) {
      window.dispatchEvent(new Event('navbar-menu-open'));
    }
  };

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-background shadow-[0_2px_8px_-4px_rgba(0,0,0,0.12)]"
    >
      <TopBar />

      <nav className="max-w-7xl mx-auto px-3 py-1.5 md:px-4 md:py-2">
        <div className="flex items-center justify-between">
          {/* LEFT – DESKTOP */}
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

          {/* LOGO */}
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

          {/* RIGHT */}
          <div className="flex items-center gap-1.5 md:gap-2">
            <div className="hidden md:block">
              <SearchBar onOpen={handleSearchOpen} />
            </div>

            <div className="md:hidden">
              <SearchBar onOpen={handleSearchOpen} />
            </div>

            <Link
              href="/wishlist"
              className="relative p-1.5 md:p-2 hover:bg-accent rounded-full"
            >
              <Heart className="w-5 h-5 text-text-primary" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount > 9 ? '9+' : wishlistCount}
                </span>
              )}
            </Link>

            <UserMenu
              onOpen={handleUserMenuOpen}
              isOpen={userMenuOpen}
              onClose={() => setUserMenuOpen(false)}
            />
            <CartIcon />

            {/* HAMBURGER */}
            <button
              onClick={handleMobileMenuOpen}
              className="md:hidden p-2 hover:bg-accent rounded-full"
              aria-label="Abrir menú"
            >
              <Menu className="w-6 h-6 text-text-primary" />
            </button>
          </div>
        </div>
      </nav>

      {/* MOBILE MENU */}
      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}