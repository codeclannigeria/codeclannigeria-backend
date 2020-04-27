import { IsNotEmpty, IsUrl } from 'class-validator';

export class AcctVerifyDto {
  @IsUrl()
  clientBaseUrl: string;
  @IsNotEmpty()
  tokenParamName: string;
}
