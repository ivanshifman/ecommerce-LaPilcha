export class RegisterResponseDto {
  id!: string;
  name!: string;
  lastName?: string;
  email!: string;
  emailVerified!: boolean;
  message!: string;
}
