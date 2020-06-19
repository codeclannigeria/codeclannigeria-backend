import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';

export class BaseResDto {
  @Expose()
  @IsMongoId()
  @ApiProperty()
  id: string;
  @Expose()
  @ApiProperty()
  readonly updatedAt: Date;
  @Expose()
  @ApiProperty()
  readonly createdAt: Date;
}
