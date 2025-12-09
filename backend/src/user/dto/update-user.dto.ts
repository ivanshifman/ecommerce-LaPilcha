import {
  IsString,
  IsOptional,
  MinLength,
  MaxLength,
  Matches,
  IsBoolean,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { UserPreferencesDto } from './preferences.user.dto';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  name?: string;

  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(255)
  lastName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[\d\s\-()]{8,20}$/, {
    message: 'Formato de teléfono inválido',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @Matches(/^https?:\/\/.*/, { message: 'Avatar debe ser una URL válida' })
  avatar?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => UserPreferencesDto)
  preferences?: UserPreferencesDto;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  emailVerified?: boolean;
}
