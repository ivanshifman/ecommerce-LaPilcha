import { IsMongoId, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CartVariantDto } from './add-cart.dto';

export class RemoveCartItemDto {
  @IsMongoId({ message: 'ID de producto inválido' })
  product!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => CartVariantDto)
  variant?: CartVariantDto;
}
