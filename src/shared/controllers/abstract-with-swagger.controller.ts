import {
  Body,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';

import { AUTH_GUARD_TYPE } from '../constants';
import { ApiSwaggerOperation, Authenticate } from '../decorators';
import { AbstractControllerWithSwaggerOptions } from '../interfaces';
import { BaseEntity } from '../models/base.entity';
import { AbstractService } from '../services';
import { AbstractDocument } from '../types';
import { getAuthObj } from '../utils';

export function abstractControllerWithSwagger<
  T extends BaseEntity,
  VM = Partial<T>,
  C = Partial<T>
>(options: AbstractControllerWithSwaggerOptions<T, VM, C>): any {
  const { model, modelVm, modelCreate } = options;
  const auth = getAuthObj(options.auth);

  @ApiTags(model.name)
  abstract class AbstractController {
    protected readonly _service: AbstractService<T>;

    protected constructor(service: AbstractService<T>) {
      this._service = service;
    }

    @Get()
    @Authenticate(!!auth && auth.find, UseGuards(AuthGuard(AUTH_GUARD_TYPE)))
    @Authenticate(!!auth && auth.find, ApiBearerAuth())
    @ApiQuery({
      name: 'filter',
      description: 'Find Query',
      required: false,
      isArray: false,
    })
    @ApiOkResponse({ type: modelVm, isArray: true })
    @ApiSwaggerOperation({ title: 'FindAll' })
    public async find(@Query('filter') filter: string): Promise<T[]> {
      const findFilter = filter ? JSON.parse(filter) : {};
      return this._service.findAllAsync(findFilter);
    }

    @Get(':id')
    @Authenticate(
      !!auth && auth.findById,
      UseGuards(AuthGuard(AUTH_GUARD_TYPE)),
    )
    @Authenticate(!!auth && auth.findById, ApiBearerAuth())
    @ApiParam({
      name: 'id',
      required: true,
      description: 'Id of Object',
      type: String,
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
    @Authenticate(!!auth && auth.create, UseGuards(AuthGuard(AUTH_GUARD_TYPE)))
    @Authenticate(!!auth && auth.create, ApiBearerAuth())
    @ApiBody({
      //name: modelCreate.name,
      type: modelCreate,
      description: 'Data for model creation',
      required: true,
      isArray: false,
    })
    @ApiOkResponse({ type: modelVm })
    @ApiSwaggerOperation({ title: 'Create' })
    public async create(@Body() doc: C): Promise<T> {
      try {
        const newObject = new model(doc);
        return this._service.create(newObject as AbstractDocument<T>);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }

    @Put(':id')
    @Authenticate(!!auth && auth.update, UseGuards(AuthGuard(AUTH_GUARD_TYPE)))
    @Authenticate(!!auth && auth.update, ApiBearerAuth())
    @ApiBody({
      //name: model.name,
      type: modelVm,
      description: 'Data for object update',
      required: true,
      isArray: false,
    })
    @ApiParam({
      name: 'id',
      required: true,
      description: 'Id of Object',
      type: String,
    })
    @ApiOkResponse({ type: modelVm })
    @ApiSwaggerOperation({ title: 'Update' })
    public async update(
      @Param('id') id: string,
      @Body() doc: Partial<T>,
    ): Promise<void> {
      const existed = await this._service.findById(id);
      const updatedDoc = { ...(existed as any), ...(doc as any) } as any;
      await this._service.update(id, updatedDoc);
    }

    @Delete(':id')
    @Authenticate(!!auth && auth.delete, UseGuards(AuthGuard(AUTH_GUARD_TYPE)))
    @Authenticate(!!auth && auth.delete, ApiBearerAuth())
    @ApiParam({
      name: 'id',
      required: true,
      description: 'Id of Object',
      type: String,
    })
    @ApiOkResponse({ type: modelVm })
    @ApiSwaggerOperation({ title: 'Delete' })
    public async delete(@Param('id') id: string): Promise<void> {
      await this._service.deleteByIdAsync(id);
    }
  }

  return AbstractController;
}
