import { Model } from 'mongoose';
import { AbstractCoreService } from './abstract-core.service';
import { IdType, AbstractDocument, UpdateResultType, DeleteResultType } from './types';
import { AbstractModel } from './models';
export declare class AbstractMongooseService<T extends AbstractModel> extends AbstractCoreService<T> {
    protected _model: Model<T>;
    static model: any;
    constructor(model: Model<T>);
    find(filter?: any): Promise<T[]>;
    findById(id: IdType): Promise<T>;
    findOne(filter?: any): Promise<T>;
    create(doc: T): Promise<T>;
    update(id: IdType, updatedDoc: AbstractDocument<T>): Promise<UpdateResultType<T>>;
    delete(id: IdType): Promise<DeleteResultType<T>>;
    private toObjectId;
}
