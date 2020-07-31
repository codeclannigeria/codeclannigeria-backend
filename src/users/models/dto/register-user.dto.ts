import { PickType } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

import { UserDto } from './user.dto';

export class RegisterUserDto extends PickType(UserDto, [
  'firstName',
  'lastName',
  'email'
]) {
  @MinLength(6)
  password: string;
}

export class RegisterUserResDto {
  readonly canLogin: boolean;
}
