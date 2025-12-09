import { IsMongoId, IsNumber, Min } from 'class-validator';

export class UpdateCartItemDto {
  @IsMongoId({ message: 'ID de producto inválido' })
  product!: string;

  @IsNumber()
  @Min(1, { message: 'La cantidad mínima es 1' })
  quantity!: number;
}
