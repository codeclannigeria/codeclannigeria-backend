import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsAlphanumeric, MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';
import { BaseResDto } from '~shared/models/dto/base-res.dto';

export class TrackDto extends BaseResDto {
  @Expose()
  @MaxLength(columnSize.length32)
  @ApiProperty()
  @IsAlphanumeric()
  title: string;
  @Expose()
  @MaxLength(columnSize.length128)
  @ApiProperty()
  description: string;
}
