import {
  IsArray,
  IsEnum,
  IsMongoId,
  IsNumber,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ReturnReason } from '../enums/return-reason.enum';

export class ReturnItemDto {
  @IsMongoId()
  product!: string;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  color?: string;

  @IsNumber()
  @Min(1)
  quantity!: number;

  @IsEnum(ReturnReason)
  reason!: ReturnReason;

  @IsOptional()
  @IsString()
  condition?: string;
}

export class CreateReturnDto {
  @IsMongoId()
  orderId!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ReturnItemDto)
  items!: ReturnItemDto[];

  @IsEnum(ReturnReason)
  primaryReason!: ReturnReason;

  @IsOptional()
  @IsString()
  customerComment?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  customerImages?: string[];
}
