import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Inject,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Type,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import * as pluralize from 'pluralize';
import { ApiSwaggerOperation, Authenticate } from '~shared/decorators';
import { Roles } from '~shared/decorators/roles.decorator';
import { IBaseController } from '~shared/interfaces';
import { IPagedListDto } from '~shared/models/dto';
import { getAuthObj } from '~shared/utils';

import { JwtAuthGuard } from '../../auth/guards';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { ApiException } from '../errors/api-exception';
import { BaseControllerWithSwaggerOpts } from '../interfaces/base-controller-opts-interface';
import { BaseEntity } from '../models/base.entity';
import { FindDto } from '../models/dto/find.dto';
import { BaseService } from '../services/base.service';

export function BaseCrudController<
  TEntity extends BaseEntity,
  TEntityDto,
  TCreateDto,
  TUpdateDto = Partial<TCreateDto>,
  TPagedListDto = any
>(
  options: BaseControllerWithSwaggerOpts<
    TEntity,
    TEntityDto,
    TCreateDto,
    TUpdateDto,
    TPagedListDto
  >
): Type<
  IBaseController<
    TEntityDto,
    TCreateDto,
    TUpdateDto,
    FindDto,
    IPagedListDto<TEntityDto>
  >
> {
  const {
    entity: Entity,
    entityDto: EntityDto,
    createDto: CreateDto,
    updateDto: UpdateDto,
    pagedListDto: PagedListDto
  } = options;
  const auth = getAuthObj(options.auth);
  @ApiTags(pluralize(Entity.name))
  @Controller(pluralize(Entity.name.toLowerCase()))
  class BaseController {
    constructor(
      @Inject(BaseService)
      protected service: BaseService<TEntity>
    ) {}

    @Post()
    @ApiResponse({ type: EntityDto, status: HttpStatus.CREATED })
    @ApiBody({ type: CreateDto })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @Authenticate(auth.create.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.create.enableAuth, Roles(...auth.create.authRoles))
    @Authenticate(auth.create.enableAuth, ApiBearerAuth())
    @ApiSwaggerOperation({ title: 'Create' })
    async create(@Body() input: TCreateDto) {
      const entity = this.service.createEntity(input);
      await this.service.insertAsync(entity);
      return plainToClass(EntityDto, entity, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true
      });
    }

    @Get()
    @ApiResponse({ type: PagedListDto, status: HttpStatus.OK })
    @ApiResponse({ type: ApiException, status: HttpStatus.OK })
    @Authenticate(auth.find.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.find.enableAuth, Roles(...auth.find.authRoles))
    @Authenticate(auth.find.enableAuth, ApiBearerAuth())
    @ApiSwaggerOperation({ title: 'FindAll' })
    async findAll(@Query() query: FindDto) {
      const { skip, limit, search, opts } = query;
      const conditions = JSON.parse(search || '{}');
      const options = JSON.parse(opts || '{}');

      const entities = await this.service
        .findAll(conditions, options)
        .limit(limit)
        .skip(skip);

      const totalCount = await this.service.countAsync();
      const items = plainToClass(EntityDto, entities, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true
      });
      return { totalCount, items };
    }

    @Get(':id')
    @ApiResponse({ type: EntityDto, status: HttpStatus.OK })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ApiException })
    @Authenticate(auth.findById.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.findById.enableAuth, Roles(...auth.findById.authRoles))
    @Authenticate(auth.findById.enableAuth, ApiBearerAuth())
    @ApiSwaggerOperation({ title: 'FindById' })
    async findById(@Param('id') id: string) {
      const entity = await this.service.findByIdAsync(id);
      if (!entity)
        throw new NotFoundException(`Entity with id ${id} does not exist`);
      return plainToClass(EntityDto, entity, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true
      });
    }

    @Put(':id')
    @ApiBody({ type: UpdateDto })
    @ApiResponse({ status: HttpStatus.OK, type: EntityDto })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ApiException })
    @Authenticate(auth.update.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.update.enableAuth, Roles(...auth.update.authRoles))
    @Authenticate(auth.update.enableAuth, ApiBearerAuth())
    @ApiSwaggerOperation({ title: 'Update' })
    async update(@Param('id') id: string, @Body() input: TUpdateDto) {
      const existingEntity = await this.service.findByIdAsync(id);
      if (!existingEntity)
        throw new NotFoundException(`Entity with Id ${id} does not exist`);
      const value = plainToClass(Entity, existingEntity, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true
      });
      const toBeUpdatedEntity = { ...value, ...input };
      const result = await this.service.updateAsync(id, toBeUpdatedEntity);
      return plainToClass(EntityDto, result, {
        enableImplicitConversion: true,
        excludeExtraneousValues: true
      });
    }

    @Delete(':id')
    @ApiResponse({ status: HttpStatus.OK })
    @Authenticate(auth.delete.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.delete.enableAuth, Roles(...auth.delete.authRoles))
    @Authenticate(auth.delete.enableAuth, ApiBearerAuth())
    @ApiSwaggerOperation({ title: 'Delete' })
    async delete(@Param('id') id: string) {
      await this.service.softDeleteByIdAsync(id);
    }
  }
  return BaseController;
}
