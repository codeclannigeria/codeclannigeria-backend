import { PickType } from '@nestjs/swagger';
import { Expose, Transform } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsUrl,
  Max,
  MaxLength,
  Min
} from 'class-validator';
import { columnSize } from '~shared/constants';
import { BaseDto, PagedListDto } from '~shared/models/dto';

import { UserDto } from '../../../users/models/dto/user.dto';
import { User } from '../../../users/models/user.entity';

class MenteeDto extends PickType(UserDto, ['firstName', 'lastName']) {}

export class SubmissionDto extends BaseDto {
  @MaxLength(columnSize.length1024)
  @IsOptional()
  @Expose()
  menteeComment?: string;
  @MaxLength(columnSize.length1024)
  @IsOptional()
  @Expose()
  mentorComment?: string;
  @IsUrl()
  @Expose()
  taskUrl: string;
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  @Max(100)
  @Expose()
  gradePercentage: number;
  // @Expose()
  // @Transform((user) => `${user.firstName} ${user.lastName}`)
  // mentor: UserDto;
  @Expose()
  @Transform((user: User) => ({
    firstName: user.firstName,
    lastName: user.lastName
  }))
  mentee: MenteeDto;
  // @Expose()
  // @Transform((task) => task.title)
  // task: TaskDto;
}

export class PagedListSubmissionDto extends PagedListDto(SubmissionDto) {}
