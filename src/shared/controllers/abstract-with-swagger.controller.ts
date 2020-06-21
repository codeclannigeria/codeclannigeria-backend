import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags
} from '@nestjs/swagger';
import pluralize = require('pluralize');
import { Roles } from '~shared/decorators/roles.decorator';
import { BaseService } from '~shared/services';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { ApiSwaggerOperation, Authenticate } from '../decorators';
import { AbstractControllerWithSwaggerOptions } from '../interfaces';
import { BaseEntity } from '../models/base.entity';
import { AbstractDocument } from '../types';
import { getAuthObj } from '../utils';
import { RolesGuard } from './../../auth/guards/roles.guard';

export function AbstractController<
  T extends BaseEntity,
  VM = Partial<T>,
  C = Partial<T>
>(options: AbstractControllerWithSwaggerOptions<T, VM, C>): any {
  const { model, modelVm, modelCreate } = options;
  const auth = getAuthObj(options.auth);

  @ApiTags(pluralize(model.name))
  @Controller(pluralize(model.name.toLowerCase()))
  abstract class AbstractController {
    protected readonly _service: BaseService<T>;

    protected constructor(service: BaseService<T>) {
      this._service = service;
    }

    @Get()
    @Authenticate(auth.find.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.find.enableAuth, Roles(...auth.find.authRoles))
    @Authenticate(auth.find.enableAuth, ApiBearerAuth())
    @ApiQuery({
      name: 'filter',
      description: 'Find Query',
      required: false,
      isArray: false
    })
    @ApiOkResponse({ type: modelVm, isArray: true })
    @ApiSwaggerOperation({ title: 'FindAll' })
    public async find(@Query('filter') filter: string): Promise<T[]> {
      const findFilter = filter ? JSON.parse(filter) : {};
      return this._service.findAllAsync(findFilter);
    }

    @Get(':id')
    @Authenticate(auth.findById.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.findById.enableAuth, Roles(...auth.findById.authRoles))
    @Authenticate(auth.findById.enableAuth, ApiBearerAuth())
    @ApiParam({
      name: 'id',
      required: true,
      description: 'Id of Object',
      type: String
    })
    @ApiOkResponse({ type: modelVm })
    @ApiSwaggerOperation({ title: 'FindById' })
    public async findById(@Param('id') id: string): Promise<T> {
      try {
        return this._service.findById(id);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }

    @Post()
    @Authenticate(auth.create.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.create.enableAuth, Roles(...auth.create.authRoles))
    @Authenticate(auth.create.enableAuth, ApiBearerAuth())
    @ApiBody({
      //name: modelCreate.name,
      type: modelCreate,
      description: 'Data for model creation',
      required: true,
      isArray: false
    })
    @ApiOkResponse({ type: modelVm })
    @ApiSwaggerOperation({ title: 'Create' })
    public async create(@Body() doc: C): Promise<T> {
      try {
        const newObject = new model(doc);
        return this._service.insertAsync(newObject as AbstractDocument<T>);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }

    @Put(':id')
    @Authenticate(auth.update.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.update.enableAuth, Roles(...auth.update.authRoles))
    @Authenticate(auth.update.enableAuth, ApiBearerAuth())
    @ApiBody({
      //name: model.name,
      type: modelVm,
      description: 'Data for object update',
      required: true,
      isArray: false
    })
    @ApiParam({
      name: 'id',
      required: true,
      description: 'Id of Object',
      type: String
    })
    @ApiOkResponse({ type: modelVm })
    @ApiSwaggerOperation({ title: 'Update' })
    public async update(
      @Param('id') id: string,
      @Body() doc: Partial<T>
    ): Promise<void> {
      const existed = await this._service.findById(id);
      const updatedDoc = { ...(existed as any), ...(doc as any) } as any;
      await this._service.update(id, updatedDoc);
    }

    @Delete(':id')
    @Authenticate(auth.delete.enableAuth, UseGuards(JwtAuthGuard, RolesGuard))
    @Authenticate(auth.delete.enableAuth, Roles(...auth.delete.authRoles))
    @Authenticate(auth.delete.enableAuth, ApiBearerAuth())
    @ApiParam({
      name: 'id',
      required: true,
      description: 'Id of Object',
      type: String
    })
    @ApiOkResponse({ type: modelVm })
    @ApiSwaggerOperation({ title: 'Delete' })
    public async delete(@Param('id') id: string): Promise<void> {
      await this._service.softDeleteByIdAsync(id);
    }
  }

  return AbstractController;
}
