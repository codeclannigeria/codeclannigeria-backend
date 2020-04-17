import { Schema } from 'mongoose';
export declare abstract class BaseEntity {
    createdDate?: Date;
    updatedDate?: Date;
    id: string;
    isDeleted: boolean;
    deletionDate: Date;
    createdBy: string;
    deletedBy: string;
    static get schema(): Schema;
    static get modelName(): string;
}
