import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { Stage } from '../stages/models/stage.entity';
import { UsersService } from './../users/users.service';
import { UserStage } from './models/userstage.entity';

@Injectable({ scope: Scope.REQUEST })
export class UserStageService extends BaseService<UserStage> {

  constructor(
    @InjectModel(UserStage.modelName)
    protected readonly userStageEntity: ReturnModelType<typeof UserStage>,
    protected readonly userService: UsersService

  ) {
    super(userStageEntity);
  }

  async getStages(trackId: string): Promise<Stage> {
    const track = await (await this.entity.findById(trackId).populate("stages")).execPopulate();

    return track.stage as Stage;
  }

  async getUserStages(): Promise<UserStage> {
    const currentUser = this.getUserId();
    //use the userId to get the user's stage
    const userStage = await (await this.userStageEntity.findById(1).populate("stages")).execPopulate();

    return userStage as UserStage;
  }
}
