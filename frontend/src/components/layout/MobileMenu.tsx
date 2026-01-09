'use client';

import { MobileCategories } from './MobileCategories';
import { motion, AnimatePresence, easeOut, easeIn } from 'framer-motion';

interface Props {
    open: boolean;
    onClose: () => void;
    topOffset: number;
}

export function MobileMenu({ open, topOffset }: Props) {
    const menuVariants = {
        hidden: { x: '-100%', opacity: 0 },
        visible: { x: 0, opacity: 1, transition: { duration: 0.25, ease: easeOut } },
        exit: { x: '-100%', opacity: 0, transition: { duration: 0.2, ease: easeIn } },
    };

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="mobile-menu"
                    variants={menuVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    style={{ top: topOffset }}
                    className="fixed left-0 right-0 bottom-0 bg-background z-40 md:hidden flex flex-col overflow-y-auto p-4 sm:p-5 border-t border-border shadow-[0_-6px_24px_-8px_rgba(0,0,0,0.18)]"
                >
                    <MobileCategories key="mobile-categories" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

