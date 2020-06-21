import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsAlphanumeric, MaxLength, IsUrl } from 'class-validator';
import { columnSize } from '~shared/constants';
import { BaseDto } from '~shared/models/dto/base.dto';
import { PagedOutputDto } from '~shared/models/dto';

export class CourseDto extends BaseDto {
  @Expose()
  @MaxLength(columnSize.length32)
  @ApiProperty()
  @IsAlphanumeric()
  title: string;
  @Expose()
  @MaxLength(columnSize.length128)
  @ApiProperty()
  description: string;
  @IsUrl()
  @MaxLength(columnSize.length256)
  playlistUrl: string;

  readonly enrollmentCount: number;
}
export class PagedCourseOutputDto extends PagedOutputDto(CourseDto) {}
