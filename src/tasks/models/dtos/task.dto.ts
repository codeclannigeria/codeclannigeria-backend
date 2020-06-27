import { Exclude, Expose } from 'class-transformer';
import { MaxLength, IsAlphanumeric, IsMongoId } from 'class-validator';
import { BaseDto, PagedListDto } from '~shared/models/dto';
import { columnSize } from '~shared/constants';

@Exclude()
export class TaskDto extends BaseDto {
  @MaxLength(columnSize.length32)
  @IsAlphanumeric()
  @Expose()
  title: string;
  @MaxLength(columnSize.length128)
  @Expose()
  description: string;
  @IsMongoId()
  @Expose()
  track: string;
  @IsMongoId()
  @Expose()
  stage: string;
  @Expose()
  deadline: Date;
}
export class PagedListTaskDto extends PagedListDto(TaskDto) {}
