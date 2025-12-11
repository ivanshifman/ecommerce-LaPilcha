import {
  IsIn,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { ColorEnum } from '../../product/common/enums/color.enum';

export class AddToCartDto {
  @IsMongoId({ message: 'ID de producto inválido' })
  product!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CartVariantDto)
  variant?: CartVariantDto;

  @IsNumber()
  @Min(1, { message: 'La cantidad mínima es 1' })
  quantity!: number;
}

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
