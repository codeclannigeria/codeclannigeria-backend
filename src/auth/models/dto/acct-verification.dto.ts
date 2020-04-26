import { IsUrl, IsEmail, IsNotEmpty } from 'class-validator';

export class AcctVerifyDto {
  @IsUrl()
  clientBaseUrl: string;
  @IsEmail()
  email: string;
  @IsNotEmpty()
  tokenParamName: string;
  @IsNotEmpty()
  emailParamName: string;
}

export class EmailVerifyDto {
  @IsEmail()
  email: string;
  @IsNotEmpty()
  token: string;
}
