import { Exclude, Expose } from 'class-transformer';
import { IsInt, IsNotEmpty, IsOptional, MaxLength, Min } from 'class-validator';
import { columnSize } from '~shared/constants';
import { PagedListDto } from '~shared/models/dto';
import { BaseDto } from '~shared/models/dto/base.dto';

@Exclude()
export class StageOnlyDto extends BaseDto {
  @MaxLength(columnSize.length32)
  @IsNotEmpty()
  @Expose()
  title: string;
  @MaxLength(columnSize.length128)
  @Expose()
  description: string;
  @Expose()
  @Min(0)
  @IsInt()
  @IsOptional()
  taskCount?: number = 1;
}
export class PagedListStageDto extends PagedListDto(StageOnlyDto) {}
