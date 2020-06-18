import { PickType } from '@nestjs/swagger';
import { IsNotEmpty, IsUrl } from 'class-validator';

import { LoginReqDto } from './auth.dto';

export class AcctVerifyDto extends PickType(LoginReqDto, ['email']) {
  @IsUrl()
  clientBaseUrl: string;
  @IsNotEmpty()
  tokenParamName: string;
  @IsNotEmpty()
  emailParamName: string;
}
