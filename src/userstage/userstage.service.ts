import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { UsersService } from './../users/users.service';
import { UserStage } from './models/userstage.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserStageService extends BaseService<UserStage> {
  constructor(
    @InjectModel(UserStage.modelName)
    protected readonly UserStageModel: ReturnModelType<typeof UserStage>,
    protected readonly userService: UsersService
  ) {
    super(UserStageModel);
  }

  async getUserStages(trackId: string): Promise<UserStage[]> {
    const currentUser = this.getUserId();
    const userStages = await this.UserStageModel.find({
      user: currentUser,
      track: trackId
    });

    return userStages;
  }
}
