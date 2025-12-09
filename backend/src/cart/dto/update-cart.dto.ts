import { IsOptional, IsNumber, Min, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CartVariantDto } from './add-cart.dto';

export class UpdateCartItemDto {
  @IsOptional()
  @IsNumber()
  @Min(1, { message: 'La cantidad mínima es 1' })
  quantity?: number;

  @IsOptional()
  @ValidateNested()
  @Type(() => CartVariantDto)
  variant?: CartVariantDto;
}
