import { AbstractControllerOptions } from '../interfaces';
import {
  Body,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AbstractDocument, DeleteResultType, UpdateResultType } from '../types';
import { AbstractService } from '../services';
import { BaseEntity } from '../models/base.entity';

export function abstractControllerFactory<T extends BaseEntity>(
  options: AbstractControllerOptions<T>,
): any {
  const model = options.model;

  abstract class AbstractController {
    protected readonly _service: AbstractService<T>;

    protected constructor(service: AbstractService<T>) {
      this._service = service;
    }

    @Get()
    public async find(@Query('filter') filter: string): Promise<T[]> {
      const findFilter = filter ? JSON.parse(filter) : {};

      return this._service.findAllAsync(findFilter);
    }

    @Get(':id')
    public async findById(@Param('id') id: string): Promise<T> {
      try {
        return this._service.findById(id);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }

    @Post()
    public async create(@Body() input: Partial<T>): Promise<T> {
      try {
        const newObject = new model(input);
        return this._service.create(newObject as AbstractDocument<T>);
      } catch (e) {
        throw new InternalServerErrorException(e);
      }
    }

    @Put(':id')
    public async update(
      @Param('id') id: string,
      @Body() doc: Partial<T>,
    ): Promise<void> {
      const existed = await this._service.findById(id);
      const updatedDoc = { ...(existed as any), ...(doc as any) } as any;
      await this._service.updateAsync(id, updatedDoc);
    }

    @Delete(':id')
    public async delete(@Param('id') id: string): Promise<void> {
      await this._service.deleteByIdAsync(id);
    }
  }

  return AbstractController;
}
