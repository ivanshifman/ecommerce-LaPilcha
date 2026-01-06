'use client';

export function TopBar() {
    return (
        <div className="bg-primary text-white py-2 text-center text-sm font-medium">
            <p>
                🚚 <span className="font-semibold">Envío gratis</span> en compras superiores a{' '}
                <span className="font-bold">$150.000</span>
            </p>
        </div>
    );
}