import { ArrayMaxSize, IsArray, IsOptional, IsString, MaxLength } from 'class-validator';

export class UserPreferencesDto {
  @IsOptional()
  @IsString()
  @MaxLength(10)
  defaultSize?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(10)
  favoriteColors?: string[];
}
