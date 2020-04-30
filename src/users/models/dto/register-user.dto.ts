import { OmitType } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

import { UserDto } from './user.dto';

export class RegisterUserDto extends OmitType(UserDto, ['id', 'role']) {
  @MinLength(6)
  password: string;
}
