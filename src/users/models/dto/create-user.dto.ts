import { OmitType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, Min } from 'class-validator';
import { UserDto } from './user.dto';

export class CreateUserDto extends OmitType(UserDto, ['id']) {
  @IsNotEmpty()
  @Min(6)
  @Expose()
  password: string;
}
