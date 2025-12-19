import {
  IsString,
  IsOptional,
  ValidateNested,
  IsEnum,
  MaxLength,
  MinLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentMethod } from '../enums/payment-method.enum';

export class ShippingAddressDto {
  @IsString()
  @MinLength(3, { message: 'El nombre completo debe tener al menos 3 caracteres' })
  @MaxLength(255)
  fullName!: string;

  @IsString()
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message: 'Formato de teléfono inválido. Debe incluir código de país (+54...)',
  })
  phone!: string;

  @IsString()
  @MinLength(5, { message: 'La dirección debe tener al menos 5 caracteres' })
  @MaxLength(500)
  address!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  city!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(100)
  state!: string;

  @IsString()
  @Matches(/^[0-9]{4,10}$/, {
    message: 'Código postal inválido',
  })
  zipCode!: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  country?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  additionalInfo?: string;
}

export class CreateOrderDto {
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress!: ShippingAddressDto;

  @IsOptional()
  @IsEnum(PaymentMethod, {
    message: 'Método de pago inválido',
  })
  paymentMethod?: PaymentMethod;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  notes?: string;
}
