import {
  Body,
  ConflictException,
  Controller,
  HttpStatus,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AbstractCrudController } from '~shared/base.controller';
import { ApiException } from '~shared/models/api-exception.model';
import { PagedResDto } from '~shared/models/dto/paged-res.dto';

import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CategoryService } from './categories.service';
import { Category } from './models/category.entity';
import { CategoryDto } from './models/dto/category.dto';
import { CreateCategoryDto } from './models/dto/create-category.dto';

@Controller('categories')
@ApiTags('categories')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CategoriesController extends AbstractCrudController<
  Category,
  CategoryDto,
  CreateCategoryDto,
  CreateCategoryDto
>({
  entity: Category,
  entityDto: CategoryDto,
  createDto: CreateCategoryDto,
  updateDto: CreateCategoryDto,
  pagedResDto: PagedResDto(CategoryDto)
}) {
  constructor(private readonly categoryService: CategoryService) {
    super(categoryService);
  }
  @Post()
  @ApiResponse({ type: CreateCategoryDto, status: HttpStatus.CREATED })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
  async create(@Body() input: CreateCategoryDto): Promise<CategoryDto> {
    const exist = await this.categoryService.findOneAsync({ name: input.name });
    if (exist) throw new ConflictException(`${input.name} already exists`);
    return super.create(input);
  }
}
