import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

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
  @IsOptional()
  skip?: number = 0;
  @IsOptional()
  limit?: number = 100;
  @IsOptional()
  search?: string;
}

export function PaginatedResponseDto<T extends ClassType>(Dto: T) {
  class Paged extends Dto {
    totalCount: number;
    items: T[];
  }

  return Paged;
}
