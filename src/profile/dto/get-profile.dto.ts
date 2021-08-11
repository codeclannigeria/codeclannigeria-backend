import { PickType } from '@nestjs/swagger';

import { UserDto } from '../../users/models/dto/user.dto';

export class GetUserDto extends PickType(UserDto, [
  'firstName',
  'lastName',
  'technologies',
  'description',
  'id',
  'city',
  'country',
  'description',
  'gender',
  'tracks'
]) {}
