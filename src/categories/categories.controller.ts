import { BaseCrudController } from '~shared/controllers';

import { Category } from './models/category.entity';
import { CategoryDto, PagedCategoryOutDto } from './models/dtos/category.dto';
import { CreateCategoryDto } from './models/dtos/create-category.dto';

export class CategoriesController extends BaseCrudController<
  Category,
  CategoryDto,
  CreateCategoryDto
>({
  auth: true,
  createDto: CreateCategoryDto,
  updateDto: CreateCategoryDto,
  entity: Category,
  pagedOutputDto: PagedCategoryOutDto,
  entityDto: CategoryDto
}) {}
