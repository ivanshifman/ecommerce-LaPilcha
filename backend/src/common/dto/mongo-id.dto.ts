import { IsMongoId } from 'class-validator';

export class MongoIdDto {
  @IsMongoId({ message: 'ID inválido' })
  id!: string;
}

export class ProductIdDto {
  @IsMongoId({ message: 'ID de producto inválido' })
  productId!: string;
}
