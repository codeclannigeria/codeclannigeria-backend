import { columnSize } from '@shared/constants';
import { BaseEntity } from '@shared/models/base.entity';
import { prop } from '@typegoose/typegoose';


export class Category extends BaseEntity {
  @prop({
    required: true,
    maxlength: columnSize.length32,
    trim: true,
    text: true,
    unique: true,
  })
  readonly name!: string;

}
