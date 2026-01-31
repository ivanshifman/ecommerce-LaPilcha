'use client';

import { forwardRef, useState, ChangeEvent } from 'react';

interface ContactPhoneInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
    error?: string;
    onChange?: (value: string) => void;
}

export const ContactPhoneInput = forwardRef<HTMLInputElement, ContactPhoneInputProps>(
    ({ error, value, onChange, className = '', ...props }, ref) => {
        const [displayValue, setDisplayValue] = useState('');

        const formatPhoneDisplay = (phone: string): string => {
            const cleaned = phone.replace(/[^\d+]/g, '');

            let withPrefix = cleaned;
            if (cleaned && !cleaned.startsWith('+')) {
                withPrefix = `+54${cleaned}`;
            }

            if (withPrefix.startsWith('+54')) {
                const numbers = withPrefix.slice(3);
                if (numbers.length === 0) return '+54 ';
                if (numbers.length <= 1) return `+54 ${numbers}`;
                if (numbers.length <= 3) return `+54 ${numbers.slice(0, 1)} ${numbers.slice(1)}`;
                if (numbers.length <= 7) {
                    return `+54 ${numbers.slice(0, 1)} ${numbers.slice(1, 3)} ${numbers.slice(3)}`;
                }
                return `+54 ${numbers.slice(0, 1)} ${numbers.slice(1, 3)} ${numbers.slice(3, 7)}-${numbers.slice(7, 11)}`;
            }

            return withPrefix;
        };

        const toBackendFormat = (phone: string): string => {
            const cleaned = phone.replace(/[^\d+]/g, '');

            if (!cleaned || cleaned === '+') return '';

            if (/^\+[1-9]\d{7,14}$/.test(cleaned)) {
                return cleaned;
            }

            if (!cleaned.startsWith('+')) {
                return `+54${cleaned}`;
            }

            return cleaned;
        };

        const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
            const input = e.target.value;

            if (!input) {
                setDisplayValue('');
                onChange?.('');
                return;
            }

            const formatted = formatPhoneDisplay(input);
            setDisplayValue(formatted);

            const backendFormat = toBackendFormat(input);
            onChange?.(backendFormat);
        };

        return (
            <div>
                <input
                    ref={ref}
                    type="tel"
                    value={displayValue || value || ''}
                    onChange={handleChange}
                    placeholder="+54 9 11 1234-5678"
                    className={`w-full px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 ${error ? 'border-error' : ''} ${className}`}
                    {...props}
                />
                {error && (
                    <p className="mt-1 text-sm text-error">{error}</p>
                )}
            </div>
        );
    }
);

ContactPhoneInput.displayName = 'ContactPhoneInput';