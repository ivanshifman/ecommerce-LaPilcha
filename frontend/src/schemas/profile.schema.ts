import { z } from "zod";

const phoneRegex = /^\+[1-9]\d{7,14}$/;

export const UserSizePreference = {
    XSS: 'XSS',
    XS: 'XS',
    S: 'S',
    M: 'M',
    L: 'L',
    XL: 'XL',
    XXL: 'XXL',
    // Talles numéricos
    '36': '36',
    '38': '38',
    '40': '40',
    '42': '42',
    '44': '44',
    '46': '46',
    '48': '48',
    '50': '50',
} as const;

export enum UserColorPreference {
    BLACK = 'negro',
    GRAY = 'gris',
    BROWN = 'marron',
    WHITE = 'blanco',
    BLUE = 'azul',
    RED = 'rojo',
    GREEN = 'verde',
    YELLOW = 'amarillo',
    NEUTRAL = 'neutral',
}

const userSizeValues = Object.values(UserSizePreference) as Array<
    (typeof UserSizePreference)[keyof typeof UserSizePreference]
>;

const userColorValues = Object.values(UserColorPreference) as Array<
    UserColorPreference
>;

export const profileSchema = z.object({
    name: z.string().min(2, 'Nombre debe tener al menos 2 caracteres').max(255),
    lastName: z.string().max(255).optional().or(z.literal('')),
    phone: z
        .string()
        .regex(phoneRegex, 'Formato inválido. Usa: +54 9 11 1234-5678')
        .optional()
        .or(z.literal('')),
    avatar: z
        .string()
        .refine(
            (val) => val === '' || /^https?:\/\/.+/.test(val),
            { message: 'URL inválida' }
        )
        .optional(),
    preferences: z.object({
        defaultSize: z.enum(userSizeValues).optional(),
        favoriteColors: z.array(z.enum(userColorValues)).optional(),
    }).optional(),
});

export type ProfileFormData = z.infer<typeof profileSchema>;
