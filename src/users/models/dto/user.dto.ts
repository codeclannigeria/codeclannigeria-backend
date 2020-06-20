import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';
import { BaseDto, PagedOutputDto } from '~shared/models/dto';

import { UserRole } from '../user.entity';

export class UserDto extends BaseDto {
  @MaxLength(columnSize.length64)
  firstName: string;
  @MaxLength(columnSize.length64)
  lastName: string;
  @MaxLength(columnSize.length64)
  @IsEmail()
  email: string;
  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole })
  role?: UserRole = UserRole.MENTEE;
}

export class PagedUserOutputDto extends PagedOutputDto(UserDto) {}
