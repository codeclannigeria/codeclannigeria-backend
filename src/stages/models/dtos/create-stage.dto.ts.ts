import { PickType } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';

import { StageDto } from './stage.dto.ts';

export class CreateStageDto extends PickType(StageDto, [
  'title',
  'description',
  'taskCount'
]) {
  @IsMongoId()
  @Expose()
  track: string;
}
