import {
    Body,
    ConflictException,
    Controller,
    HttpCode,
    HttpStatus,
    Post,
    UseGuards,
    Get,
    Param,
    Delete,
    Put,
    NotFoundException,
    Logger
  } from '@nestjs/common';
  import {
    ApiBearerAuth,
    ApiTags,
    ApiOkResponse,
    ApiBadRequestResponse,
    ApiNotFoundResponse
  } from '@nestjs/swagger';
  import { plainToClass } from 'class-transformer';
  
  import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
  import { CategoryDto } from './models/dto/category.dto';
  import { CategoryService } from './categories.service';
  import { ApiException } from '@shared/models/api-exception.model';
import { CreateCategoryDto } from './models/dto/create-category.dto';
  
  @Controller('categories')
  @ApiTags('categories')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  export class CategoriesController  {
    constructor(private readonly categoryService: CategoryService) {}
  
    @Post()
    @HttpCode(HttpStatus.CREATED)
    
    async create(@Body() input: CreateCategoryDto): Promise<CategoryDto> {
      const exist = await this.categoryService.findOneAsync({ name: input.name });
      if (exist)
        throw new ConflictException(`${input.name} already exists`);
      const cat = this.categoryService.createEntity(input);
  
      await this.categoryService.insertAsync(cat);
  
      return plainToClass(CategoryDto, cat, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    }

    @Get()
    @ApiOkResponse()
    @ApiBadRequestResponse({ type: ApiException })
    async getCategories(){
      const categories= this.categoryService.GetAllCategories();
      console.log(categories);
      return categories;
    }

 
    @Get(':id')
    @ApiOkResponse({ description: 'Category retrieved successfully.' })
    @ApiNotFoundResponse({
      type: ApiException,
      description: 'Category does not exist',
    })
    async findById(@Param('id') id: string): Promise<CategoryDto> {
      const entity = await this.categoryService.findByIdAsync(id);
      if (!entity)
        throw new NotFoundException(`Category with id ${id} does not exist`);
      return plainToClass(CategoryDto, entity, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    }


    @Delete(':id')
    @ApiOkResponse()
    @ApiBadRequestResponse({ type: ApiException })
    async delete(@Param('id') id: string) {
      this.categoryService.softDeleteByIdAsync(id);
    }

    @Put(':id')
    @ApiBadRequestResponse({ type: ApiException })
    @ApiOkResponse()
    async update(
      @Param('id') id: string,
      @Body() input: CreateCategoryDto,
    ): Promise<CategoryDto> {
      const existed = await this.categoryService.findByIdAsync(id);
      if (!existed)
        throw new NotFoundException(`A category with Id ${id} does not exist`);
      const value = plainToClass(CategoryDto, existed, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      const updatedDoc = { value, ...input };
      Logger.debug(updatedDoc);
      const result = await this.categoryService.updateAsync(id, updatedDoc);
      return plainToClass(CategoryDto, result, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    }

  }
  