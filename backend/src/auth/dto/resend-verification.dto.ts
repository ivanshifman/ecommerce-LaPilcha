import { IsMongoId, IsNotEmpty } from 'class-validator';

export class ResendVerificationDto {
  @IsNotEmpty({ message: 'El ID de usuario es requerido' })
  @IsMongoId({ message: 'El ID de usuario debe ser válido' })
  userId!: string;
}
