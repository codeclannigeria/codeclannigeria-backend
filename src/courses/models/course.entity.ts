import { index, prop } from '@typegoose/typegoose';
import { columnSize } from '~shared/constants';
import { BaseEntity } from '~shared/models/base.entity';

@index({ title: 1 }, { unique: true })
export class Course extends BaseEntity {
  @prop({
    required: true,
    maxlength: columnSize.length256,
    trim: true,
    text: true,
    uppercase: true,
    unique: false
  })
  readonly title!: string;
  @prop({
    required: true,
    maxlength: columnSize.length1024,
    trim: true,
    text: true,
    unique: false
  })
  readonly description!: string;

  @prop({
    required: true,
    maxlength: columnSize.length256,
    unique: false
  })
  readonly playlistUrl!: string;
  @prop({
    required: true,
    default: 0
  })
  readonly enrollmentCount!: number;
}
