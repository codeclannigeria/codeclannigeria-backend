import { ApiProperty, PickType } from '@nestjs/swagger';
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
import { Task } from '../task.entity';
import { TaskDto } from './task.dto';

class SimpleUserDto extends PickType(UserDto, [
  'firstName',
  'lastName',
  'id'
]) {}
class SimpleTaskDto extends PickType(TaskDto, ['title', 'id']) {}
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
  @Transform((user: User) => ({
    firstName: user.firstName,
    lastName: user.lastName,
    id: user.id
  }))
  readonly mentor: SimpleUserDto;
  @Expose()
  @Transform((user: User) => ({
    firstName: user.firstName,
    lastName: user.lastName,
    id: user.id
  }))
  readonly mentee: SimpleUserDto;
  @Expose()
  @Transform((task: Task) => ({ title: task.title, id: task.id }))
  readonly task: SimpleTaskDto;
}

export class PagedListSubmissionDto extends PagedListDto(SubmissionDto) {}
