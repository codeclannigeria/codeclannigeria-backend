import {
  Inject,
  InternalServerErrorException,
  Logger,
  Optional
} from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { Request } from 'express';
import { MongoError } from 'mongodb';
import { CreateQuery, Query, Types } from 'mongoose';
import { QueryItem, QueryList, Writable } from '~shared/types/abstract.type';

import { UserRole } from '../../users/models/user.entity';
import { BaseEntity } from '../models/base.entity';

export abstract class BaseService<T extends BaseEntity> {
  @Optional()
  @Inject(REQUEST)
  protected readonly req: Request;

  constructor(protected entity: ReturnModelType<AnyParamConstructor<T>>) {}

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
  protected getUserRole(): UserRole {
    return this.req?.user?.['role'] || null;
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

    return this.entity.find(filter, null, opts);
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
  hardDeleteMany(filter = {}): QueryItem<T> {
    try {
      return this.entity.deleteMany(filter).where(this.whereOwn()).lean();
    } catch (error) {
      BaseService.throwMongoError(error);
    }
  }
  hardDelete(filter = {}): QueryItem<T> {
    try {
      return this.entity.findOneAndDelete(filter).where(this.whereOwn()).lean();
    } catch (error) {
      BaseService.throwMongoError(error);
    }
  }
  softDelete(filter = {}): QueryItem<T> {
    filter = { ...filter, isDeleted: { $ne: true } };
    const update = { isDeleted: true, deletedBy: this.getUserId() } as any;
    return this.entity.findOneAndUpdate(filter, update).where(this.whereOwn());
  }
  async softDeleteAsync(filter = {}): Promise<void> {
    try {
      await this.softDelete(filter).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  hardDeleteById(id: string): QueryItem<T> {
    return this.entity
      .findByIdAndDelete(BaseService.toObjectId(id))
      .where(this.whereOwn());
  }
  softDeleteById(id: string): QueryItem<T> {
    const update = {
      isDeleted: true,
      deletedBy: this.getUserId()
    } as any;
    return this.entity

      .findByIdAndUpdate(BaseService.toObjectId(id), update)
      .where(this.whereOwn())
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
      .where(this.whereOwn())
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
  private whereOwn() {
    return this.getUserRole() === UserRole.ADMIN
      ? {}
      : { createdBy: this.getUserId() };
  }
}
