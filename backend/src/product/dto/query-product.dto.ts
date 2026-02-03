import { Transform, Type } from 'class-transformer';
import { IsOptional, IsString, IsIn, IsNumber, Min, Max, IsEnum, IsBoolean } from 'class-validator';
import { GenderEnum } from '../common/enums/gender.enum';

export class QueryProductDto {
  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'La página debe ser numérica.' })
  @Min(1, { message: 'La página debe ser al menos 1.' })
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'El límite debe ser numérico.' })
  @Min(1, { message: 'El límite debe ser al menos 1.' })
  @Max(100, { message: 'El límite debe ser menor o igual a 100.' })
  limit?: number;

  @IsOptional()
  @IsString({ message: 'search debe ser texto.' })
  search?: string;

  @IsOptional()
  @IsString({ message: 'category debe ser texto.' })
  category?: string;

  @IsOptional()
  @IsString({ message: 'subcategory debe ser texto.' })
  subcategory?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') return value.trim().toLowerCase();
    return value;
  })
  color?: string;

  @IsOptional()
  @IsString()
  @Transform(({ value }: { value: unknown }) => {
    if (typeof value === 'string') return value.trim().toUpperCase();
    return value;
  })
  size?: string;

  @IsOptional()
  @IsString({ message: 'brand debe ser texto.' })
  brand?: string;

  @IsOptional()
  @IsEnum(GenderEnum)
  gender?: GenderEnum;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'priceMin debe ser numérico.' })
  @Min(0, { message: 'priceMin no puede ser negativo.' })
  priceMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber({}, { message: 'priceMax debe ser numérico.' })
  @Min(0, { message: 'priceMax no puede ser negativo.' })
  priceMax?: number;

  @IsOptional()
  @IsIn(['price', 'salesCount', 'rating', 'createdAt'], { message: 'sortBy inválido.' })
  sortBy?: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  onDiscount?: boolean;

  @IsOptional()
  @IsIn(['asc', 'desc'], { message: 'order debe ser asc o desc.' })
  order?: string;
}
