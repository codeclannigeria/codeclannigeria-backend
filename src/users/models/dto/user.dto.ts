import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsEmail, IsEnum, MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';
import { BaseResDto } from '~shared/models/dto/base-res.dto';

import { UserRole } from '../user.entity';

export class UserDto extends BaseResDto {
  @Expose()
  @MaxLength(columnSize.length64)
  @ApiProperty()
  firstName: string;
  @Expose()
  @MaxLength(columnSize.length64)
  @ApiProperty()
  lastName: string;
  @Expose()
  @ApiProperty()
  @IsEmail()
  @MaxLength(columnSize.length64)
  email: string;
  @ApiProperty({ enum: UserRole })
  @IsEnum(UserRole)
  @Expose()
  role: UserRole = UserRole.MENTEE;
}
