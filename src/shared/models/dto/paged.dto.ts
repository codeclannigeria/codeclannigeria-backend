import { Exclude, Type } from 'class-transformer';
import { IsOptional, IsNumber, IsArray } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export type ClassType<T = any> = new (...args: any[]) => T;

export class PagedResDto<T> {
  constructor(totalCount: number, items: T[], type: Function) {
    this.items = items;
    this.type = type;
    this.totalCount = totalCount;
  }
  @Exclude()
  private type: Function;
  @ApiProperty()
  totalCount: number;
  @ApiProperty({
    isArray: true,
    type: this.type,
  })
  // @Type(options => {
  //   return (options.newObject as PagedResDto<T>).type;
  // })
  items: T[];
}
export interface IPaged<T> {
  totalCount: number;
  items: T[];
}
export class PagedReqDto {
  @IsOptional()
  skip?: number = 0;
  @IsOptional()
  limit?: number = 100;
  @IsOptional()
  search?: string;
}

export function PaginatedResponseDto<T extends ClassType>(entityDto: T): any {
  class Paged extends entityDto implements IPaged<T> {
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
