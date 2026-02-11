'use client';

import Link from 'next/link';
import {
    Facebook,
    Instagram,
    Twitter,
    Mail,
    Phone,
    MapPin,
    CreditCard,
    Truck,
    RefreshCw,
    HelpCircle,
    Shield,
} from 'lucide-react';
import { CONTACT_INFO, SOCIAL_LINKS, COMPANY_INFO } from '../../lib/constants/contact';

const FOOTER_LINKS = {
    ayuda: [
        {
            label: 'Envíos y Entregas',
            href: '/help#envios',
            icon: Truck,
        },
        {
            label: 'Métodos de Pago',
            href: '/help#pagos',
            icon: CreditCard,
        },
        {
            label: 'Cambios y Devoluciones',
            href: '/help#devoluciones',
            icon: RefreshCw,
        },
        {
            label: 'Seguimiento de Pedido',
            href: '/help#seguimiento',
            icon: HelpCircle,
        },
    ],
    empresa: [
        {
            label: 'Sobre Nosotros',
            href: '/about',
        },
        {
            label: 'Contacto',
            href: '/contact',
        },
        {
            label: 'Términos y Condiciones',
            href: '/terms',
        },
        {
            label: 'Política de Privacidad',
            href: '/privacy',
        },
    ],
    categorias: [
        {
            label: 'Hombre',
            href: '/products?gender=male',
        },
        {
            label: 'Mujer',
            href: '/products?gender=female',
        },
        {
            label: 'Ofertas',
            href: '/products?onDiscount=true',
        },
        {
            label: 'Novedades',
            href: '/products?order=desc',
        },
    ],
};

const PAYMENT_METHODS = [
    { name: 'Mercado Pago' },
    { name: 'Modo' },
    { name: 'Transferencia' },
];

export function Footer() {
    return (
        <footer className="bg-white border-t border-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    <div className="space-y-4">
                        <Link href="/" className="inline-block">
                            <h3 className="text-2xl font-bold text-primary">{COMPANY_INFO.name}</h3>
                        </Link>
                        <p className="text-sm text-text-secondary leading-relaxed">
                            {COMPANY_INFO.slogan}
                        </p>

                        <div className="flex items-center gap-3 pt-2">
                            <a
                                href={SOCIAL_LINKS.facebook}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-accent hover:bg-primary transition-colors group"
                                aria-label="Seguinos en Facebook"
                            >
                                <Facebook className="w-5 h-5 text-text-primary group-hover:text-white transition-colors" />
                            </a>
                            <a
                                href={SOCIAL_LINKS.instagram}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-accent hover:bg-primary transition-colors group"
                                aria-label="Seguinos en Instagram"
                            >
                                <Instagram className="w-5 h-5 text-text-primary group-hover:text-white transition-colors" />
                            </a>
                            <a
                                href={SOCIAL_LINKS.twitter}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-10 h-10 flex items-center justify-center rounded-full bg-accent hover:bg-primary transition-colors group"
                                aria-label="Seguinos en Twitter"
                            >
                                <Twitter className="w-5 h-5 text-text-primary group-hover:text-white transition-colors" />
                            </a>
                        </div>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
                            Ayuda
                        </h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.ayuda.map((link) => {
                                const Icon = link.icon;
                                return (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="flex items-center gap-2 text-sm text-text-secondary hover:text-primary transition-colors group"
                                        >
                                            <Icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                                            {link.label}
                                        </Link>
                                    </li>
                                );
                            })}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
                            Empresa
                        </h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.empresa.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-text-secondary hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-bold text-text-primary uppercase tracking-wider mb-4">
                            Categorías
                        </h4>
                        <ul className="space-y-3">
                            {FOOTER_LINKS.categorias.map((link) => (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className="text-sm text-text-secondary hover:text-primary transition-colors"
                                    >
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-12 pt-8 border-t border-border">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent shrink-0">
                                <Mail className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-text-primary">Email</p>
                                <a
                                    href={`mailto:${CONTACT_INFO.email}`}
                                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                                >
                                    {CONTACT_INFO.email}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent shrink-0">
                                <Phone className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-text-primary">Teléfono</p>
                                <a
                                    href={`tel:${CONTACT_INFO.phoneRaw}`}
                                    className="text-sm text-text-secondary hover:text-primary transition-colors"
                                >
                                    {CONTACT_INFO.phone}
                                </a>
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-accent shrink-0">
                                <MapPin className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold text-text-primary">Dirección</p>
                                <p className="text-sm text-text-secondary">
                                    {CONTACT_INFO.address}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t border-border">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="flex items-center gap-3">
                            <Shield className="w-5 h-5 text-primary" />
                            <p className="text-sm text-text-secondary">
                                Compra 100% segura
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <p className="text-sm text-text-muted">Métodos de pago:</p>
                            <div className="flex items-center gap-3">
                                {PAYMENT_METHODS.map((method) => (
                                    <div
                                        key={method.name}
                                        className="w-12 h-8 flex items-center justify-center bg-accent rounded border border-border"
                                        title={method.name}
                                    >
                                        <CreditCard className="w-5 h-5 text-text-muted" />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="bg-accent border-t border-border">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-text-secondary">
                        <p>
                            © {new Date().getFullYear()} {COMPANY_INFO.name}. Todos los derechos reservados.
                        </p>
                        <div className="flex items-center gap-6">
                            <Link
                                href="/terms"
                                className="hover:text-primary transition-colors"
                            >
                                Términos
                            </Link>
                            <Link
                                href="/privacy"
                                className="hover:text-primary transition-colors"
                            >
                                Privacidad
                            </Link>
                            <Link
                                href="/help"
                                className="hover:text-primary transition-colors"
                            >
                                Ayuda
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}