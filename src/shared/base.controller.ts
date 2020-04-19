import {
  Body,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiResponse,
} from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import { BaseService } from './base.service';
import { AbstractControllerOptions } from './interfaces/base-controller-interface';
import { ApiException } from './models/api-exception.model';
import { BaseEntity } from './models/base.entity';
import { PagedReqDto, PagedResDto } from './models/dto/paged.dto';

export function AbstractCrudController<
  T extends BaseEntity,
  TEntityDto,
  TCreateDto,
  TUpdateDto = TEntityDto
>(options: AbstractControllerOptions<T, TEntityDto, TCreateDto>): any {
  const { entity, entityDto, createDto } = options;
  abstract class BaseController {
    constructor(protected readonly baseService: BaseService<T>) {}

    @Get()
    @ApiOkResponse({})
    @ApiBadRequestResponse({ type: ApiException })
    async findAll(
      @Query() query: PagedReqDto,
    ): Promise<PagedResDto<TEntityDto>> {
      const { skip, limit, search } = query;
      const entities = await this.baseService
        .findAll(search && { $text: { $search: search } })
        .limit(limit)
        .skip(skip);
      const totalCount = entities.length <= limit ? entities.length : limit;
      const items = plainToClass(entityDto, entities, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      return new PagedResDto<TEntityDto>(totalCount, items, entityDto);
    }

    @Get(':id')
    @ApiOkResponse({ description: 'Entity retrieved successfully.' })
    @ApiNotFoundResponse({
      type: ApiException,
      description: 'Entity does not exist',
    })
    async findById(@Param('id') id: string): Promise<TEntityDto> {
      const entity = await this.baseService.findByIdAsync(id);
      if (!entity)
        throw new NotFoundException(`Entity with id ${id} does not exist`);
      return plainToClass(entityDto, entity, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    }

    @Post()
    @ApiCreatedResponse({
      description: 'Entity successfully created.',
    })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Forbidden.' })
    @ApiBadRequestResponse({ description: 'Bad Request.' })
    async create(@Body() dto: TCreateDto): Promise<TCreateDto> {
      const newEntity = this.baseService.createEntity(dto);
      await this.baseService.insertAsync(newEntity);
      return plainToClass(createDto, newEntity, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    }

    @Delete(':id')
    @ApiOkResponse({ description: 'Entity deleted successfully.' })
    @ApiBadRequestResponse({ type: ApiException, description: 'Bad Request.' })
    async delete(@Param('id') id: string) {
      this.baseService.deleteByIdAsync(id);
    }

    @Put(':id')
    @ApiBadRequestResponse({ type: ApiException, description: 'Bad Request.' })
    @ApiOkResponse({ description: 'Entity updated successfully.' })
    async update(
      @Param('id') id: string,
      @Body() input: TUpdateDto,
    ): Promise<TEntityDto> {
      const existed = await this.baseService.findByIdAsync(id);
      if (!existed)
        throw new NotFoundException(`Entity with Id ${id} does not exist`);
      const value = plainToClass(entity, existed, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
      const updatedDoc = { ...value, ...input };
      console.log(updatedDoc);
      const result = await this.baseService.updateAsync(id, updatedDoc);
      return plainToClass<TEntityDto, T>(entityDto, result, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
      });
    }
  }
  return BaseController;
}
