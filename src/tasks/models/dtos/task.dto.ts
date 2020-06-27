import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Type } from 'class-transformer';
import {
  IsAlphanumeric,
  IsDate,
  IsMongoId,
  IsOptional,
  MaxLength,
  MinDate,
  IsISO8601
} from 'class-validator';
import { columnSize } from '~shared/constants';
import { BaseDto, PagedListDto } from '~shared/models/dto';

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
  @IsDate()
  @MinDate(new Date(), { message: 'Date must be in future' })
  @IsOptional()
  @ApiProperty({ type: Date })
  @Type(() => Date)
  deadline?: Date;
}
export class PagedListTaskDto extends PagedListDto(TaskDto) {}
