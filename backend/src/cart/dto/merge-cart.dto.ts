import { IsString } from 'class-validator';

export class MergeCartDto {
  @IsString()
  anonymousCartId!: string;
}
