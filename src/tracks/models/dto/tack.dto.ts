import { Exclude, Expose } from 'class-transformer';
import { IsAlphanumeric, MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';
import { BaseDto } from '~shared/models/dto/base.dto';
import { PagedOutputDto } from '~shared/models/dto';

@Exclude()
export class TrackDto extends BaseDto {
  @MaxLength(columnSize.length32)
  @IsAlphanumeric()
  @Expose()
  title: string;
  @MaxLength(columnSize.length128)
  @Expose()
  description: string;
}
export class PagedTrackOutputDto extends PagedOutputDto(TrackDto) {}
