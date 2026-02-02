import { Truck, Check } from 'lucide-react';

interface FreeShippingProgressProps {
    currentTotal: number;
    threshold: number;
}

export function FreeShippingProgress({ currentTotal, threshold }: FreeShippingProgressProps) {
    const remaining = threshold - currentTotal;
    const percentage = Math.min((currentTotal / threshold) * 100, 100);
    const isEligible = currentTotal >= threshold;

    if (isEligible) {
        return (
            <div className="p-4 bg-success/10 border border-success rounded-lg">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success rounded-full flex items-center justify-center shrink-0">
                        <Check className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-semibold text-success">
                            ¡Felicitaciones! Tenés envío gratis
                        </p>
                        <p className="text-xs text-success/80">
                            Tu compra supera los ${threshold.toLocaleString('es-AR')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
            <div className="flex items-start gap-3 mb-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <Truck className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                    <p className="text-sm font-semibold text-text-primary">
                        ¡Estás cerca del envío gratis!
                    </p>
                    <p className="text-xs text-text-muted">
                        Te faltan <span className="font-semibold text-primary">${remaining.toLocaleString('es-AR')}</span> para obtener envío gratis
                    </p>
                </div>
            </div>

            <div className="relative w-full h-3 bg-muted rounded-full overflow-hidden">
                <div
                    className="absolute top-0 left-0 h-full bg-linear-to-r from-primary to-primary-dark rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                >
                    <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
            </div>

            <p className="text-xs text-text-muted text-right mt-2">
                {percentage.toFixed(0)}% completado
            </p>
        </div>
    );
}