import { Transform } from 'class-transformer';
import { IsIn, IsOptional, IsString, Matches, MaxLength } from 'class-validator';
import { ColorEnum } from '../../product/common/enums/color.enum';

export class CartVariantDto {
  @IsOptional()
  @IsString()
  @Matches(/^([A-Z]{1,4}|[0-9]{1,3})$/, {
    message: 'Talle inválido.',
  })
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') return value.trim().toUpperCase();
    return value;
  })
  size?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') return value.toLowerCase();
    return value;
  })
  @IsIn(Object.values(ColorEnum), { message: 'Color inválido.' })
  color?: string;
}
