'use client';

interface Props {
    open: boolean;
    onToggle: () => void;
}

export function HamburgerButton({ open, onToggle }: Props) {
    return (
        <button
            onClick={onToggle}
            className="md:hidden flex flex-col justify-between w-7 h-5 z-50"
            aria-label="Abrir menú"
        >
            <span
                className={`h-0.5 bg-text-primary transition-all duration-300 ${open ? 'translate-y-[9px] rotate-45' : ''
                    }`}
            />
            <span
                className={`h-0.5 bg-text-primary transition-all duration-300 ${open ? 'opacity-0' : ''
                    }`}
            />
            <span
                className={`h-0.5 bg-text-primary transition-all duration-300 ${open ? '-translate-y-[9px] -rotate-45' : ''
                    }`}
            />
        </button>
    );
}
