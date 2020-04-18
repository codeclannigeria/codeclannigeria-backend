import { UserDto } from './user.dto';
import { OmitType } from '@nestjs/swagger';

export class CreateUserDto extends OmitType(UserDto, ['id']) {}
