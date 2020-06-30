import {
  Body,
  ConflictException,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BaseCrudController } from '~shared/controllers';
import { Roles } from '~shared/decorators/roles.decorator';
import { ApiException } from '~shared/errors';

import { JwtAuthGuard, RolesGuard } from '../auth/guards';
import { UserRole } from '../users/models/user.entity';
import { CategoriesService } from './categories.service';
import { Category } from './models/category.entity';
import { CategoryDto, PagedCategoryOutDto } from './models/dtos/category.dto';
import { CreateCategoryDto } from './models/dtos/create-category.dto';

const BaseCtrl = BaseCrudController<Category, CategoryDto, CreateCategoryDto>({
  auth: {
    update: [UserRole.ADMIN, UserRole.MENTOR],
    delete: [UserRole.ADMIN, UserRole.MENTOR]
  },
  entity: Category,
  entityDto: CategoryDto,
  createDto: CategoryDto,
  updateDto: CategoryDto,
  pagedListDto: PagedCategoryOutDto
});

export class CategoriesController extends BaseCtrl {
  constructor(protected readonly categoryService: CategoriesService) {
    super(categoryService);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiResponse({ type: CategoryDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  @ApiBearerAuth()
  async create(@Body() input: CreateCategoryDto): Promise<CategoryDto> {
    const exist = await this.categoryService.findOneAsync({
      title: input.name.toUpperCase()
    });

    if (exist)
      throw new ConflictException(
        `Category with the name "${exist.name}" already exists`
      );

    return super.create(input);
  }
}
