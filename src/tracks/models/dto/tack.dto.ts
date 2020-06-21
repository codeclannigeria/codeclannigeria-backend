import { IsAlphanumeric, MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';
import { BaseDto } from '~shared/models/dto/base.dto';
import { PagedOutputDto } from '~shared/models/dto';

export class TrackDto extends BaseDto {
  @MaxLength(columnSize.length32)
  @IsAlphanumeric()
  title: string;
  @MaxLength(columnSize.length128)
  description: string;
}
export class PagedTrackOutputDto extends PagedOutputDto(TrackDto) {}
