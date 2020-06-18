import { PickType } from '@nestjs/swagger';

import { RegisterUserDto } from '../../../users/models/dto/register-user.dto';

export class LoginReqDto extends PickType(RegisterUserDto, [
  'email',
  'password'
]) {}

export class LoginResDto {
  accessToken: string;
}
