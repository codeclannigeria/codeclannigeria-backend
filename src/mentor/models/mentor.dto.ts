import { PickType } from '@nestjs/swagger';

import { UserDto } from '../../users/models/dto/user.dto';

export class MentorDto extends PickType(UserDto, [
  'firstName',
  'lastName',
  'technologies',
  'photoUrl',
  'description',
  'id',
  'city',
  'country',
  'description',
  'phoneNumber',
  'gender',
  'email',
  'tracks'
]) {}
