import { Type } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

import { ClassType } from '../../types/abstract.type';

export interface IPagedListDto<T> {
  totalCount: number;
  items: T[];
}

export function PagedListDto<T extends ClassType>(
  entityDto: T
): Type<IPagedListDto<T>> {
  class Paged implements IPagedListDto<T> {
    totalCount: number;
    @ApiProperty({ type: entityDto, isArray: true })
    items: T[];
  }

  return Paged;
}
