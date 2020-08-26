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
    default: 0
  })
  readonly level!: number;

  @prop({
    required: true,
    default: 1
  })
  readonly taskCount!: number;

  @prop({
    ref: Track,
    required: true,
    autopopulate: true
  })
  readonly track!: Ref<Track>;
}
