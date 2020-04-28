import { DocumentType } from '@typegoose/typegoose';
import { DocumentQuery } from 'mongoose';

import { BaseEntity } from '../models/base.entity';

export type AbstractDocument<T> = T extends BaseEntity ? T : any;
export type IdType = string | number;
export type UpdateResultType<T> = T extends BaseEntity ? T : any;

export type DeleteResultType<T> = T extends BaseEntity ? T : any;
export type ClassType<T = any> = new (...args: any[]) => T;

export type QueryList<T extends BaseEntity> = DocumentQuery<
  Array<DocumentType<T>>,
  DocumentType<T>
>;
export type QueryItem<T extends BaseEntity> = DocumentQuery<
  DocumentType<T>,
  DocumentType<T>
>;
export type Writable<T> = {
  -readonly [K in keyof T]: T[K];
};
