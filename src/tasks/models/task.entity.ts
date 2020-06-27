import { index, prop, Ref } from '@typegoose/typegoose';
import { columnSize } from '~shared/constants';
import { BaseEntity } from '~shared/models/base.entity';

import { Stage } from '../../stages/models/stage.entity.ts';
import { Track } from '../../tracks/models/track.entity';

export enum TaskStatus {
  NOT_SUBMITTED = 'NOT_SUBMITTED',
  SUBMITTED = 'SUBMITTED',
  PENDING = 'PENDING'
}

@index({ title: 1 }, { unique: true })
export class Task extends BaseEntity {
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
    type: Date,
    default: new Date(new Date().setDate(new Date().getDate() + 7))
  })
  readonly deadline = new Date(new Date().setDate(new Date().getDate() + 7));

  @prop({
    enum: TaskStatus,
    type: String,
    required: true,
    default: TaskStatus.NOT_SUBMITTED
  })
  readonly status = TaskStatus.NOT_SUBMITTED;

  @prop({ ref: Track, required: true })
  readonly track!: Ref<Track>;

  @prop({ ref: Stage, required: true })
  readonly stage!: Ref<Stage>;
}
