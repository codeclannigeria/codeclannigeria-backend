import { columnSize } from '~shared/constants';
import { BaseEntity } from '~shared/models/base.entity';
import { index, prop } from '@typegoose/typegoose';

@index({ title: 1 }, { unique: true })
export class Track extends BaseEntity {
  @prop({
    required: true,
    maxlength: columnSize.length32,
    trim: true,
    text: true,
    unique: false
  })
  readonly title!: string;
  @prop({
    required: true,
    maxlength: columnSize.length128,
    trim: true,
    text: true,
    unique: false
  })
  readonly description!: string;
}
