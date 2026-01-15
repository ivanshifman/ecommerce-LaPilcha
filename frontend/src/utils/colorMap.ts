import { ColorEnum } from '../types/product.types';

export const colorMap: Record<ColorEnum, string> = {
    [ColorEnum.BLACK]: '#000000',
    [ColorEnum.WHITE]: '#FFFFFF',
    [ColorEnum.RED]: '#DC2626',
    [ColorEnum.BLUE]: '#2563EB',
    [ColorEnum.GREEN]: '#16A34A',
    [ColorEnum.YELLOW]: '#EAB308',
    [ColorEnum.GRAY]: '#6B7280',
    [ColorEnum.BROWN]: '#92400E',
};

export const colorLabels: Record<ColorEnum, string> = {
    [ColorEnum.BLACK]: 'Negro',
    [ColorEnum.WHITE]: 'Blanco',
    [ColorEnum.RED]: 'Rojo',
    [ColorEnum.BLUE]: 'Azul',
    [ColorEnum.GREEN]: 'Verde',
    [ColorEnum.YELLOW]: 'Amarillo',
    [ColorEnum.GRAY]: 'Gris',
    [ColorEnum.BROWN]: 'Marrón',
};