'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface SizeGuideModalProps {
    isOpen: boolean;
    onClose: () => void;
    category: string;
    subcategory?: string;
}

interface SizeChart {
    title: string;
    headers: string[];
    rows: string[][];
    measurements?: {
        title: string;
        items: { label: string; description: string }[];
    };
}

const sizeGuides: Record<string, SizeChart> = {
    'ropa-superior': {
        title: 'Guía de Talles - Parte Superior',
        headers: ['Talle', 'Pecho (cm)', 'Cintura (cm)', 'Largo (cm)'],
        rows: [
            ['XXS', '80-84', '64-68', '66'],
            ['XS', '84-88', '68-72', '68'],
            ['S', '88-94', '72-78', '70'],
            ['M', '94-100', '78-84', '72'],
            ['L', '100-108', '84-92', '74'],
            ['XL', '108-116', '92-100', '76'],
            ['XXL', '116-124', '100-108', '78'],
            ['XXXL', '124-132', '108-116', '80'],
        ],
        measurements: {
            title: '¿Cómo medir?',
            items: [
                {
                    label: 'Pecho',
                    description: 'Medir el contorno del pecho en la parte más ancha, pasando por debajo de las axilas.',
                },
                {
                    label: 'Cintura',
                    description: 'Medir el contorno de la cintura en la parte más estrecha, generalmente a la altura del ombligo.',
                },
                {
                    label: 'Largo',
                    description: 'Medir desde el punto más alto del hombro hasta el largo deseado.',
                },
            ],
        },
    },

    'ropa-inferior': {
        title: 'Guía de Talles - Parte Inferior',
        headers: ['Talle', 'Cintura (cm)', 'Cadera (cm)', 'Largo (cm)'],
        rows: [
            ['XXS', '60-64', '84-88', '100'],
            ['XS', '64-68', '88-92', '102'],
            ['S', '68-74', '92-98', '104'],
            ['M', '74-80', '98-104', '106'],
            ['L', '80-88', '104-112', '108'],
            ['XL', '88-96', '112-120', '110'],
            ['XXL', '96-104', '120-128', '112'],
            ['XXXL', '104-112', '128-136', '114'],
        ],
        measurements: {
            title: '¿Cómo medir?',
            items: [
                {
                    label: 'Cintura',
                    description: 'Medir el contorno de la cintura donde normalmente usas el pantalón.',
                },
                {
                    label: 'Cadera',
                    description: 'Medir el contorno de la cadera en la parte más ancha.',
                },
                {
                    label: 'Largo',
                    description: 'Medir desde la cintura hasta el largo deseado del pantalón.',
                },
            ],
        },
    },

    calzado: {
        title: 'Guía de Talles - Calzado',
        headers: ['Talle ARG', 'Talle US', 'Talle EUR', 'CM'],
        rows: [
            ['35', '5', '36', '22.5'],
            ['36', '6', '37', '23'],
            ['37', '7', '38', '24'],
            ['38', '8', '39', '24.5'],
            ['39', '9', '40', '25'],
            ['40', '10', '41', '26'],
            ['41', '11', '42', '26.5'],
            ['42', '12', '43', '27'],
            ['43', '13', '44', '28'],
            ['44', '14', '45', '28.5'],
            ['45', '15', '46', '29'],
        ],
        measurements: {
            title: '¿Cómo medir tu pie?',
            items: [
                {
                    label: 'Paso 1',
                    description: 'Coloca una hoja de papel contra la pared y párate sobre ella con el talón tocando la pared.',
                },
                {
                    label: 'Paso 2',
                    description: 'Marca el punto más largo de tu pie (generalmente el dedo gordo).',
                },
                {
                    label: 'Paso 3',
                    description: 'Mide la distancia desde el borde del papel hasta la marca en centímetros.',
                },
            ],
        },
    },

    'ropa-interior': {
        title: 'Guía de Talles - Ropa Interior',
        headers: ['Talle', 'Contorno (cm)', 'Copa'],
        rows: [
            ['85A', '83-87', 'A'],
            ['85B', '83-87', 'B'],
            ['85C', '83-87', 'C'],
            ['90A', '88-92', 'A'],
            ['90B', '88-92', 'B'],
            ['90C', '88-92', 'C'],
            ['95A', '93-97', 'A'],
            ['95B', '93-97', 'B'],
            ['95C', '93-97', 'C'],
        ],
        measurements: {
            title: '¿Cómo medir?',
            items: [
                {
                    label: 'Contorno',
                    description: 'Medir el contorno debajo del busto, manteniendo la cinta horizontal.',
                },
                {
                    label: 'Copa',
                    description: 'Medir el contorno en la parte más prominente del busto.',
                },
            ],
        },
    },
};

const getCategoryGuide = (category: string, subcategory?: string): string => {
    const normalize = (str: string) =>
        str.toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

    const cat = normalize(category);
    const subcat = subcategory ? normalize(subcategory) : '';

    if (cat.includes('calzado') || cat.includes('zapato') || subcat?.includes('zapatilla')) {
        return 'calzado';
    }

    if (
        cat.includes('remera') ||
        cat.includes('camisa') ||
        cat.includes('buzo') ||
        cat.includes('campera') ||
        cat.includes('sweater') ||
        subcat?.includes('remera') ||
        subcat?.includes('camisa')
    ) {
        return 'ropa-superior';
    }

    if (
        cat.includes('pantalon') ||
        cat.includes('jean') ||
        cat.includes('short') ||
        cat.includes('falda') ||
        subcat?.includes('pantalon') ||
        subcat?.includes('jean')
    ) {
        return 'ropa-inferior';
    }

    if (cat.includes('interior') || cat.includes('lenceria') || subcat?.includes('interior')) {
        return 'ropa-interior';
    }

    return 'ropa-superior';
};

export function SizeGuideModal({ isOpen, onClose, category, subcategory }: SizeGuideModalProps) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    const guideKey = getCategoryGuide(category, subcategory);
    const guide = sizeGuides[guideKey];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-border">
                    <h2 className="text-2xl font-bold text-text-primary">{guide.title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-accent rounded-lg transition-colors cursor-pointer"
                        title="Cerrar"
                    >
                        <X className="w-6 h-6 text-text-muted" />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6">
                    <div className="overflow-x-auto mb-8">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-accent">
                                    {guide.headers.map((header, index) => (
                                        <th
                                            key={index}
                                            className="px-4 py-3 text-left text-sm font-semibold text-text-primary border border-border"
                                        >
                                            {header}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {guide.rows.map((row, rowIndex) => (
                                    <tr
                                        key={rowIndex}
                                        className={rowIndex % 2 === 0 ? 'bg-white' : 'bg-accent/30'}
                                    >
                                        {row.map((cell, cellIndex) => (
                                            <td
                                                key={cellIndex}
                                                className={`px-4 py-3 text-sm border border-border ${cellIndex === 0 ? 'font-semibold text-primary' : 'text-text-secondary'
                                                    }`}
                                            >
                                                {cell}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {guide.measurements && (
                        <div className="bg-accent/50 rounded-lg p-6">
                            <h3 className="text-lg font-semibold text-text-primary mb-4">
                                {guide.measurements.title}
                            </h3>
                            <div className="space-y-4">
                                {guide.measurements.items.map((item, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="shrink-0 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center font-semibold text-sm">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <h4 className="font-semibold text-text-primary mb-1">{item.label}</h4>
                                            <p className="text-sm text-text-secondary">{item.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Consejos adicionales */}
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                        <p className="text-sm text-blue-800">
                            <strong>💡 Consejo:</strong> Si estás entre dos talles, te recomendamos elegir el
                            talle más grande para mayor comodidad. Las medidas pueden variar ligeramente según el
                            modelo y la marca.
                        </p>
                    </div>
                </div>

                <div className="p-6 border-t border-border bg-accent/30">
                    <button
                        onClick={onClose}
                        className="w-full py-3 bg-primary text-white font-semibold rounded-lg hover:bg-primary-dark transition-colors cursor-pointer"
                    >
                        Entendido
                    </button>
                </div>
            </div>
        </div>
    );
}