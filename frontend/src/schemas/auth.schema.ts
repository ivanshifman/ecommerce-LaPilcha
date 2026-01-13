import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+[1-9]\d{7,14}$/;

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
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(255, 'El nombre no puede exceder 255 caracteres')
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            'El nombre solo puede contener letras y espacios'
        ),
    lastName: z
        .string()
        .min(3, 'El apellido debe tener al menos 3 caracteres')
        .max(255, 'El apellido no puede exceder 255 caracteres')
        .regex(
            /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/,
            'El apellido solo puede contener letras y espacios'
        )
        .optional()
        .or(z.literal('')),
    email: z
        .string()
        .min(1, 'El email es requerido')
        .regex(emailRegex, 'Ingresa un email válido'),
    password: z
        .string()
        .min(1, 'La contraseña es requerida')
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Debe contener al menos una mayúscula, una minúscula y un número'
        ),
    confirmPassword: z
        .string()
        .min(1, 'Confirma tu contraseña'),
    phone: z
        .string()
        .regex(
            phoneRegex,
            'Formato inválido. Usa: +54 9 11 1234-5678'
        )
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
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .regex(
            /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
            'Debe contener al menos una mayúscula, una minúscula y un número'
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