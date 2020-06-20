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
  Controller
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import * as pluralize from 'pluralize';
import { getAuthObj } from '~shared/utils';

import { ApiException } from '../errors/api-exception';
import { BaseControllerWithSwaggerOpts } from '../interfaces/base-controller-opts-interface';
import { BaseEntity } from '../models/base.entity';
import { PagedInputDto } from '../models/dto/paged-in.dto';
import { BaseService } from '../services/base.service';

export function BaseCrudController<
  TEntity extends BaseEntity,
  TEntityDto,
  TCreateDto,
  TUpdateDto = Partial<TCreateDto>,
  TPagedOutputDto = any
>(
  options: BaseControllerWithSwaggerOpts<
    TEntity,
    TEntityDto,
    TCreateDto,
    TUpdateDto,
    TPagedOutputDto
  >
): any {
  const {
    entity: Entity,
    entityDto: EntityDto,
    createDto: CreateDto,
    updateDto: UpdateDto,
    pagedOutputDto: PagedOutputDto
  } = options;
  const auth = getAuthObj(options.auth);

  @ApiTags(pluralize(Entity.name))
  @Controller(pluralize(Entity.name.toLowerCase()))
  abstract class BaseController {
    constructor(protected readonly baseService: BaseService<TEntity>) {}

    @Post()
    @ApiResponse({ type: EntityDto, status: HttpStatus.CREATED })
    @ApiBody({ type: CreateDto })
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
    @ApiResponse({ type: PagedOutputDto, status: HttpStatus.OK })
    @ApiResponse({ type: ApiException, status: HttpStatus.OK })
    async findAll(
      @Query() query: PagedInputDto
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
