import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsDate,
  IsMongoId,
  IsNotEmpty,
  IsOptional,
  MaxLength,
  MinDate
} from 'class-validator';
import { columnSize } from '~shared/constants';
import { BaseDto, PagedListDto } from '~shared/models/dto';

@Exclude()
export class TaskDto extends BaseDto {
  @MaxLength(columnSize.length256)
  @IsNotEmpty()
  @Expose()
  title: string;
  // @MaxLength(columnSize.length1024)
  @Expose()
  @IsNotEmpty()
  description: string;
  @IsMongoId()
  @Expose()
  track: string;
  @IsMongoId()
  @Expose()
  stage: string;
  @IsMongoId()
  @Expose()
  // @IsOptional()
  course: string;
  @Expose()
  @IsDate()
  @MinDate(new Date(), { message: 'Date must be in future' })
  @IsOptional()
  @ApiProperty({ type: Date })
  @Type(() => Date)
  deadline?: Date;
}
export class PagedListTaskDto extends PagedListDto(TaskDto) {}
