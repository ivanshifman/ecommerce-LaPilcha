'use client';

import { MobileCategories } from './MobileCategories';

interface Props {
    open: boolean;
    onClose: () => void;
}

export function MobileMenu({ open }: Props) {
    return (
        <div
            className={`
        fixed left-0 right-0 top-32 bottom-0
        bg-white z-40
        transform transition-transform duration-300
        ${open ? 'translate-x-0' : '-translate-x-full'}
        md:hidden
      `}
        >
            <div className="p-6 overflow-y-auto h-full overscroll-contain">
                {open && <MobileCategories key="mobile-categories" />}
            </div>
        </div>
    );
}
