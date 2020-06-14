import { ApiProperty } from '@nestjs/swagger';
import { columnSize } from '@shared/constants';
import { Expose } from 'class-transformer';
import { IsMongoId, MaxLength } from 'class-validator';

export class CategoryDto {
  @Expose()
  @IsMongoId()
  @ApiProperty()
  id: string;
  @Expose()
  @MaxLength(columnSize.length32)
  @ApiProperty()
  name: string;
}
