import { IsString, IsEnum } from 'class-validator';
import { UserRole } from '../../user/common/enums/userRole.enum';

export class JwtPayloadDto {
  @IsString()
  sub!: string;

  @IsString()
  email!: string;

  @IsEnum(UserRole)
  role!: UserRole;
}
