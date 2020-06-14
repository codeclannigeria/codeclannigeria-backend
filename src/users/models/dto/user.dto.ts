import { Expose } from 'class-transformer';
import {
  IsAlpha,
  IsEmail,
  IsEnum,
  IsMongoId,
  MaxLength,
} from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { columnSize } from '../../../shared/constants';
import { UserRole } from '../user.entity';

export class UserDto {
  @Expose()
  @IsMongoId()
  @ApiProperty()
  id: string;
  @Expose()
  @MaxLength(columnSize.length64)
  @ApiProperty()
  @IsAlpha()
  firstName: string;
  @Expose()
  @MaxLength(columnSize.length64)
  @ApiProperty()
  @IsAlpha()
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
