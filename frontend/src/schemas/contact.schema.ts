import { z } from 'zod';

const phoneRegex = /^\+[1-9]\d{7,14}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const contactSchema = z.object({
    name: z
        .string()
        .min(2, 'El nombre debe tener al menos 2 caracteres')
        .max(100, 'El nombre no puede exceder 100 caracteres'),
    email: z
        .string()
        .min(1, 'El email es requerido')
        .regex(emailRegex, 'Ingresa un email válido'),
    phone: z
        .string()
        .regex(phoneRegex, 'Formato inválido. Usa: +54 9 11 1234-5678')
        .optional()
        .or(z.literal('')),
    subject: z
        .string()
        .min(1, 'Debes seleccionar un asunto')
        .max(200, 'El asunto no puede exceder 200 caracteres'),
    message: z
        .string()
        .min(10, 'El mensaje debe tener al menos 10 caracteres')
        .max(2000, 'El mensaje no puede exceder 2000 caracteres'),
});

export type ContactFormData = z.infer<typeof contactSchema>;

export const contactResponseSchema = z.object({
    success: z.boolean(),
    message: z.string(),
});

export type ContactResponse = z.infer<typeof contactResponseSchema>;