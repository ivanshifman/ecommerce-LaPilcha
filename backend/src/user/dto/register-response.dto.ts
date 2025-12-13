import { UserResponseDto } from '../../auth/dto/auth-response.dto';

export class RegisterResponseDto extends UserResponseDto {
  message!: string;
}
