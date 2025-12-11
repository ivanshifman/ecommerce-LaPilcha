import { IsString, IsOptional } from 'class-validator';

export class JwtPayloadDto {
  @IsString()
  sub!: string;

  @IsString()
  email!: string;

  @IsOptional()
  @IsString({})
  role?: string;
}
