import { OmitType } from '@nestjs/swagger';
import { Exclude } from 'class-transformer';

import { TaskDto } from './task.dto';

@Exclude()
export class CreateTaskDto extends OmitType(TaskDto, [
  'createdAt',
  'updatedAt',
  'id'
]) {}
