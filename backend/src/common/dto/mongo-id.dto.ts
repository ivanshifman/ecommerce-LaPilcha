import { IsMongoId } from 'class-validator';

export class MongoIdDto {
  @IsMongoId({ message: 'ID inválido' })
  id!: string;
}

export class ProductIdDto {
  @IsMongoId({ message: 'ID de producto inválido' })
  productId!: string;
}

export class OrderIdDto {
  @IsMongoId({ message: 'ID de orden inválido' })
  orderId!: string;
}
