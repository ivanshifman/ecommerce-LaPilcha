import {
  IsString,
  IsEmail,
  MinLength,
  MaxLength,
  IsOptional,
  IsEnum,
  Matches,
  IsUrl,
} from 'class-validator';

export enum UserRole {
  ADMIN = 'admin',
  CUSTOMER = 'customer',
}

export enum AuthProvider {
  LOCAL = 'local',
  GOOGLE = 'google',
  APPLE = 'apple',
}

export class CreateUserDto {
  @IsString({ message: 'El nombre debe ser texto.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  @MaxLength(255, { message: 'El nombre no puede exceder los 255 caracteres.' })
  name!: string;

  @IsOptional()
  @IsString({ message: 'El apellido debe ser texto.' })
  @MinLength(3, { message: 'El apellido debe tener al menos 3 caracteres.' })
  @MaxLength(255, { message: 'El apellido no puede exceder los 255 caracteres.' })
  lastName?: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email!: string;

  @IsOptional()
  @IsString({ message: 'La contraseña debe ser texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.',
  })
  password?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[\d\s\-()]{8,20}$/, {
    message: 'Formato de teléfono inválido',
  })
  phone?: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  avatar?: string;

  @IsOptional()
  @IsEnum(UserRole)
  role?: UserRole;

  @IsOptional()
  @IsEnum(AuthProvider)
  authProvider?: AuthProvider;

  @IsOptional()
  @IsString()
  googleId?: string;

  @IsOptional()
  @IsString()
  appleId?: string;
}

export class RegisterDto {
  @IsString({ message: 'El nombre debe ser texto.' })
  @MinLength(3, { message: 'El nombre debe tener al menos 3 caracteres.' })
  name!: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email!: string;

  @IsString({ message: 'La contraseña debe ser texto.' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, {
    message: 'La contraseña debe contener al menos una mayúscula, una minúscula y un número.',
  })
  password!: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[\d\s\-()]{8,20}$/, {
    message: 'Formato de teléfono inválido',
  })
  phone?: string;
}
