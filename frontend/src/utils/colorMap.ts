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
    [ColorEnum.BURGUNDY]: '#7C2D12',
    [ColorEnum.ECRU_BLUE]: '#93C5FD',
    [ColorEnum.ECRU_RED]: '#FECACA',
    [ColorEnum.ECRU_GREEN]: '#BBF7D0',
    [ColorEnum.ECRU_BROWN]: '#D9D9D9',
    [ColorEnum.BEIGE]: '#F5F5DC',
    [ColorEnum.CAMOUFLAGE]: '#8B4513',
    [ColorEnum.PINK]: '#F472B6',
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
    [ColorEnum.BURGUNDY]: 'Bordo',
    [ColorEnum.ECRU_BLUE]: 'Crudo Azul',
    [ColorEnum.ECRU_RED]: 'Crudo Rojo',
    [ColorEnum.ECRU_GREEN]: 'Crudo Verde',
    [ColorEnum.ECRU_BROWN]: 'Crudo Marrón',
    [ColorEnum.BEIGE]: 'Beige',
    [ColorEnum.CAMOUFLAGE]: 'Camuflaje',
    [ColorEnum.PINK]: 'Rosa',
};