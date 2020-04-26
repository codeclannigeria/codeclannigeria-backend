import { IsNotEmpty } from 'class-validator';

export class ResetPwDto {
  @IsNotEmpty()
  token: string;
  @IsNotEmpty()
  newPassword: string;
}
