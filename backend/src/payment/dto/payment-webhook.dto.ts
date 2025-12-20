import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MercadoPagoWebhookDto {
  @IsString()
  @IsNotEmpty()
  action!: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsOptional()
  data?: {
    id: string;
  };
}

export class ModoWebhookDto {
  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsOptional()
  data?: Record<string, any>;
}
