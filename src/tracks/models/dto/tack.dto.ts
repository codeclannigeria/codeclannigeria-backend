import { ApiProperty } from '@nestjs/swagger';
import { columnSize } from '@shared/constants';
import { Expose } from 'class-transformer';
import { IsMongoId, MaxLength } from 'class-validator';

export class TrackDto {
  @Expose()
  @IsMongoId()
  @ApiProperty()
  id: string;
  @Expose()
  @MaxLength(columnSize.length32)
  @ApiProperty()
  title: string;
  @Expose()
  @MaxLength(columnSize.length128)
  @ApiProperty()
  description: string;
}
