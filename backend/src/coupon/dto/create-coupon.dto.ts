import {
  IsString,
  IsEnum,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
  IsMongoId,
  IsBoolean,
  Min,
  Length,
  Matches,
} from 'class-validator';
import { CouponType } from '../enums/coupon-type.enum';

export class CreateCouponDto {
  @IsString()
  @Length(3, 20)
  @Matches(/^[A-Z0-9]+$/, {
    message: 'El código solo puede contener letras mayúsculas y números',
  })
  code!: string;

  @IsString()
  @Length(5, 200)
  description!: string;

  @IsEnum(CouponType)
  type!: CouponType;

  @IsOptional()
  @IsNumber()
  @Min(0)
  discountValue?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minPurchaseAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxDiscountAmount?: number;

  @IsDateString()
  startDate!: string;

  @IsDateString()
  endDate!: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimit?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  usageLimitPerUser?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  applicableCategories?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  applicableProducts?: string[];

  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  restrictedToUsers?: string[];

  @IsOptional()
  @IsBoolean()
  firstPurchaseOnly?: boolean;
}
