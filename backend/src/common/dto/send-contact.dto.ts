import { IsString, IsEmail, IsOptional, MinLength, MaxLength, Matches } from 'class-validator';

export class SendContactDto {
  @IsString({ message: 'El nombre debe ser texto.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(255, { message: 'El nombre no puede exceder los 255 caracteres.' })
  @Matches(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios.',
  })
  name!: string;

  @IsEmail({}, { message: 'Email inválido' })
  email!: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+[1-9]\d{7,14}$/, {
    message: 'Formato de teléfono inválido',
  })
  phone?: string;

  @IsString()
  @MinLength(3, { message: 'El asunto debe tener al menos 3 caracteres' })
  @MaxLength(200, { message: 'El asunto no puede exceder 200 caracteres' })
  subject!: string;

  @IsString()
  @MinLength(10, { message: 'El mensaje debe tener al menos 10 caracteres' })
  @MaxLength(2000, { message: 'El mensaje no puede exceder 2000 caracteres' })
  message!: string;
}
