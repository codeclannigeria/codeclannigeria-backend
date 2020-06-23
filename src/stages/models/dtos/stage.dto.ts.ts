import { Expose, Exclude } from 'class-transformer';
import { IsAlphanumeric, MaxLength, Min, IsInt } from 'class-validator';
import { columnSize } from '~shared/constants';
import { PagedListDto } from '~shared/models/dto';
import { BaseDto } from '~shared/models/dto/base.dto';

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
  taskCount: number;
}
export class PagedListStageDto extends PagedListDto(StageDto) {}
