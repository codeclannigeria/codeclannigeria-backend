import { PickType } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

import { LoginReqDto } from './auth.dto';

export class ValidateTokenInput extends PickType(LoginReqDto, ['email']) {
  @IsNotEmpty()
  token: string;
}
