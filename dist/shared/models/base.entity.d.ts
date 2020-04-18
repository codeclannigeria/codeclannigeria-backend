import { User } from '../../users/models/user.entity';
import { Schema } from 'mongoose';
import { Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
export declare abstract class BaseEntity extends TimeStamps {
    id: string;
    readonly isDeleted: boolean;
    readonly createdBy?: Ref<User | null>;
    readonly updatedBy?: Ref<User | null>;
    readonly isActive: boolean;
    readonly deletedBy?: Ref<User | null>;
    readonly deletedAt?: Date;
    readonly createdAt: Date;
    readonly updatedAt: Date;
    static get schema(): Schema;
    static get modelName(): string;
}
