'use client';

import { useRef, useState, useEffect, KeyboardEvent, ClipboardEvent } from 'react';

interface VerificationCodeInputProps {
    length?: number;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    disabled?: boolean;
}

export function VerificationCodeInput({
    length = 6,
    value,
    onChange,
    error,
    disabled = false,
}: VerificationCodeInputProps) {
    const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        const newDigits = value.split('').slice(0, length);
        while (newDigits.length < length) {
            newDigits.push('');
        }
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setDigits(newDigits);
    }, [value, length]);

    const focusInput = (index: number) => {
        if (index >= 0 && index < length && inputRefs.current[index]) {
            inputRefs.current[index]?.focus();
        }
    };

    const handleChange = (index: number, newValue: string) => {
        if (disabled) return;

        const sanitized = newValue.replace(/[^0-9]/g, '');

        if (sanitized.length === 0) {
            const newDigits = [...digits];
            newDigits[index] = '';
            setDigits(newDigits);
            onChange(newDigits.join(''));
            return;
        }

        if (sanitized.length === 1) {
            const newDigits = [...digits];
            newDigits[index] = sanitized;
            setDigits(newDigits);
            onChange(newDigits.join(''));

            if (index < length - 1) {
                focusInput(index + 1);
            }
        }
        else if (sanitized.length > 1) {
            const pastedDigits = sanitized.split('').slice(0, length);
            const newDigits = [...digits];

            pastedDigits.forEach((digit, i) => {
                if (index + i < length) {
                    newDigits[index + i] = digit;
                }
            });

            setDigits(newDigits);
            onChange(newDigits.join(''));

            const nextIndex = Math.min(index + pastedDigits.length, length - 1);
            focusInput(nextIndex);
        }
    };

    const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (e.key === 'Backspace') {
            e.preventDefault();

            if (digits[index]) {
                const newDigits = [...digits];
                newDigits[index] = '';
                setDigits(newDigits);
                onChange(newDigits.join(''));
            }
            else if (index > 0) {
                const newDigits = [...digits];
                newDigits[index - 1] = '';
                setDigits(newDigits);
                onChange(newDigits.join(''));
                focusInput(index - 1);
            }
        } else if (e.key === 'ArrowLeft' && index > 0) {
            focusInput(index - 1);
        } else if (e.key === 'ArrowRight' && index < length - 1) {
            focusInput(index + 1);
        }
    };

    const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
        e.preventDefault();
        if (disabled) return;

        const pastedText = e.clipboardData.getData('text');
        const sanitized = pastedText.replace(/[^0-9]/g, '');

        if (sanitized.length > 0) {
            const pastedDigits = sanitized.split('').slice(0, length);
            const newDigits = Array(length).fill('');

            pastedDigits.forEach((digit, i) => {
                newDigits[i] = digit;
            });

            setDigits(newDigits);
            onChange(newDigits.join(''));

            const nextIndex = Math.min(pastedDigits.length, length - 1);
            setTimeout(() => focusInput(nextIndex), 0);
        }
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2 justify-center" role="group" aria-label="Código de verificación">
                {digits.map((digit, index) => (
                    <input
                        key={index}
                        ref={(el) => {
                            inputRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        onPaste={handlePaste}
                        disabled={disabled}
                        aria-label={`Dígito ${index + 1} de ${length}`}
                        autoComplete="off"
                        className={`
              w-12 h-14 text-center text-2xl font-semibold
              border-2 rounded-lg
              transition-all duration-200
              focus:outline-none focus:ring-2
              ${error
                                ? 'border-red-500 focus:border-red-500 focus:ring-red-200'
                                : 'border-gray-300 focus:border-primary focus:ring-primary/20'
                            }
              ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'}
              ${digit ? 'border-primary' : ''}
            `}
                    />
                ))}
            </div>
            {error && (
                <p className="text-sm text-red-600 text-center" role="alert">{error}</p>
            )}
        </div>
    );
}