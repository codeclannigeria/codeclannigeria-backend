import { prop, Ref } from '@typegoose/typegoose';
import { BaseEntity } from '~shared/models/base.entity';

import { Track } from '../../tracks/models/track.entity';
import { User } from '../../users/models/user.entity';

export class MentorMentee extends BaseEntity {
  @prop({ ref: 'User', required: true })
  readonly mentor!: Ref<User>;
  @prop({ ref: 'User', required: true })
  readonly mentee!: Ref<User>;
  @prop({ ref: 'Track', required: true })
  readonly track!: Ref<Track>;
}
