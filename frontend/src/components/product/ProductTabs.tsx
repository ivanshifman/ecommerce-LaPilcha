'use client';

import { useState } from 'react';
import { FileText, Package2, Truck, RotateCcw } from 'lucide-react';

interface Props {
    description: string;
    material?: string;
    category: string;
}

type Tab = 'description' | 'specs' | 'shipping' | 'returns';

export function ProductTabs({ description, material, category }: Props) {
    const [activeTab, setActiveTab] = useState<Tab>('description');

    const tabs = [
        { id: 'description' as Tab, label: 'Descripción', icon: FileText },
        { id: 'specs' as Tab, label: 'Especificaciones', icon: Package2 },
        { id: 'shipping' as Tab, label: 'Envíos', icon: Truck },
        { id: 'returns' as Tab, label: 'Devoluciones', icon: RotateCcw },
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
                                <span className="font-medium text-text-primary">Garantía:</span>
                                <span className="text-text-secondary">12 meses</span>
                            </div>
                            <div className="flex justify-between py-3 border-b border-border">
                                <span className="font-medium text-text-primary">Origen:</span>
                                <span className="text-text-secondary">Importado</span>
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
                                    Recibí tu pedido en 3-5 días hábiles. Gratis en compras superiores a $100.000.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-text-primary mb-2">Envío Express</h4>
                                <p className="text-text-secondary">
                                    Recibí tu pedido en 1-2 días hábiles. Costo adicional según zona.
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

                {activeTab === 'returns' && (
                    <div>
                        <h3 className="text-xl font-semibold text-text-primary mb-4">
                            Política de Devoluciones
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-text-primary mb-2">30 Días de Devolución</h4>
                                <p className="text-text-secondary">
                                    Tenés 30 días desde la recepción para devolver tu producto si no estás satisfecho.
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-text-primary mb-2">Condiciones</h4>
                                <ul className="list-disc list-inside text-text-secondary space-y-2">
                                    <li>El producto debe estar sin usar y con las etiquetas originales</li>
                                    <li>Debe incluir el empaque original</li>
                                    <li>No se aceptan devoluciones de productos personalizados</li>
                                    <li>El reembolso se procesa en 5-10 días hábiles</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-text-primary mb-2">Cambios</h4>
                                <p className="text-text-secondary">
                                    Los cambios de talle o color son gratuitos dentro de los 30 días.
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}