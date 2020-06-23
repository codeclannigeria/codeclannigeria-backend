import { IsJSON, IsOptional } from 'class-validator';

export class PagedEntityInputDto {
  @IsOptional()
  skip?: number = 0;
  @IsOptional()
  limit?: number = 100;
  @IsOptional()
  @IsJSON()
  search?: string;
  @IsJSON()
  @IsOptional()
  opts?: string;
}
