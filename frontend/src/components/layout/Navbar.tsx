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
import { useWishlist } from '../../store/wishlistStore';
import { useProductActions, useProducts } from '../../store/productStore';
import { genderLabels } from '../../utils/genderLabels';

export function Navbar() {
  const { count: wishlistCount } = useWishlist();
  const { genders } = useProducts();
  const { fetchGenders } = useProductActions();

  const headerRef = useRef<HTMLElement>(null);
  const [openGender, setOpenGender] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchGenders().catch(console.error);
  }, [fetchGenders]);

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
                setOpenGender={setOpenGender}
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
              <SearchBar />
            </div>

            <div className="md:hidden">
              <SearchBar onOpen={() => setMobileOpen(false)} />
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

            <UserMenu onOpen={() => setMobileOpen(false)} />
            <CartIcon />

            {/* HAMBURGER */}
            <button
              onClick={() => setMobileOpen(true)}
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
