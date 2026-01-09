import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const loginSchema = z.object({
    email: z
        .string()
        .min(1, 'El email es requerido')
        .regex(emailRegex, 'Ingresa un email válido'),
    password: z
        .string()
        .min(1, 'La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export const registerSchema = z.object({
    name: z
        .string()
        .min(1, 'El nombre es requerido')
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(50, 'El nombre no puede exceder 50 caracteres'),
    lastName: z
        .string()
        .min(2, 'El apellido debe tener al menos 2 caracteres')
        .max(50, 'El apellido no puede exceder 50 caracteres')
        .optional()
        .or(z.literal('')),
    email: z
        .string()
        .min(1, 'El email es requerido')
        .regex(emailRegex, 'Ingresa un email válido'),
    password: z
        .string()
        .min(1, 'La contraseña es requerida')
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Confirma tu contraseña'),
    phone: z
        .string()
        .regex(/^[0-9+\s-()]*$/, 'Número de teléfono inválido')
        .optional()
        .or(z.literal('')),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, 'El email es requerido')
        .regex(emailRegex, 'Ingresa un email válido'),
});

export const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(1, 'La contraseña es requerida')
        .min(8, 'La contraseña debe tener al menos 8 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'La contraseña debe contener al menos una mayúscula, una minúscula y un número'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Confirma tu contraseña'),
}).refine((data) => data.password === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;