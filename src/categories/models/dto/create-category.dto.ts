import { OmitType } from '@nestjs/swagger';

import { CategoryDto } from './category.dto';

export class CreateCategoryDto extends OmitType(CategoryDto, ['id']) {}
