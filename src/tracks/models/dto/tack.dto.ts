import { Exclude, Expose } from 'class-transformer';
import { IsAlphanumeric, IsMongoId, MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';
import { PagedListDto } from '~shared/models/dto';
import { BaseDto } from '~shared/models/dto/base.dto';

@Exclude()
export class TrackDto extends BaseDto {
  @MaxLength(columnSize.length32)
  @IsAlphanumeric()
  @Expose()
  title: string;
  @MaxLength(columnSize.length128)
  @Expose()
  description: string;

  @Expose()
  @IsMongoId()
  stage: string;
}
export class PagedTrackOutputDto extends PagedListDto(TrackDto) {}
