import { index, prop } from '@typegoose/typegoose';
import { columnSize } from '~shared/constants';
import { BaseEntity } from '~shared/models/base.entity';

@index({ name: 1 }, { unique: true })
export class Category extends BaseEntity {
  @prop({
    required: true,
    maxlength: columnSize.length32,
    trim: true,
    text: true,
    unique: false,
    uppercase: true
  })
  readonly name!: string;
}
