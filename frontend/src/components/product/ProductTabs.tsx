'use client';

import { useState } from 'react';
import { FileText, Package2, Truck, RotateCcw } from 'lucide-react';

interface Props {
    description: string;
    material?: string;
    category: string;
}

type Tab = 'description' | 'specs' | 'shipping' | 'warranty';

export function ProductTabs({ description, material, category }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('description');

    const tabs = [
        { id: 'description' as Tab, label: 'Descripción', icon: FileText },
        { id: 'specs' as Tab, label: 'Especificaciones', icon: Package2 },
        { id: 'shipping' as Tab, label: 'Envíos', icon: Truck },
        { id: 'warranty' as Tab, label: 'Garantía', icon: RotateCcw },
    ];

    return (
        <div className="border-t border-border pt-8">
            <div className="flex gap-1 border-b border-border mb-6 overflow-x-auto">
                {tabs.map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-2 px-6 py-3 font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                            ? 'text-primary border-b-2 border-primary'
                            : 'text-text-muted hover:text-text-primary'
                            }`}
                    >
                        <tab.icon className="w-4 h-4" />
                        {tab.label}
                    </button>
                ))}
            </div>

            <div className="prose prose-sm max-w-none">
                {activeTab === 'description' && (
                    <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-4">
                            Descripción del Producto
                        </h3>
                        <p className="text-text-secondary leading-relaxed whitespace-pre-line">
                            {description}
                        </p>
                    </div>
                )}

                {activeTab === 'specs' && (
                    <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-4">
                            Especificaciones Técnicas
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex justify-between py-3 border-b border-border">
                                <span className="font-medium text-text-primary">Categoría:</span>
                                <span className="text-text-secondary capitalize">{category}</span>
                            </div>
                            {material && (
                                <div className="flex justify-between py-3 border-b border-border">
                                    <span className="font-medium text-text-primary">Material:</span>
                                    <span className="text-text-secondary capitalize">{material}</span>
                                </div>
                            )}
                            <div className="flex justify-between py-3 border-b border-border">
                                <span className="font-medium text-text-primary">Origen:</span>
                                <span className="text-text-secondary">Argentino</span>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'shipping' && (
                    <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-4">
                            Información de Envío
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-text-primary mb-2">Envío Estándar</h4>
                                <p className="text-text-secondary">
                                    Recibí tu pedido en 5-10 días hábiles. Gratis en compras superiores a $250.000.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-text-primary mb-2">Envío Express</h4>
                                <p className="text-text-secondary">
                                    Recibí tu pedido en 2-4 días hábiles. Costo adicional según zona.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-text-primary mb-2">Retiro en Tienda</h4>
                                <p className="text-text-secondary">
                                    Retirá gratis tu pedido en nuestras sucursales. Disponible en 24-48 horas.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'warranty' && (
                    <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-4">
                            Garantía y Reclamos
                        </h3>

                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-text-primary mb-2">
                                    Control de calidad
                                </h4>
                                <p className="text-text-secondary">
                                    Todos nuestros productos son revisados antes de ser despachados para garantizar su correcto estado.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-text-primary mb-2">
                                    Productos con fallas
                                </h4>
                                <p className="text-text-secondary">
                                    Si tu producto presenta una falla de fabricación o llega dañado, contactanos dentro de las 48 horas de recibido para evaluar el caso y brindarte una solución.
                                </p>
                            </div>

                            <div>
                                <h4 className="font-semibold text-text-primary mb-2">
                                    Importante
                                </h4>
                                <ul className="list-disc list-inside text-text-secondary space-y-2">
                                    <li>No realizamos devoluciones por cambio de opinión.</li>
                                    <li>Verificá el talle antes de realizar la compra.</li>
                                    <li>Las imágenes son ilustrativas y pueden variar levemente según la pantalla utilizada.</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}