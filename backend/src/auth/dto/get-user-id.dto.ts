import { IsEmail, IsNotEmpty } from 'class-validator';

export class GetUserIdDto {
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email debe ser válido' })
  email!: string;
}
