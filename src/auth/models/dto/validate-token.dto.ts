import { IsEmail, IsNotEmpty } from 'class-validator';

export class ValidateTokenInput {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  token: string;
}
