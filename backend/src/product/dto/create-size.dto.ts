import { IsString, IsNumber, Min, IsOptional, IsNotEmpty } from 'class-validator';

export class CreateSizeDto {
  @IsString({ message: 'El talle debe ser texto.' })
  @IsNotEmpty({ message: 'El talle no puede estar vacío.' })
  size!: string;

  @IsNumber({}, { message: 'El stock debe ser un número.' })
  @Min(0, { message: 'El stock no puede ser negativo.' })
  stock!: number;

  @IsOptional()
  @IsNumber({}, { message: 'minStock debe ser un número.' })
  @Min(0, { message: 'minStock no puede ser negativo.' })
  minStock?: number;
}
