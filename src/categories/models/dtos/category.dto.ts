import { Exclude, Expose } from 'class-transformer';
import { MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';
import { BaseDto, PagedListDto } from '~shared/models/dto';

@Exclude()
export class CategoryDto extends BaseDto {
  @MaxLength(columnSize.length32)
  @Expose()
  name: string;
  @MaxLength(columnSize.length128)
  @Expose()
  description: string;
}
export class PagedCategoryOutDto extends PagedListDto(CategoryDto) {}
