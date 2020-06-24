import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsEmail, IsEnum, MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';
import { BaseDto, PagedListDto } from '~shared/models/dto';

import { UserRole } from '../user.entity';

@Exclude()
export class UserDto extends BaseDto {
  @Expose()
  @MaxLength(columnSize.length64)
  firstName: string;
  @Expose()
  @MaxLength(columnSize.length64)
  lastName: string;
  @MaxLength(columnSize.length64)
  @IsEmail()
  @Expose()
  email: string;
  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole })
  @Expose()
  role?: UserRole = UserRole.MENTEE;
}

export class PagedUserOutputDto extends PagedListDto(UserDto) {}
