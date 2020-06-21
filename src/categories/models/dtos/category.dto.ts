import { MaxLength } from 'class-validator';
import { columnSize } from '~shared/constants';
import { BaseDto, PagedOutputDto } from '~shared/models/dto';

export class CategoryDto extends BaseDto {
  @MaxLength(columnSize.length32)
  name: string;
  @MaxLength(columnSize.length128)
  description: string;
}
export class PagedCategoryOutDto extends PagedOutputDto(CategoryDto) {}
