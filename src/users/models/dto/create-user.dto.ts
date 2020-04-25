import { Min } from 'class-validator';

import { OmitType } from '@nestjs/swagger';

import { UserDto } from './user.dto';

export class CreateUserDto extends OmitType(UserDto, ['id']) {
  @Min(6)
  password: string;
}
