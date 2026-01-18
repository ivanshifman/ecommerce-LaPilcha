'use client';

interface Props {
    color: string;
    category: string;
    subcategory?: string;
    material?: string;
    code: string;
}

export function ProductInfo({ color, category, subcategory, material, code }: Props) {
    return (
        <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
                <span className="text-text-muted">Color:</span>
                <span className="ml-2 text-text-primary font-medium capitalize">{color}</span>
            </div>
            <div>
                <span className="text-text-muted">Categoría:</span>
                <span className="ml-2 text-text-primary font-medium capitalize">{category}</span>
            </div>
            {subcategory && (
                <div>
                    <span className="text-text-muted">Subcategoría:</span>
                    <span className="ml-2 text-text-primary font-medium capitalize">{subcategory}</span>
                </div>
            )}
            {material && (
                <div>
                    <span className="text-text-muted">Material:</span>
                    <span className="ml-2 text-text-primary font-medium capitalize">{material}</span>
                </div>
            )}
            <div className="col-span-2">
                <span className="text-text-muted">Código:</span>
                <span className="ml-2 text-text-primary font-medium">{code}</span>
            </div>
        </div>
    );
}