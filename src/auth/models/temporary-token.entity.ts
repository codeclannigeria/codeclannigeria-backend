import { index, modelOptions, prop, Ref } from '@typegoose/typegoose';

import { User } from '../../users/models/user.entity';
import { BaseEntity } from '../../shared/models/base.entity';

export enum TokenType {
  PASSWORD = 'PASSWORD_TOKEN',
  EMAIL = 'EMAIL_TOKEN'
}

@index({ user: 1, type: 1 }, { unique: true })
@modelOptions({ options: { customName: 'temptokens' } })
@index({ expireAt: 1 }, { expireAfterSeconds: 0 })
export class TemporaryToken extends BaseEntity {
  @prop({ required: true })
  readonly token!: string;

  @prop({ required: true, type: Date })
  readonly expireAt!: Date;

  @prop({
    enum: TokenType,
    type: String,
    unique: false,
    required: true
  })
  readonly type?: TokenType;

  @prop({ ref: User, unique: false, required: true })
  readonly user?: Ref<User>;
}
