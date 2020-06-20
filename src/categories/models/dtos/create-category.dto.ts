import { PickType } from '@nestjs/swagger';

import { CategoryDto } from './category.dto';

export class CreateCategoryDto extends PickType(CategoryDto, ['name']) {}
