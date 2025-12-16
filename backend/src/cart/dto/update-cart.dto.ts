import { IsOptional, IsNumber, Min, ValidateNested, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { CartVariantDto } from './cart-variant.dto';

export class UpdateCartItemDto {
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
