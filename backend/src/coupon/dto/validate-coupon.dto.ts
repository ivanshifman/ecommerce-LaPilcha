import { IsString, IsNumber, IsOptional, IsMongoId, Min, IsEmail } from 'class-validator';

export class ValidateCouponDto {
  @IsString()
  code!: string;

  @IsNumber()
  @Min(0)
  orderTotal!: number;

  @IsOptional()
  @IsMongoId()
  userId?: string;

  @IsOptional()
  @IsEmail()
  guestEmail?: string;

  @IsOptional()
  @IsString({ each: true })
  cartCategories?: string[];

  @IsOptional()
  @IsMongoId({ each: true })
  cartProducts?: string[];
}
