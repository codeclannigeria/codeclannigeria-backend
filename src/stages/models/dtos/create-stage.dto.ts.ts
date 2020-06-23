import { PickType } from '@nestjs/swagger';

import { StageDto } from './stage.dto.ts';

export class CreateStageDto extends PickType(StageDto, [
  'title',
  'description',
  'taskCount'
]) {}
