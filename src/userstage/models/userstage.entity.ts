import { index, prop, Ref, plugin } from '@typegoose/typegoose';
import * as autopopulate from 'mongoose-autopopulate';
import { BaseEntity } from '~shared/models/base.entity';

import { Track } from '../../tracks/models/track.entity';
import { User } from '../../users/models/user.entity';
import { Stage } from '../../stages/models/stage.entity';

@plugin(autopopulate as any)
@index({ title: 1 }, { unique: true })
export class UserStage extends BaseEntity {
  @prop({
    ref: 'User',
    required: true,
    autopopulate: true
  })
  readonly user!: Ref<User>;

  @prop({
    ref: 'Stage',
    required: true,
    autopopulate: true
  })
  readonly stage!: Ref<Stage>;

  @prop({
    ref: 'Track',
    required: true,
    autopopulate: true
  })
  readonly track!: Ref<Track>;

  @prop({
    default: 1
  })
  readonly taskRemaining!: number;

  @prop({
    default: false
  })
  readonly isCompleted!: boolean;
}
