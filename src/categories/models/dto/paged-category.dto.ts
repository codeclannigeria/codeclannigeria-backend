import { PagedResDto } from '~shared/models/dto/paged-res.dto';
import { CategoryDto } from './category.dto';

export class PagedCategoryResDto extends PagedResDto(CategoryDto) {}
