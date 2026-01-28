'use client';

import { useState } from 'react';
import { ChevronDown, Truck, CreditCard, RefreshCw, Package } from 'lucide-react';
import Link from 'next/link';

const HELP_SECTIONS = [
    {
        id: 'envios',
        title: 'Envíos y Entregas',
        icon: Truck,
        items: [
            {
                question: '¿Cuánto tarda el envío?',
                answer: 'Los envíos tardan entre 3 y 7 días hábiles dependiendo de tu ubicación. Para Capital Federal y Gran Buenos Aires, el tiempo estimado es de 2-4 días hábiles.',
            },
            {
                question: '¿Cuál es el costo de envío?',
                answer: 'El costo de envío varía según la provincia y el método seleccionado. Los envíos son GRATIS en compras superiores a $50.000.',
            },
            {
                question: '¿Realizan envíos a todo el país?',
                answer: 'Sí, realizamos envíos a todo el territorio argentino a través de correos reconocidos.',
            },
        ],
    },
    {
        id: 'pagos',
        title: 'Métodos de Pago',
        icon: CreditCard,
        items: [
            {
                question: '¿Qué métodos de pago aceptan?',
                answer: 'Aceptamos Mercado Pago (tarjetas de crédito/débito), Modo y transferencia bancaria con 10% de descuento.',
            },
            {
                question: '¿Puedo pagar en cuotas?',
                answer: 'Sí, puedes pagar en cuotas a través de Mercado Pago según las promociones vigentes de tu banco.',
            },
            {
                question: '¿Cómo funciona el descuento por transferencia?',
                answer: 'Al seleccionar transferencia bancaria, obtienes un 10% de descuento adicional. Recibirás los datos bancarios por email.',
            },
        ],
    },
    {
        id: 'devoluciones',
        title: 'Cambios y Devoluciones',
        icon: RefreshCw,
        items: [
            {
                question: '¿Cuál es la política de devoluciones?',
                answer: 'Tienes 30 días desde la recepción del producto para solicitar un cambio o devolución. El producto debe estar sin usar y con etiquetas.',
            },
            {
                question: '¿Cómo solicito un cambio?',
                answer: 'Contacta a nuestro equipo a través del email info@lapilcha.com indicando tu número de orden y el motivo del cambio.',
            },
            {
                question: '¿Quién paga el envío de la devolución?',
                answer: 'Si el producto tiene un defecto de fábrica, nosotros nos hacemos cargo. Si es por cambio de talle o arrepentimiento, el costo corre por cuenta del cliente.',
            },
        ],
    },
    {
        id: 'seguimiento',
        title: 'Seguimiento de Pedido',
        icon: Package,
        items: [
            {
                question: '¿Cómo hago el seguimiento de mi pedido?',
                answer: 'Una vez despachado tu pedido, recibirás un email con el número de tracking. También puedes ver el estado en la sección "Mis Órdenes".',
            },
            {
                question: '¿Qué hago si mi pedido no llega?',
                answer: 'Si pasaron más de 10 días hábiles, contacta a nuestro equipo con tu número de orden para iniciar un reclamo.',
            },
        ],
    },
];

export default function HelpPage() {
    const [openItems, setOpenItems] = useState<Record<string, number | null>>({});

    const toggleItem = (sectionId: string, index: number) => {
        setOpenItems((prev) => ({
            ...prev,
            [sectionId]: prev[sectionId] === index ? null : index,
        }));
    };

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-4xl mx-auto px-4 py-12">
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-text-primary mb-4">
                        Centro de Ayuda
                    </h1>
                    <p className="text-lg text-text-secondary">
                        Encuentra respuestas a las preguntas más frecuentes
                    </p>
                </div>

                <div className="space-y-8">
                    {HELP_SECTIONS.map((section) => {
                        const Icon = section.icon;
                        return (
                            <div key={section.id} id={section.id} className="scroll-mt-24">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 flex items-center justify-center rounded-lg bg-primary/10">
                                        <Icon className="w-5 h-5 text-primary" />
                                    </div>
                                    <h2 className="text-2xl font-bold text-text-primary">
                                        {section.title}
                                    </h2>
                                </div>

                                <div className="space-y-3">
                                    {section.items.map((item, index) => (
                                        <div
                                            key={index}
                                            className="bg-white border border-border rounded-lg overflow-hidden"
                                        >
                                            <button
                                                onClick={() => toggleItem(section.id, index)}
                                                className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-accent/50 transition-colors"
                                            >
                                                <span className="font-semibold text-text-primary">
                                                    {item.question}
                                                </span>
                                                <ChevronDown
                                                    className={`w-5 h-5 text-text-muted transition-transform ${openItems[section.id] === index ? 'rotate-180' : ''
                                                        }`}
                                                />
                                            </button>
                                            {openItems[section.id] === index && (
                                                <div className="px-6 py-4 bg-accent/30 border-t border-border">
                                                    <p className="text-text-secondary leading-relaxed">
                                                        {item.answer}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="mt-12 p-6 bg-primary/5 border border-primary/20 rounded-lg text-center">
                    <h3 className="text-lg font-bold text-text-primary mb-2">
                        ¿No encontraste lo que buscabas?
                    </h3>
                    <p className="text-text-secondary mb-4">
                        Contáctanos y te responderemos a la brevedad
                    </p>
                    <Link
                        href="/contact"
                        className="inline-block px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary-dark transition-colors"
                    >
                        Contactar Soporte
                    </Link>
                </div>
            </div>
        </div>
    );
}