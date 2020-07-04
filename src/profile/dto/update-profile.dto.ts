import { OmitType } from '@nestjs/swagger';

import { CreateUserDto } from '../../users/models/dto/create-user.dto';

export class UpdateProfileDto extends OmitType(CreateUserDto, ['email', 'role']) { }