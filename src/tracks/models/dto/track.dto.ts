import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import { IsAlphanumeric, IsNotEmpty, IsOptional, MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';
import { PagedListDto } from '~shared/models/dto';
import { BaseDto } from '~shared/models/dto/base.dto';
import { UserStageDto } from 'src/userstage/models/dto/userstage.dto';

@Exclude()
export class TrackDto extends BaseDto {
  @MaxLength(columnSize.length32)
  @IsAlphanumeric()
  @Expose()
  title: string;
  @MaxLength(columnSize.length128)
  @Expose()
  @IsNotEmpty()
  description: string;
  @ApiProperty({ readOnly: true })
  @Expose()
  @IsOptional()
  readonly thumbnailUrl?: string;
  @ApiProperty({ readOnly: true, type: [TrackDto], isArray: true })
  @Expose()
  @Type(() => UserStageDto)
  readonly userstage: UserStageDto[];

  
}
export class PagedTrackOutputDto extends PagedListDto(TrackDto) { }
