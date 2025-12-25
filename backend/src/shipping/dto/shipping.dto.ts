import {
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  IsBoolean,
  IsDateString,
} from 'class-validator';
import { ShippingMethod, ShippingStatus, ShippingZone } from '../enums/shipping.enum';

export class CreateShippingDto {
  @IsMongoId()
  orderId!: string;

  @IsEnum(ShippingMethod)
  method!: ShippingMethod;

  @IsNumber()
  @Min(0)
  cost!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @IsOptional()
  @IsString()
  carrier?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  estimatedDaysMin?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  estimatedDaysMax?: number;
}

export class UpdateShippingStatusDto {
  @IsEnum(ShippingStatus)
  status!: ShippingStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  note?: string;

  @IsOptional()
  @IsString()
  deliveredTo?: string;

  @IsOptional()
  @IsString()
  failureReason?: string;
}

export class UpdateTrackingDto {
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  carrier?: string;

  @IsOptional()
  @IsDateString()
  estimatedDeliveryDate?: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;

  @IsOptional()
  @IsString()
  labelUrl?: string;
}

export class CalculateShippingDto {
  @IsString()
  province!: string;

  @IsNumber()
  @Min(0)
  subtotal!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;
}

export class CreateShippingRateDto {
  @IsEnum(ShippingZone)
  zone!: ShippingZone;

  @IsEnum(ShippingMethod)
  method!: ShippingMethod;

  @IsNumber()
  @Min(0)
  basePrice!: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  pricePerKg?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  freeShippingThreshold?: number;

  @IsNumber()
  @Min(1)
  estimatedDaysMin!: number;

  @IsNumber()
  @Min(1)
  estimatedDaysMax!: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
