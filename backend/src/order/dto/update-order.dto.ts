import { IsEnum, IsOptional, IsString, MaxLength, IsDateString } from 'class-validator';
import { OrderStatus } from '../enums/order-status.enum';

export class CancelOrderDto {
  @IsString()
  @MaxLength(500)
  reason!: string;
}

export class UpdateOrderStatusDto {
  @IsEnum(OrderStatus, {
    message: 'Estado de orden inválido',
  })
  status!: OrderStatus;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}

export class UpdateShippingDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  trackingNumber?: string;

  @IsOptional()
  @IsDateString()
  estimatedDelivery?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000)
  adminNotes?: string;
}
