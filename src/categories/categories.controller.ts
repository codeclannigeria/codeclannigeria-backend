import {
  Body,
  ConflictException,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';
import { BaseCrudController } from '~shared/controllers';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { UserRole } from '../users/models/user.entity';
import { CategoriesService } from './categories.service';
import { Category } from './models/category.entity';
import { CategoryDto, PagedCategoryOutDto } from './models/dtos/category.dto';
import { CreateCategoryDto } from './models/dtos/create-category.dto';

export class CategoriesController extends BaseCrudController<
  Category,
  CategoryDto,
  CreateCategoryDto
>({
  auth: {
    update: [UserRole.ADMIN, UserRole.MENTOR],
    delete: [UserRole.ADMIN, UserRole.MENTOR]
  },
  createDto: CreateCategoryDto,
  updateDto: CreateCategoryDto,
  entity: Category,
  pagedOutputDto: PagedCategoryOutDto,
  entityDto: CategoryDto
}) {
  constructor(protected readonly service: CategoriesService) {
    super(service);
  }

  @Post()
  @ApiResponse({ type: CategoryDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MENTOR)
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async create(@Body() input: CreateCategoryDto): Promise<CategoryDto> {
    const exist = await this.service.findOneAsync({ title: input.name });
    if (exist)
      throw new ConflictException('Category with the name already exists');

    return super.create(input);
  }
}
