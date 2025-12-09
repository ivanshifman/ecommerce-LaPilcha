import { IsEmail, IsEnum, IsOptional, IsString, Matches } from 'class-validator';
import { AuthProvider } from '../../user/dto/create-user.dto';

export class OAuthUserDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEmail()
  email!: string;

  @IsEnum([AuthProvider.GOOGLE, AuthProvider.APPLE])
  authProvider!: AuthProvider.GOOGLE | AuthProvider.APPLE;

  @IsString()
  providerId!: string;

  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\/.*/, { message: 'Avatar debe ser una URL válida' })
  avatar?: string;
}
