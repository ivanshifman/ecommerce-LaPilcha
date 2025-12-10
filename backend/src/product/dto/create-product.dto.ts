import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsIn,
  ValidateNested,
  Min,
  Max,
  MinLength,
  MaxLength,
  ArrayUnique,
  IsNotEmpty,
  IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSizeDto } from './create-size.dto';
import { ColorEnum } from '../common/enums/color.enum';
import { GenderEnum } from '../common/enums/gender.enum';

export class CreateProductDto {
  @IsString({ message: 'El nombre es obligatorio y debe ser texto.' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(200, { message: 'El nombre debe tener menos de 200 caracteres.' })
  name!: string;

  @IsNumber({}, { message: 'El precio debe ser un número.' })
  @Min(0, { message: 'El precio no puede ser negativo.' })
  price!: number;

  @IsString({ message: 'La descripción es obligatoria.' })
  @IsNotEmpty({ message: 'La descripción no puede estar vacía.' })
  description!: string;

  @IsString({ message: 'La categoría es obligatoria.' })
  @IsNotEmpty({ message: 'La categoría no puede estar vacía.' })
  category!: string;

  @IsString({ message: 'El código (code) es obligatorio.' })
  @IsNotEmpty({ message: 'El código (code) no puede estar vacío.' })
  code!: string;

  @IsOptional()
  @IsString({ message: 'La subcategoría debe ser texto.' })
  subcategory?: string;

  @IsOptional()
  @IsBoolean({ message: 'status debe ser booleano.' })
  status?: boolean;

  @IsOptional()
  @IsString({ message: 'El material debe ser texto.' })
  material?: string;

  @IsOptional()
  @IsString({ message: 'La marca debe ser texto.' })
  brand?: string;

  @IsOptional()
  @IsArray({ message: 'images debe ser un arreglo de strings.' })
  @ArrayUnique({ message: 'Las imágenes no deben repetirse.' })
  @IsString({ each: true, message: 'Las imágenes deben ser strings.' })
  @IsUrl({}, { each: true, message: 'Cada imagen debe ser una URL válida.' })
  images?: string[];

  @IsIn(Object.values(ColorEnum), { message: 'Color inválido.' })
  @IsNotEmpty({ message: 'El color no puede estar vacío.' })
  color!: string;

  @IsOptional()
  @IsNumber({}, { message: 'discount debe ser un número.' })
  @Min(0, { message: 'discount mínimo 0.' })
  @Max(100, { message: 'discount máximo 100.' })
  discount?: number;

  @IsOptional()
  @IsArray({ message: 'tags debe ser un arreglo.' })
  tags?: string[];

  @IsOptional()
  @IsIn(Object.values(GenderEnum), { message: 'gender inválido.' })
  gender?: string;

  @IsOptional()
  @IsString({ message: 'metaDescription debe ser texto.' })
  metaDescription?: string;

  @IsOptional()
  @IsBoolean({ message: 'featured debe ser booleano.' })
  featured?: boolean;

  @IsOptional()
  @IsNumber({}, { message: 'rating debe ser un número.' })
  @Min(0, { message: 'rating mínimo 0.' })
  @Max(5, { message: 'rating máximo 5.' })
  rating?: number;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSizeDto)
  sizes?: CreateSizeDto[];
}
