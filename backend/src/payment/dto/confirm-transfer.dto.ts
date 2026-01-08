import { IsString, IsOptional, MaxLength } from 'class-validator';

export class ConfirmBankTransferDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  transactionReference?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
