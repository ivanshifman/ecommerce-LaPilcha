import { GenderEnum } from '../types/product.types';

export const genderLabels: Record<GenderEnum, string> = {
  [GenderEnum.MALE]: 'Hombre',
  [GenderEnum.FEMALE]: 'Mujer',
  [GenderEnum.UNISEX]: 'Unisex',
  [GenderEnum.KID]: 'Niños',
};