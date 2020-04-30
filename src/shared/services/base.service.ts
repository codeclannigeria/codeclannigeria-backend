import { MongoError } from 'mongodb';
import {
  Inject,
  Logger,
  Optional,
  InternalServerErrorException,
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { Request } from 'express';
import { Query, Types } from 'mongoose';

import { BaseEntity } from '../models/base.entity';
import { QueryItem, QueryList, Writable } from '../types';
import { AbstractService } from './abstract.service';

export class BaseService<T extends BaseEntity> extends AbstractService<T> {
  @Optional()
  @Inject(REQUEST)
  private readonly req: Request;
  protected entity: ReturnModelType<AnyParamConstructor<T>>;

  constructor(entity: ReturnModelType<AnyParamConstructor<T>>) {
    super();
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
  protected getUserId() {
    const user = this.req && this.req.user;
    return user ? user['id'] : null;
  }

  insert(entity: T) {
    (entity as Writable<T>).createdBy = this.getUserId();
    return this.entity.create(entity);
  }
  async insertAsync(entity: T) {
    try {
      return await this.insert(entity);
    } catch (e) {
      Logger.error(e);
      BaseService.throwMongoError(e);
    }
  }
  findAll(filter = {}): QueryList<T> {
    filter = { ...filter, isDeleted: { $ne: true } };
    return this.entity.find(filter);
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
  async softDeleteAsync(filter = {}) {
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
    return this.entity
      .findByIdAndUpdate(BaseService.toObjectId(id), update, {
        new: true,
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
