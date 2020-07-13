import { index, prop, Ref, plugin } from '@typegoose/typegoose';
import * as autopopulate from 'mongoose-autopopulate';
import { columnSize } from '~shared/constants';
import { BaseEntity } from '~shared/models/base.entity';

import { Track } from '../../tracks/models/track.entity';

@plugin(autopopulate as any)
@index({ title: 1 }, { unique: true })
export class Stage extends BaseEntity {
  @prop({
    required: true,
    maxlength: columnSize.length32,
    trim: true,
    text: true,
    uppercase: true,
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
  @prop({
    required: true,
    default: 0
  })
  readonly taskCount!: number;

  @prop({
    ref: 'Track',
    required: true,
    autopopulate: true
  })
  readonly track!: Ref<Track>;
}
