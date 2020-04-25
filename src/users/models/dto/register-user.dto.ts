import { OmitType } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

import { UserDto } from './user.dto';
import { Expose } from 'class-transformer';

export class RegisterUserDto extends OmitType(UserDto, ['id', 'role']) {
  @MinLength(6)
  @Expose()
  password: string;
}
