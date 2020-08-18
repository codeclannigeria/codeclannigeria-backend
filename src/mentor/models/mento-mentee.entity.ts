import { prop, Ref } from '@typegoose/typegoose';
import { BaseEntity } from '~shared/models/base.entity';

import { User } from '../../users/models/user.entity';

export class MentorMentee extends BaseEntity {
    @prop({ ref: 'User', default: null })
    readonly mentor: Ref<User>;
    @prop({ ref: 'User', default: null })
    readonly mentee: Ref<User>;
}