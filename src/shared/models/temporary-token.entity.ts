import { prop, Ref, index, modelOptions } from '@typegoose/typegoose';

import { User } from '../../users/models/user.entity';
import { BaseEntity } from './base.entity';

export enum TempTokenType {
  PASSWORD = 'Password',
  EMAIL = 'Email',
}

@modelOptions({ options: { customName: 'temp_tokens' } })
@index({ expireAt: 1 }, { expireAfterSeconds: 0 })
export class TemporaryToken extends BaseEntity {
  @prop({ required: true })
  readonly token!: string;

  @prop({ required: true, type: Date })
  readonly expireAt!: Date;
  @prop({
    enum: TempTokenType,
    type: String,
    required: true,
  })
  readonly type: TempTokenType;
  @prop({ ref: User, unique: true, required: true })
  readonly user!: Ref<User>;
}
