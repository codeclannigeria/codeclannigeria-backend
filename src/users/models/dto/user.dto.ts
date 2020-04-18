import { columnSize } from '../../../shared/constants';
import { IsEmail, IsMongoId, MaxLength, IsAlpha } from 'class-validator';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

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
  @ApiProperty()
  @MaxLength(columnSize.length64)
  password: string;
  @Expose()
  @ApiProperty()
  @IsEmail()
  @MaxLength(columnSize.length64)
  email: string;
}
