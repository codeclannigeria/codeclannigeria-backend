import { prop, Ref } from '@typegoose/typegoose';

import { BaseEntity } from '../../shared/models/base.entity';
import { User } from '../../users/models/user.entity';
import { Track } from './track.entity';

export class TrackMentor extends BaseEntity{
    @prop({ ref: 'User', default: null })
    readonly mentor: Ref<User>;
    @prop({ ref: 'Track', default: null })
    readonly track: Ref<Track>;
}