import {
  Body,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { ApiBody, ApiResponse } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';

import { AbstractControllerOptions } from './interfaces/base-controller-interface';
import { ApiException } from './models/api-exception.model';
import { BaseEntity } from './models/base.entity';
import { PagedReqDto } from './models/dto/paged-req.dto';
import { BaseService } from './services/base.service';

export function AbstractCrudController<
  TEntity extends BaseEntity,
  TEntityDto,
  TCreateDto,
  TUpdateDto = TEntityDto,
  TPagedResDto = { totalCount: number; items: TEntityDto[] }
>(
  options: AbstractControllerOptions<
    TEntity,
    TEntityDto,
    TCreateDto,
    TUpdateDto,
    TPagedResDto
  >
): any {
  const {
    entity: Entity,
    entityDto: EntityDto,
    createDto: CreateDto,
    updateDto: UpdateDto,
    pagedResDto: PagedResDto
  } = options;
  abstract class BaseController {
    constructor(protected readonly baseService: BaseService<TEntity>) {}

    @Post()
    @ApiResponse({ type: CreateDto, status: HttpStatus.CREATED })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    async create(@Body() input: TCreateDto): Promise<TEntityDto> {
      const newEntity = this.baseService.createEntity(input);
      await this.baseService.insertAsync(newEntity);
      return plainToClass(EntityDto, newEntity, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      });
    }

    @Get()
    @ApiResponse({ type: PagedResDto, status: HttpStatus.OK })
    @ApiResponse({ type: ApiException, status: HttpStatus.OK })
    async findAll(
      @Query() query: PagedReqDto
    ): Promise<{ totalCount: number; items: TEntityDto[] }> {
      const { skip, limit, search, opts } = query;
      const conditions = JSON.parse(search || '{}');
      const options = JSON.parse(opts || '{}');

      const entities = await this.baseService
        .findAll(conditions, options)
        .limit(limit)
        .skip(skip);
      const totalCount = await this.baseService.countAsync();
      const items = plainToClass(EntityDto, entities, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      });
      return { totalCount, items };
    }

    @Get(':id')
    @ApiResponse({ type: EntityDto, status: HttpStatus.OK })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ApiException })
    async findById(@Param('id') id: string): Promise<TEntityDto> {
      const entity = await this.baseService.findByIdAsync(id);
      if (!entity)
        throw new NotFoundException(`Entity with id ${id} does not exist`);
      return plainToClass(EntityDto, entity, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      });
    }

    @Put(':id')
    @ApiBody({ type: UpdateDto })
    @ApiResponse({ status: HttpStatus.OK, type: EntityDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ApiException })
    async update(
      @Param('id') id: string,
      @Body() input: TUpdateDto
    ): Promise<TEntityDto> {
      const entity = await this.baseService.findByIdAsync(id);
      if (!entity)
        throw new NotFoundException(`Entity with Id ${id} does not exist`);
      const value = plainToClass(Entity, entity, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      });
      const updatedDoc = { ...value, ...input };
      const result = await this.baseService.updateAsync(id, updatedDoc);
      return plainToClass<TEntityDto, TEntity>(EntityDto, result, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      });
    }

    @Delete(':id')
    @ApiResponse({ status: HttpStatus.OK })
    async delete(@Param('id') id: string): Promise<void> {
      await this.baseService.softDeleteByIdAsync(id);
    }
  }
  return BaseController;
}
