import { ApiProperty } from '@nestjs/swagger';
import { IsMongoId } from 'class-validator';

export class BaseDto {
  @IsMongoId()
  readonly id: string;
  @ApiProperty()
  readonly updatedAt: Date;
  @ApiProperty()
  readonly createdAt: Date;
}
