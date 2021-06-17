import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';
import { PagedListDto } from '~shared/models/dto';
import { BaseDto } from '~shared/models/dto/base.dto';

export class TrackDto extends BaseDto {
  @MaxLength(columnSize.length256)
  @Expose()
  @IsNotEmpty()
  title: string;
  @MaxLength(columnSize.length1024)
  @Expose()
  @IsNotEmpty()
  description: string;
  @ApiProperty({ readOnly: true })
  @Expose()
  @IsOptional()
  readonly thumbnailUrl?: string = null;
}
export class PagedTrackOutputDto extends PagedListDto(TrackDto) {}
