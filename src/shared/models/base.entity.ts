import { Schema } from 'mongoose';
import { buildSchema, prop } from '@typegoose/typegoose';

export abstract class BaseEntity {
  @prop()
  createdDate?: Date; // provided by timestamps
  @prop()
  updatedDate?: Date; // provided by timestamps
  id: string; // is actually model._id getter
  // add more to a base model if you want.
  @prop()
  isDeleted: boolean;
  @prop()
  deletionDate: Date;
  @prop()
  createdBy: string;
  @prop()
  deletedBy: string;

  static get schema(): Schema {
    return buildSchema(this as any, {
      timestamps: true,
      toJSON: {
        getters: true,
        virtuals: true,
      },
    });
  }

  static get modelName(): string {
    return this.name;
  }
}
