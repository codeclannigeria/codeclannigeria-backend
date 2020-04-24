import { Document } from 'mongoose';
export interface AbstractModel extends Document {
    createdAt?: Date;
    updatedAt?: Date;
    id?: string;
}
