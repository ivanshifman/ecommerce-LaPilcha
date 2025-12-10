import { IsNumber, Min, IsOptional, IsNotEmpty, Matches } from 'class-validator';

export class CreateSizeDto {
  @Matches(/^([A-Z]{1,4}|[0-9]{1,3})$/, {
    message: 'Talle inválido.',
  })
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
