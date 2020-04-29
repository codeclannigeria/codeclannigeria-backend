import { IsNotEmpty, IsUrl, IsEmail } from 'class-validator';

export class AcctVerifyDto {
  @IsEmail()
  email: string;
  @IsUrl()
  clientBaseUrl: string;
  @IsNotEmpty()
  tokenParamName: string;
  @IsNotEmpty()
  emailParamName: string;
}
