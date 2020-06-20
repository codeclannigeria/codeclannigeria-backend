import {
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
  Optional,
  Scope
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { Request } from 'express';
import { MongoError } from 'mongodb';
import { CreateQuery, Query, Types } from 'mongoose';

import { BaseEntity } from '../models/base.entity';
import { QueryItem, QueryList, Writable } from '../types';
import { UserRole } from './../../users/models/user.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable({ scope: Scope.REQUEST })
export class BaseService<T extends BaseEntity> {
  @Optional()
  @Inject(REQUEST)
  private readonly req: Request;
  protected entity: ReturnModelType<AnyParamConstructor<T>>;

  constructor(
    @InjectModel(BaseEntity.modelName)
    entity: ReturnModelType<AnyParamConstructor<T>>
  ) {
    this.entity = entity;
  }

  protected static throwMongoError(err: MongoError): void {
    throw new InternalServerErrorException(err, err.errmsg);
  }

  protected static toObjectId(id: string): Types.ObjectId {
    try {
      return Types.ObjectId(id);
    } catch (e) {
      this.throwMongoError(e);
    }
  }

  createEntity(doc?: Partial<T>): T {
    return new this.entity(doc);
  }
  protected getUserId(): any {
    return this.req?.user?.['userId'] || null;
  }

  insert(entity: T): Promise<DocumentType<T>> {
    (entity as Writable<T>).createdBy = this.getUserId();
    return this.entity.create(entity as CreateQuery<DocumentType<T>>);
  }
  async insertAsync(entity: T): Promise<DocumentType<T>> {
    try {
      return await this.insert(entity);
    } catch (e) {
      Logger.error(e);
      BaseService.throwMongoError(e);
    }
  }
  findAll(filter = {}, opts = {}): QueryList<T> {
    if (filter.hasOwnProperty('id')) {
      Object.defineProperty(
        filter,
        '_id',
        Object.getOwnPropertyDescriptor(filter, 'id')
      );
      delete filter['id'];
    }
    filter = { ...filter, isDeleted: { $ne: true } };
    const whereClause =
      this.req.user?.['role'] === UserRole.ADMIN
        ? {}
        : { createdBy: this.getUserId() };
    return this.entity.find(filter, null, opts).where(whereClause);
  }

  async findAllAsync(filter = {}): Promise<Array<DocumentType<T>>> {
    try {
      return await this.findAll(filter).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  findOne(filter = {}): QueryItem<T> {
    filter = { ...filter, isDeleted: { $ne: true } };
    return this.entity.findOne(filter);
  }

  async findOneAsync(filter = {}): Promise<DocumentType<T>> {
    try {
      return await this.findOne(filter).exec();
    } catch (e) {
      Logger.error(e);
      BaseService.throwMongoError(e);
    }
  }

  findById(id: string): QueryItem<T> {
    return this.entity
      .findById(BaseService.toObjectId(id))
      .where('isDeleted')
      .ne(true);
  }

  async findByIdAsync(id: string): Promise<DocumentType<T>> {
    try {
      return await this.findById(id).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  hardDelete(filter = {}): QueryItem<T> {
    filter = { ...filter, isDeleted: { $ne: true } };
    return this.entity.findOneAndDelete(filter);
  }
  softDelete(filter = {}): QueryItem<T> {
    filter = { ...filter, isDeleted: { $ne: true } };
    const update = { isDeleted: true, deletedBy: this.getUserId() } as any;
    return this.entity.findOneAndUpdate(filter, update);
  }
  async softDeleteAsync(filter = {}): Promise<void> {
    try {
      await this.softDelete(filter).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  hardDeleteById(id: string): QueryItem<T> {
    return this.entity.findByIdAndDelete(BaseService.toObjectId(id));
  }
  softDeleteById(id: string): QueryItem<T> {
    const update = { isDeleted: true, deletedBy: this.getUserId() } as any;

    return this.entity
      .findByIdAndUpdate(BaseService.toObjectId(id), update)
      .where('isDeleted')
      .ne(true);
  }

  async softDeleteByIdAsync(id: string): Promise<DocumentType<T>> {
    try {
      return await this.softDeleteById(id).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  update(id: string, item: Partial<T>): QueryItem<T> {
    const update = { ...item, updatedBy: this.getUserId() } as any;
    delete update?.createdAt;
    delete update?.updatedAt;
    return this.entity
      .findByIdAndUpdate(BaseService.toObjectId(id), update, {
        new: true
      })
      .where('isDeleted')
      .ne(true);
  }

  async updateAsync(id: string, item: Partial<T>): Promise<DocumentType<T>> {
    try {
      return await this.update(id, item).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  count(filter = {}): Query<number> {
    filter = { ...filter, isDeleted: { $ne: true } };
    return this.entity.countDocuments(filter);
  }

  async countAsync(filter = {}): Promise<number> {
    try {
      return await this.count(filter);
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }
}
