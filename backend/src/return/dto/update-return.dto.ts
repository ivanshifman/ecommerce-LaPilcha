import { IsBoolean, IsEnum, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ReturnStatus } from '../enums/return-status.enum';
import { ReturnResolution } from '../enums/return-reason.enum';

export class UpdateReturnStatusDto {
  @IsEnum(ReturnStatus)
  status!: ReturnStatus;

  @IsOptional()
  @IsString()
  note?: string;
}

export class ApproveReturnDto {
  @IsOptional()
  @IsNumber()
  @Min(0)
  approvedAmount?: number;

  @IsOptional()
  @IsEnum(ReturnResolution)
  resolution?: ReturnResolution;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}

export class RejectReturnDto {
  @IsString()
  rejectionReason!: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}

export class InspectReturnDto {
  @IsString()
  inspectionNotes!: string;

  @IsBoolean()
  approveRefund!: boolean;

  @IsOptional()
  @IsNumber()
  @Min(0)
  approvedAmount?: number;
}
