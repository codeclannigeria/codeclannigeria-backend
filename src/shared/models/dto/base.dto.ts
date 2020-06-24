import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId } from 'class-validator';

export class BaseDto {
  @IsMongoId()
  @Expose()
  readonly id: string;
  @ApiProperty()
  @Expose()
  readonly updatedAt: Date;
  @ApiProperty()
  @Expose()
  readonly createdAt: Date;
}
