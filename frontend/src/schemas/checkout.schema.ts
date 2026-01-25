import { z } from 'zod';

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phoneRegex = /^\+[1-9]\d{7,14}$/;

export const checkoutSchema = z.object({
    guestFullname: z.string().optional(),
    guestEmail: z
        .string()
        .min(1, 'El email es requerido')
        .regex(emailRegex, 'Ingresa un email válido')
        .optional(),
    guestPhone: z.string().optional(),
    fullName: z.string().min(3, 'Nombre completo requerido'),
    phone: z
        .string()
        .regex(
            phoneRegex,
            'Formato inválido. Usa: +54 9 11 1234-5678'
        )
        .or(z.literal('')),
    address: z.string().min(5, 'Dirección requerida'),
    city: z.string().min(2, 'Ciudad requerida'),
    state: z.string().min(2, 'Provincia requerida'),
    zipCode: z.string().min(4, 'Código postal requerido'),
    additionalInfo: z.string().optional(),
}).refine((data) => {
    if (data.guestEmail || data.guestFullname || data.guestPhone) {
        return !!(
            data.guestEmail &&
            data.guestFullname &&
            data.guestPhone
        );
    }
    return true;
}, {
    message: 'Datos de contacto requeridos para invitados',
    path: ['guestEmail'],
});


export type CheckoutFormData = z.infer<typeof checkoutSchema>;