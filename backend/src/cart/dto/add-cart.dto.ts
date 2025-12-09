import {
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  @MaxLength(10)
  @Matches(/^[a-zA-Z0-9]{1,10}$/, { message: 'Talle inválido' })
  size?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  @Matches(/^[a-zA-Z0-9\s-]{1,20}$/, { message: 'Color inválido' })
  color?: string;
}
