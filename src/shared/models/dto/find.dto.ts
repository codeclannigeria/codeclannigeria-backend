import { IsJSON, IsOptional, Min } from 'class-validator';

export class FindDto {
  @IsOptional()
  @Min(0)
  skip?: number = 0;
  @IsOptional()
  @Min(1)
  limit?: number = 100;
  @IsOptional()
  @IsJSON()
  search?: string;
  @IsJSON()
  @IsOptional()
  opts?: string;
}
