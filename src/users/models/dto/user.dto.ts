import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import {
  IsArray,
  IsDate,
  IsEmail,
  IsEnum,
  IsOptional,
  IsPhoneNumber,
  Length,
  MaxLength
} from 'class-validator';
import { TrackDto } from '~/tracks/models/dto/track.dto';
import { columnSize } from '~shared/constants';
import { BaseDto, PagedListDto } from '~shared/models/dto';

import { Gender, UserRole } from '../user.entity';

export class UserDto extends BaseDto {
  @Expose()
  @MaxLength(columnSize.length64)
  firstName: string;

  @Expose()
  @MaxLength(columnSize.length64)
  lastName: string;

  @Expose()
  @MaxLength(columnSize.length64)
  @IsEmail()
  email: string;

  @Expose()
  @IsEnum(UserRole)
  @ApiProperty({ enum: UserRole })
  role?: UserRole = UserRole.MENTEE;

  @Expose()
  @IsOptional()
  @MaxLength(columnSize.length128)
  description?: string;

  @Expose()
  @MaxLength(columnSize.length64)
  city: string;

  @Expose()
  @MaxLength(columnSize.length64)
  country: string;

  @Expose()
  @IsEnum(Gender)
  @ApiProperty({ enum: Gender })
  gender: Gender;

  @Expose()
  @IsDate()
  @ApiProperty({ type: Date })
  @Type(() => Date)
  dob: Date;

  @Expose()
  @IsPhoneNumber('ZZ', {
    message: 'Invalid phone number. Valid phone number sample +2347063644568'
  })
  @MaxLength(columnSize.length64)
  @IsOptional()
  phoneNumber?: string;

  @Expose()
  @IsArray()
  @Length(1, columnSize.length32, { each: true })
  @ApiProperty({ isArray: true, type: String })
  @IsOptional()
  technologies?: string[];

  @ApiProperty({ readOnly: true })
  @Expose()
  @IsOptional()
  readonly photoUrl?: string;

  @ApiProperty({ readOnly: true })
  @Expose()
  @IsOptional()
  readonly notifyCount: number;

  @ApiProperty({ readOnly: true })
  @Expose()
  @IsOptional()
  readonly notifUnreadCount: number;

  @ApiProperty({ readOnly: true, type: [TrackDto] })
  @Expose()
  @Type(() => TrackDto)
  readonly tracks: TrackDto[];
}

export class PagedUserOutputDto extends PagedListDto(UserDto) {}
