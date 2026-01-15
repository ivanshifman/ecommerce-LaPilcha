'use client';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    sortBy: string;
    order: string;
    onSortChange: (sortBy: string, order: 'asc' | 'desc') => void;
}

export function SortMenu({ isOpen, onClose, sortBy, order, onSortChange }: Props) {
    const sortOptions = [
        { label: 'Más recientes', sortBy: 'createdAt', order: 'desc' },
        { label: 'Más antiguos', sortBy: 'createdAt', order: 'asc' },
        { label: 'Precio: menor a mayor', sortBy: 'price', order: 'asc' },
        { label: 'Precio: mayor a menor', sortBy: 'price', order: 'desc' },
        { label: 'Más vendidos', sortBy: 'salesCount', order: 'desc' },
        { label: 'Mejor valorados', sortBy: 'rating', order: 'desc' },
    ];

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-40" onClick={onClose} />
            <div className="absolute right-0 top-full mt-2 w-64 bg-white shadow-xl rounded-lg border border-border z-50 overflow-hidden">
                <div className="p-2">
                    {sortOptions.map((option) => (
                        <button
                            key={`${option.sortBy}-${option.order}`}
                            onClick={() => {
                                onSortChange(option.sortBy, option.order as 'asc' | 'desc');
                                onClose();
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm rounded-md transition-colors ${sortBy === option.sortBy && order === option.order
                                    ? 'bg-primary text-white'
                                    : 'text-text-primary hover:bg-accent'
                                }`}
                        >
                            {option.label}
                        </button>
                    ))}
                </div>
            </div>
        </>
    );
}