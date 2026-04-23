import { IsBoolean, IsEmail, IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from '../../user/common/enums/userRole.enum';

export class AuthenticatedUserDto {
  @IsString()
  id!: string;

  @IsEmail()
  email!: string;

  @IsEnum(UserRole)
  role!: UserRole;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;
}
