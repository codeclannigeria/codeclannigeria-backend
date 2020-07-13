import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsAlphanumeric, IsInt, IsOptional, MaxLength, Min } from 'class-validator';
import { columnSize } from '~shared/constants';
import { PagedListDto } from '~shared/models/dto';
import { BaseDto } from '~shared/models/dto/base.dto';

import { TrackDto } from '../../../tracks/models/dto/track.dto';

@Exclude()
export class StageDto extends BaseDto {
  @MaxLength(columnSize.length32)
  @IsAlphanumeric()
  @Expose()
  title: string;
  @MaxLength(columnSize.length128)
  @Expose()
  description: string;
  @Expose()
  @Min(0)
  @IsInt()
  @IsOptional()
  taskCount?: number = 0;
  @Expose()
  @ApiProperty({ type: TrackDto, readOnly: true })
  @Type(() => TrackDto)
  readonly track: TrackDto;
}
export class PagedListStageDto extends PagedListDto(StageDto) { }
