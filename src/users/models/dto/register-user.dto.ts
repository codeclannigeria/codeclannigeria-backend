import { OmitType } from '@nestjs/swagger';
import { MinLength } from 'class-validator';

import { UserDto } from './user.dto';

export class RegisterUserDto extends OmitType(UserDto, [
  'id',
  'role',
  'createdAt',
  'updatedAt',
  'tracks',
  'photoUrl'
]) {
  @MinLength(6)
  password: string;
}

export class RegisterUserResDto {
  readonly canLogin: boolean;
}
