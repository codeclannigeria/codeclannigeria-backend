import { index, prop, Ref } from '@typegoose/typegoose';
import { columnSize } from '~shared/constants';
import { BaseEntity } from '~shared/models/base.entity';

import { Course } from '../../courses/models/course.entity';
import { Stage } from '../../stages/models/stage.entity';
import { Track } from '../../tracks/models/track.entity';

export enum TaskStatus {
  STARTED = 'STARTED',
  UNCOMPLETED = 'UNCOMPLETED',
  COMPLETED = 'COMPLETED'
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


  @prop({ ref: Track, required: true })
  readonly track!: Ref<Track>;

  @prop({ ref: Stage, required: true })
  readonly stage!: Ref<Stage>;

  @prop({ ref: Course, required: true })
  readonly course!: Ref<Course>;
}
