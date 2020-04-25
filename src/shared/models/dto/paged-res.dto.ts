import { ClassType } from '../../types/abstract.type';
import { ApiProperty } from '@nestjs/swagger';

export function PaginatedResDto<T extends ClassType>(entityDto: T): any {
  class Paged {
    @ApiProperty()
    totalCount: number;
    @ApiProperty({
      type: entityDto,
      isArray: true,
    })
    items: T[];
  }

  return Paged;
}
