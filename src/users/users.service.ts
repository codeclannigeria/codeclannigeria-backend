import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { BaseService } from '../shared/services/base.service';
import { User } from './models/user.entity';

@Injectable({ scope: Scope.REQUEST })
export class UsersService extends BaseService<User> {
  constructor(
    @InjectModel(User.modelName)
    protected readonly userEntity: ReturnModelType<typeof User>
  ) {
    super(userEntity);
  }

  async incrementLoginAttempt(userId: string): Promise<void> {
    await this.userEntity.updateOne({ _id: userId }, { $inc: { loginAttemptCount: 1 }, updatedBy: userId as any }).exec();
  }
  async resetLoginAttempt(userId: string): Promise<void> {
    await this.userEntity.updateOne({ _id: userId }, { $set: { loginAttemptCount: 0 }, updatedBy: userId as any }).exec();
  }
}
