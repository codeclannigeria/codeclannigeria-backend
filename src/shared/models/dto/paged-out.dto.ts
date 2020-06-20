import { ClassType } from '../../types/abstract.type';
import { ApiProperty } from '@nestjs/swagger';

export function PagedOutputDto<T extends ClassType>(entityDto: T): any {
  class Paged {
    totalCount: number;
    @ApiProperty({
      type: entityDto
    })
    items: T[];
  }

  return Paged;
}
