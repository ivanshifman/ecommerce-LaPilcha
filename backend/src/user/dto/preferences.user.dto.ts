import { ArrayUnique, IsArray, IsIn, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';
import { UserSizePreference } from '../common/enums/userSizePreference.enum';
import { UserColorPreference } from '../common/enums/userColorPreference.enum';

export class UserPreferencesDto {
  @IsOptional()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value !== 'string') return value;
    return value.toUpperCase() as UserSizePreference;
  })
  @IsIn(Object.values(UserSizePreference), {
    message: 'El talle preferido no es válido. Debe ser uno de los talles permitidos.',
  })
  defaultSize?: UserSizePreference;

  @IsOptional()
  @IsArray({ message: 'Los colores favoritos deben enviarse como un arreglo.' })
  @ArrayUnique({ message: 'Los colores favoritos no deben repetirse.' })
  @Transform(({ value }: { value: unknown }) => {
    if (!Array.isArray(value)) return value;

    const normalized: UserColorPreference[] = value
      .filter((v): v is string => typeof v === 'string')
      .map((v) => v.toLowerCase() as UserColorPreference);

    return normalized;
  })
  @IsIn(Object.values(UserColorPreference), {
    each: true,
    message: 'Uno o más colores favoritos no son válidos. Deben ser colores permitidos.',
  })
  favoriteColors?: UserColorPreference[];
}
