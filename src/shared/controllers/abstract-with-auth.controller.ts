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

import { AUTH_GUARD_TYPE } from '../constants';
import { Authenticate } from '../decorators';
import { AbstractControllerWithAuthOptions } from '../interfaces';
import { AbstractService } from '../services';
import { AbstractDocument } from '../types';
import { getAuthObj } from '../utils';
import { BaseEntity } from '../models/base.entity';

export function abstractControllerWithAuth<T extends BaseEntity>(
  options: AbstractControllerWithAuthOptions<T>,
): any {
  const model = options.model;
  const auth = getAuthObj(options.auth);

  abstract class AbstractController {
    protected readonly _service: AbstractService<T>;

    protected constructor(service: AbstractService<T>) {
      this._service = service;
    }

    @Get()
    @Authenticate(!!auth && auth.find, UseGuards(AuthGuard(AUTH_GUARD_TYPE)))
    public async find(@Query('filter') filter: string): Promise<T[]> {
      const findFilter = filter ? JSON.parse(filter) : {};

      try {
        return this._service.findAll(findFilter);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }

    @Get(':id')
    @Authenticate(
      !!auth && auth.findById,
      UseGuards(AuthGuard(AUTH_GUARD_TYPE)),
    )
    public async findById(@Param('id') id: string): Promise<T> {
      try {
        return this._service.findById(id);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }

    @Post()
    @Authenticate(!!auth && auth.create, UseGuards(AuthGuard(AUTH_GUARD_TYPE)))
    public async create(@Body() doc: Partial<T>): Promise<T> {
      try {
        const newObject = new model(doc);
        return this._service.create(newObject as AbstractDocument<T>);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }

    @Put(':id')
    @Authenticate(!!auth && auth.update, UseGuards(AuthGuard(AUTH_GUARD_TYPE)))
    public async update(
      @Param('id') id: string,
      @Body() doc: Partial<T>,
    ): Promise<void> {
      try {
        const existed = await this._service.findById(id);
        const updatedDoc = { ...(existed as any), ...(doc as any) } as any;
        await this._service.updateAsync(id, updatedDoc);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }

    @Delete(':id')
    @Authenticate(!!auth && auth.delete, UseGuards(AuthGuard(AUTH_GUARD_TYPE)))
    public async delete(@Param('id') id: string): Promise<void> {
      try {
        await this._service.deleteByIdAsync(id);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }
  }

  return AbstractController;
}
