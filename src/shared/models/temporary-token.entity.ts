import { prop, Ref } from '@typegoose/typegoose';

import { User } from '../../users/models/user.entity';
import { BaseEntity } from './base.entity';

export class TemporaryToken extends BaseEntity {
  @prop({ required: true })
  readonly token!: string;

  @prop({ ref: User, unique: true, required: true })
  readonly user!: Ref<User>;
}
