import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { MaxLength, IsAlphanumeric } from 'class-validator';
import { columnSize } from '~shared/constants';
import { BaseResDto } from '~shared/models/dto/base-res.dto';

export class CategoryDto extends BaseResDto {
  @Expose()
  @MaxLength(columnSize.length32)
  @ApiProperty()
  @IsAlphanumeric()
  name: string;
}
