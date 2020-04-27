import {
  modelOptions,
  index,
  prop,
  Ref,
  getModelForClass,
} from '@typegoose/typegoose';
import { User } from '../../users/models/user.entity';
import { BaseEntity } from './base.entity';

@modelOptions({ options: { customName: 'temporary_tokens' } })
@index({ createdAt: 1 }, { expireAfterSeconds: 1 })
export class TemporaryToken extends BaseEntity {
  @prop({ required: true })
  readonly token!: string;

  @prop({ ref: User, unique: true, required: true })
  readonly user!: Ref<User>;

  constructor(args?: { userId: any; token: string }) {
    super();
    if (!args) return;
    const { token, userId: user } = args;
    this.token = token;
    this.user = user;
  }
  static createInstance(userId: any, token: string) {
    return new this({ userId, token });
  }
  public static getModel() {
    return getModelForClass(this);
  }
  update(entity: Partial<this>): void {}
}
