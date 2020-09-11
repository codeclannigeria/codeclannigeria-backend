import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsNotEmpty, MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';
import { PagedListDto } from '~shared/models/dto';
import { BaseDto } from '~shared/models/dto/base.dto';

import { StageDto } from '../../../stages/models/dtos/stage.dto';

@Exclude()
export class UserStageDto extends BaseDto {
  @MaxLength(columnSize.length32)
  @IsNotEmpty()
  @Expose()
  taskRemaining: number;
  @MaxLength(columnSize.length128)
  @Expose()
  isCompleted: boolean;
  @ApiProperty({ readOnly: true, type: StageDto })
  @Expose()
  @Type(() => StageDto)
  readonly stage: StageDto;
}
export class PagedUserStageDto extends PagedListDto(UserStageDto) {}
