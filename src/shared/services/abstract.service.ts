import { DocumentType } from '@typegoose/typegoose';
import { Query } from 'mongoose';

import { QueryItem, QueryList } from '../types';
import { BaseEntity } from '../models/base.entity';

export abstract class AbstractService<T extends BaseEntity> {
  abstract insert(entity: T): Promise<DocumentType<T>>;
  abstract async insertAsync(entity: T): Promise<DocumentType<T>>;

  abstract findAll(filter: any): QueryList<T>;
  abstract async findAllAsync(filter: any): Promise<Array<DocumentType<T>>>;

  abstract findOne(filter: any): QueryItem<T>;
  abstract async findOneAsync(filter: any): Promise<DocumentType<T>>;

  abstract findById(id: string): QueryItem<T>;
  abstract async findByIdAsync(id: string): Promise<DocumentType<T>>;

  abstract async create(item: T): Promise<DocumentType<T>>;

  abstract delete(filter: any): QueryItem<T>;
  abstract async deleteAsync(filter: any): Promise<void>;

  abstract deleteById(id: string): QueryItem<T>;
  abstract async deleteByIdAsync(id: string): Promise<DocumentType<T>>;

  abstract softDelete(filter: any): QueryItem<T>;
  abstract softDeleteById(id: string): QueryItem<T>;

  abstract update(id: string, item: Partial<T>): QueryItem<T>;
  abstract async updateAsync(
    id: string,
    item: Partial<T>,
  ): Promise<DocumentType<T>>;

  abstract count(filter: any): Query<number>;
  abstract async countAsync(filter: any): Promise<number>;
}
