import { index, prop, Ref } from '@typegoose/typegoose';
import { columnSize } from '~shared/constants';
import { BaseEntity } from '~shared/models/base.entity';

import { Stage } from '../../stages/models/stage.entity';

@index({ title: 1 }, { unique: true })
export class Track extends BaseEntity {
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

  @prop({ ref: 'Stage', default: [] })
  readonly stages: Ref<Stage>[] = [];

  @prop({
    default: null
  })
  readonly thumbnailUrl: string = null;
}
