import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import {
  IsNumber,
  IsOptional,
  IsUrl,
  Max,
  MaxLength,
  Min
} from 'class-validator';
import { UserDto } from '~/users/models/dto/user.dto';
import { columnSize } from '~shared/constants';
import { BaseDto, PagedListDto } from '~shared/models/dto';

import { TaskDto } from './task.dto';

export class SimpleUserDto extends PickType(UserDto, [
  'firstName',
  'lastName',
  'id'
]) {}
export class SimpleTaskDto extends PickType(TaskDto, ['title', 'id']) {}
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
  @Expose()
  readonly mentor: SimpleUserDto;
  @Expose()
  readonly mentee: SimpleUserDto;
  @Expose()
  readonly task: SimpleTaskDto;
}

export class PagedListSubmissionDto extends PagedListDto(SubmissionDto) {}
