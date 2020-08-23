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

  
  async getUserStages(trackId: string): Promise<UserStage[]> {
    const currentUser = this.getUserId();
    const userStage = await (await this.userStageEntity.find({user: currentUser, track: trackId}).populate("stage"));

    return userStage as UserStage[];
  }
}
