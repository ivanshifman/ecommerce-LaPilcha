'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
    <>🚚 <span className="font-semibold">Envío gratis</span> superando los <span className="font-bold">$150.000</span></>,
    <>💳 <span className="font-semibold">3 y 6 cuotas sin interés</span></>,
    <>⚡ <span className="font-semibold">Envíos</span> a todo el país</>,
];


export function TopBar() {
    const [index, setIndex] = useState(0);
    const [show, setShow] = useState(true);

    // Rotación de mensajes
    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % MESSAGES.length);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    // Scroll control
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
                    className="bg-primary text-white text-sm font-medium text-center"
                >
                    <div className="py-2">
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
