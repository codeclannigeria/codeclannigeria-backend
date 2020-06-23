import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ClassType } from '../../types/abstract.type';

export interface IBasePagedOutputDto<T> {
  totalCount: number;
  items: T[];
}

export function PagedOutputDto<T extends ClassType>(
  entityDto: T
): Type<IBasePagedOutputDto<T>> {
  class Paged implements IBasePagedOutputDto<T> {
    totalCount: number;
    @ApiProperty({ type: entityDto })
    items: T[];
  }

  return Paged;
}
