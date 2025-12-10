import { IsEmail, IsEnum, IsOptional, IsString, IsUrl } from 'class-validator';
import { AuthProvider } from '../../user/common/enums/authProvider.enum';

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
  @IsUrl()
  avatar?: string;
}
