import { ApiProperty } from '@nestjs/swagger';

export type ClassType<T = any> = new (...args: any[]) => T;

export abstract class PagedResDto<T> {
  @ApiProperty()
  totalCount: number;
  @ApiProperty({
    isArray: true,
  })
  abstract items: T[];
}

export class PagedReqDto {
  skip?: number;
  limit?: number;
  search?: string;
}

interface IPaginated {
  skip?: number;
  limit?: number;
  search?: string;
}

export function PaginatedResponseDto<T extends ClassType>(Dto: T) {
  class Paged extends Dto {
    totalCount: number;
    items: T[];
  }

  return Paged;
}
