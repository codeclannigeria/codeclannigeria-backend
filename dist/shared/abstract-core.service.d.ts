import { IdType, AbstractDocument, UpdateResultType, DeleteResultType } from './types';
export declare abstract class AbstractCoreService<T> {
    abstract find(filter: any): Promise<T[]>;
    abstract findOne(filter: any): Promise<T>;
    abstract findById(id: IdType): Promise<T>;
    abstract create(doc: AbstractDocument<T>): Promise<T>;
    abstract update(id: IdType, updatedDoc: AbstractDocument<T>): Promise<UpdateResultType<T>>;
    abstract delete(id: IdType): Promise<DeleteResultType<T>>;
}
