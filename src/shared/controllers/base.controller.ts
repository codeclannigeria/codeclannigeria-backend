import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';
import { plainToClass } from 'class-transformer';
import * as pluralize from 'pluralize';
import { Authenticate } from '~shared/decorators';
import { Roles } from '~shared/decorators/roles.decorator';
import { getAuthObj } from '~shared/utils';

import { JwtAuthGuard } from '../../auth/guards';
import { ApiException } from '../errors/api-exception';
import { BaseControllerWithSwaggerOpts } from '../interfaces/base-controller-opts-interface';
import { BaseEntity } from '../models/base.entity';
import { PagedInputDto } from '../models/dto/paged-in.dto';
import { BaseService } from '../services/base.service';
import { RolesGuard } from '../../auth/guards/roles.guard';

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
    constructor(protected readonly service: BaseService<TEntity>) {}

    @Post()
    @ApiResponse({ type: EntityDto, status: HttpStatus.CREATED })
    @ApiBody({ type: CreateDto })
    @ApiResponse({ status: HttpStatus.FORBIDDEN, type: ApiException })
    @ApiResponse({ status: HttpStatus.BAD_REQUEST, type: ApiException })
    @Authenticate(auth.create.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.create.enableAuth, Roles(...auth.create.authRoles))
    @Authenticate(auth.create.enableAuth, ApiBearerAuth())
    async create(@Body() input: TCreateDto): Promise<TEntityDto> {
      const newEntity = this.service.createEntity(input);
      await this.service.insertAsync(newEntity);
      return plainToClass(EntityDto, newEntity, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      });
    }

    @Get()
    @ApiResponse({ type: PagedOutputDto, status: HttpStatus.OK })
    @ApiResponse({ type: ApiException, status: HttpStatus.OK })
    @Authenticate(auth.find.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.find.enableAuth, Roles(...auth.find.authRoles))
    @Authenticate(auth.find.enableAuth, ApiBearerAuth())
    async findAll(
      @Query() query: PagedInputDto
    ): Promise<{ totalCount: number; items: TEntityDto[] }> {
      const { skip, limit, search, opts } = query;
      const conditions = JSON.parse(search || '{}');
      const options = JSON.parse(opts || '{}');

      const entities = await this.service
        .findAll(conditions, options)
        .limit(limit)
        .skip(skip);
      const totalCount = await this.service.countAsync();
      const items = plainToClass(EntityDto, entities, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      });
      return { totalCount, items };
    }

    @Get(':id')
    @ApiResponse({ type: EntityDto, status: HttpStatus.OK })
    @ApiResponse({ status: HttpStatus.NOT_FOUND, type: ApiException })
    @Authenticate(auth.findById.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.findById.enableAuth, Roles(...auth.findById.authRoles))
    @Authenticate(auth.findById.enableAuth, ApiBearerAuth())
    async findById(@Param('id') id: string): Promise<TEntityDto> {
      const entity = await this.service.findByIdAsync(id);
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
    @Authenticate(auth.update.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.update.enableAuth, Roles(...auth.update.authRoles))
    @Authenticate(auth.update.enableAuth, ApiBearerAuth())
    async update(
      @Param('id') id: string,
      @Body() input: TUpdateDto
    ): Promise<TEntityDto> {
      const entity = await this.service.findByIdAsync(id);
      if (!entity)
        throw new NotFoundException(`Entity with Id ${id} does not exist`);
      const value = plainToClass(Entity, entity, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      });
      const updatedDoc = { ...value, ...input };
      const result = await this.service.updateAsync(id, updatedDoc);
      return plainToClass<TEntityDto, TEntity>(EntityDto, result, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true
      });
    }

    @Delete(':id')
    @ApiResponse({ status: HttpStatus.OK })
    @Authenticate(auth.delete.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.delete.enableAuth, Roles(...auth.delete.authRoles))
    @Authenticate(auth.delete.enableAuth, ApiBearerAuth())
    async delete(@Param('id') id: string): Promise<void> {
      await this.service.softDeleteByIdAsync(id);
    }
  }
  return BaseController;
}
