'use client';

import { MobileCategories } from './MobileCategories';
import { motion, AnimatePresence, easeOut, easeIn } from 'framer-motion';

interface Props {
    open: boolean;
    onClose: () => void;
}

export function MobileMenu({ open }: Props) {
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
                    className="
            fixed left-0 right-0 top-32 bottom-0
            bg-white z-40
            md:hidden
            flex flex-col
            overflow-y-auto
            p-6
          "
                >
                    <MobileCategories key="mobile-categories" />
                </motion.div>
            )}
        </AnimatePresence>
    );
}

