'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { TopBar } from './TopBar';
import { CategoryDropdown } from './CategoryDropdown';
import { SearchBar } from './SearchBar';
import { UserMenu } from './UserMenu';
import { CartIcon } from './CartIcon';
import { useAuth } from '../../store/authStore';
import { useWishlist } from '../../store/wishlistStore';
import { useProductActions, useProducts } from '../../store/productStore';
import { HamburgerButton } from './HamburgerButton';
import { MobileMenu } from './MobileMenu';
import { genderLabels } from '../../utils/genderLabels';

export function Navbar() {
  const { isAuthenticated } = useAuth();
  const { count: wishlistCount } = useWishlist();
  const { genders } = useProducts();
  const { fetchGenders } = useProductActions();

  const [openGender, setOpenGender] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    fetchGenders().catch(console.error);
  }, [fetchGenders]);

  return (
    <header className="sticky top-0 z-50 bg-background shadow-md">
      <TopBar />

      <nav className="max-w-7xl mx-auto px-4 py-4 relative">
        <div className="flex items-center justify-between">

          {/* LEFT - DESKTOP */}
          <div className="hidden md:flex items-center gap-2">
            {genders.map((gender) => (
              <CategoryDropdown
                key={gender}
                gender={gender}
                label={genderLabels[gender] || gender}
                openGender={openGender}
                setOpenGender={setOpenGender}
              />
            ))}
          </div>

          {/* LOGO */}
          <Link href="/" className="md:absolute md:left-1/2 md:-translate-x-1/2">
            <Image src="/LOGO_LA_PILCHA.png" alt="Logo" width={100} height={100} />
          </Link>

          {/* RIGHT */}
          <div className="flex items-center gap-2">

            <div className="hidden md:block">
              <SearchBar />
            </div>

            <div className="md:hidden">
              <SearchBar onOpen={() => setMobileOpen(false)}/>
            </div>

            {/* WISHLIST */}
            {isAuthenticated && (
              <Link
                href="/wishlist"
                className="relative p-2 hover:bg-accent rounded-full"
              >
                <Heart className="w-5 h-5 text-text-primary" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {wishlistCount > 9 ? '9+' : wishlistCount}
                  </span>
                )}
              </Link>
            )}

            <UserMenu />
            <CartIcon />

            {/* HAMBURGER – SIEMPRE A LA DERECHA */}
            <HamburgerButton
              open={mobileOpen}
              onToggle={() => setMobileOpen(!mobileOpen)}
            />
          </div>

        </div>
      </nav>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} />
    </header>
  );
}

