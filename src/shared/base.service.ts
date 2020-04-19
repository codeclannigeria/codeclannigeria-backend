import { InternalServerErrorException } from '@nestjs/common';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { AnyParamConstructor } from '@typegoose/typegoose/lib/types';
import { MongoError } from 'mongodb';
import { DocumentQuery, Types, Query } from 'mongoose';
import { BaseEntity } from './models/base.entity';

type QueryList<T extends BaseEntity> = DocumentQuery<
  Array<DocumentType<T>>,
  DocumentType<T>
>;
type QueryItem<T extends BaseEntity> = DocumentQuery<
  DocumentType<T>,
  DocumentType<T>
>;

export abstract class BaseService<T extends BaseEntity> {
  protected entity: ReturnModelType<AnyParamConstructor<T>>;

  protected constructor(entity: ReturnModelType<AnyParamConstructor<T>>) {
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

  insert(entity: T) {
    return this.entity.create(entity);
  }
  async insertAsync(entity: T) {
    try {
      return await this.insert(entity);
    } catch (e) {
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

  async create(item: T): Promise<DocumentType<T>> {
    try {
      return await this.entity.create(item);
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  delete(filter = {}): QueryItem<T> {
    filter = { ...filter, isDeleted: { $ne: true } };
    return this.entity.findOneAndDelete(filter);
  }
  softDelete(filter = {}): QueryItem<T> {
    filter = { ...filter, isDeleted: { $ne: true } };
    return this.entity.findOneAndUpdate(filter, { isDeleted: true });
  }
  async deleteAsync(filter = {}): Promise<DocumentType<T>> {
    try {
      return await this.softDelete(filter).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  deleteById(id: string): QueryItem<T> {
    return this.entity
      .findByIdAndDelete(BaseService.toObjectId(id))
      .where('isDeleted')
      .ne(true);
  }
  softDeleteById(id: string): QueryItem<T> {
    return this.entity
      .findByIdAndUpdate(BaseService.toObjectId(id), { isDeleted: true })
      .where('isDeleted')
      .ne(true);
  }

  async deleteByIdAsync(id: string): Promise<DocumentType<T>> {
    try {
      return await this.softDeleteById(id).exec();
    } catch (e) {
      BaseService.throwMongoError(e);
    }
  }

  update(id: string, item: Partial<T>): QueryItem<T> {
    return this.entity
      .findByIdAndUpdate(BaseService.toObjectId(id), item, {
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
