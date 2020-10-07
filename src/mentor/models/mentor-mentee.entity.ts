import { plugin, prop, Ref } from '@typegoose/typegoose';
import * as autopopulate from 'mongoose-autopopulate';
import { BaseEntity } from '~shared/models/base.entity';

import { Track } from '../../tracks/models/track.entity';
import { User } from '../../users/models/user.entity';

@plugin(autopopulate as any)
export class MentorMentee extends BaseEntity {
  @prop({ ref: 'User', required: true, autopopulate: true })
  readonly mentor!: Ref<User>;
  @prop({ ref: 'User', required: true, autopopulate: true })
  readonly mentee!: Ref<User>;
  @prop({ ref: 'Track', required: true, autopopulate: true })
  readonly track!: Ref<Track>;
}
