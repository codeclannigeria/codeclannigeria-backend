import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsMongoId, IsOptional } from 'class-validator';

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

export class DeleteType {
  @Expose()
  @IsOptional()
  @ApiProperty({ default: false })
  isHardDelete?: boolean = false;
}
export class DeleteManyType {
  @IsMongoId({ each: true })
  @Expose()
  @ApiProperty({ isArray: true, type: String })
  ids: string[];
}
