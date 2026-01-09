'use client';

import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    error?: string;
    showPasswordToggle?: boolean;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
    ({ label, error, type = 'text', showPasswordToggle = false, ...props }, ref) => {
        const [showPassword, setShowPassword] = useState(false);
        const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type;

        return (
            <div className="space-y-2">
                <label className="block text-sm font-medium text-text-primary">
                    {label}
                </label>
                <div className="relative">
                    <input
                        ref={ref}
                        type={inputType}
                        className={`
              w-full px-4 py-3 rounded-lg border transition-all duration-200
              focus:outline-none focus:ring-2 focus:ring-primary/20
              ${error
                                ? 'border-error focus:border-error'
                                : 'border-border focus:border-primary'
                            }
              ${showPasswordToggle ? 'pr-12' : ''}
            `}
                        {...props}
                    />
                    {showPasswordToggle && (
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary transition-colors"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    )}
                </div>
                {error && (
                    <p className="text-sm text-error">{error}</p>
                )}
            </div>
        );
    }
);

FormInput.displayName = 'FormInput';