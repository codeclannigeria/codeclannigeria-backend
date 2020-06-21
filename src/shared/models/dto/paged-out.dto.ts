import { ClassType } from '../../types/abstract.type';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from '@nestjs/common';

export interface IPagedOutputDto<T> {
  totalCount: number;

  items: T[];
}

export function PagedOutputDto<T extends ClassType>(
  entityDto: T
): Type<IPagedOutputDto<T>> {
  class Paged implements IPagedOutputDto<T> {
    totalCount: number;
    @ApiProperty({
      type: entityDto
    })
    items: T[];
  }

  return Paged;
}
