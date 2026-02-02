'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Truck, Zap } from 'lucide-react';

const MESSAGES = [
    <><Truck className="inline h-4 w-4 mr-2" /> Envío gratis superando los <strong>$100.000</strong></>,
    <><CreditCard className="inline h-4 w-4 mr-2" /> 3 y 6 cuotas sin interés</>,
    <><Zap className="inline h-4 w-4 mr-2" /> Envíos a todo el país</>,
];

export function TopBar() {
    const [index, setIndex] = useState(0);
    const [show, setShow] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        const onScroll = () => {
            setShow(window.scrollY < 10);
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    return (
        <AnimatePresence initial={false}>
            {show && (
                <motion.div
                    style={{ y: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.2, ease: 'easeOut' }}
                    className="hidden md:block bg-primary text-white text-sm text-center">
                    <div className="py-1">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.p
                                key={index}
                                className="uppercase tracking-wide"
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                {MESSAGES[index]}
                            </motion.p>
                        </AnimatePresence>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
