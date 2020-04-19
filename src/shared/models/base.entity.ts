import { Writable } from './../utils/writable';
import { User } from '../../users/models/user.entity';
import { Schema } from 'mongoose';
import { buildSchema, prop, Ref } from '@typegoose/typegoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

export abstract class BaseEntity extends TimeStamps {
  id: string;

  @prop({ required: true, default: false })
  readonly isDeleted: boolean = false;
  @prop({ default: null, ref: BaseEntity })
  readonly createdBy?: Ref<User | null> = null;
  @prop({ default: null, ref: BaseEntity })
  readonly updatedBy?: Ref<User | null> = null;
  @prop({ required: true, default: true })
  readonly isActive: boolean = true;
  @prop({ default: null, ref: BaseEntity })
  readonly deletedBy?: Ref<User | null> = null;
  @prop({ default: null })
  readonly deletedAt?: Date;
  @prop({ required: true, default: new Date() })
  readonly createdAt: Date = new Date();
  @prop({ required: true, default: new Date() })
  readonly updatedAt: Date = null;
  static get schema(): Schema {
    return buildSchema(this as any, {
      timestamps: true,
      toJSON: {
        getters: true,
        virtuals: true,
        versionKey: false,
        transform: (_, ret) => {
          ret.id = ret._id;
          delete ret._id;
        },
      },
    });
  }

  static get modelName(): string {
    return this.name;
  }
  delete(): void {
    (this as Writable<BaseEntity>).isDeleted = true;
  }

  /**
   * Sets {isDeleted} to false
   *
   * @memberof BaseEntity
   */
  restore(): void {
    (this as Writable<BaseEntity>).isDeleted = false;
  }

  /**
   * Sets {isActive} to true
   *
   * @memberof BaseEntity
   */
  deactivate(): void {
    (this as Writable<BaseEntity>).isActive = false;
  }

  /**
   * Sets isActive to false
   *
   * @memberof BaseEntity
   */
  activate(): void {
    (this as Writable<BaseEntity>).isActive = true;
  }
}
