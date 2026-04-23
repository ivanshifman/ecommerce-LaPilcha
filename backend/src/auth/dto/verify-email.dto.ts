import { IsMongoId, IsNotEmpty, IsString, Length, Matches } from 'class-validator';

export class VerifyEmailDto {
  @IsNotEmpty({ message: 'El ID de usuario es requerido' })
  @IsMongoId({ message: 'El ID de usuario debe ser válido' })
  userId!: string;

  @IsNotEmpty({ message: 'El código de verificación es requerido' })
  @IsString({ message: 'El código debe ser un texto' })
  @Length(6, 6, { message: 'El código debe tener exactamente 6 dígitos' })
  @Matches(/^\d{6}$/, { message: 'El código debe contener solo números' })
  code!: string;
}
