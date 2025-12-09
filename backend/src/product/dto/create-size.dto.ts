import { IsNumber, Min, IsOptional, IsNotEmpty, IsIn } from 'class-validator';
import { SizeEnum } from '../common/enums/size.enum';

export class CreateSizeDto {
  @IsIn(Object.values(SizeEnum), { message: 'Talle inválido.' })
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
