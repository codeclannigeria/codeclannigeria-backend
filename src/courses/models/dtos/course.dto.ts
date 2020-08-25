import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';
import { IsNotEmpty, IsUrl, MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';
import { PagedListDto } from '~shared/models/dto';
import { BaseDto } from '~shared/models/dto/base.dto';

@Exclude()
export class CourseDto extends BaseDto {
  @Expose()
  @MaxLength(columnSize.length256)
  @ApiProperty()
  @IsNotEmpty()
  title: string;
  @Expose()
  @MaxLength(columnSize.length1024)
  @IsNotEmpty()
  @ApiProperty()
  description: string;
  @IsUrl()
  @MaxLength(columnSize.length256)
  @IsNotEmpty()
  @Expose()
  playlistUrl: string;

  @Expose()
  @ApiProperty({ readOnly: true })
  readonly enrollmentCount: number;
}
export class PagedCourseOutputDto extends PagedListDto(CourseDto) { }
