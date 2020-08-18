import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { UsersService } from '../users/users.service';
import { Task, TaskStatus } from './models/task.entity';
import { Stage } from '../stages/models/stage.entity';
import { User } from '../users/models/user.entity';
import { UserStage } from '../userstage/models/userstage.entity';

@Injectable({ scope: Scope.REQUEST })
export class TasksService extends BaseService<Task> {
  constructor(
    @InjectModel(Task.modelName)
    protected readonly taskEntity: ReturnModelType<typeof Task>,
    @InjectModel(Stage.modelName)
    protected readonly stageEntity: ReturnModelType<typeof Stage>,
    @InjectModel(User.modelName)
    protected readonly userEntity: ReturnModelType<typeof User>,
    @InjectModel(UserStage.modelName)
    protected readonly userStageEntity: ReturnModelType<typeof UserStage>,
    protected readonly userService: UsersService
  ) {
    super(taskEntity);
  }

  // async assignTasks(userId: string, taskIdList: string[]): Promise<void> {
  //   await this.userService.updateAsync(userId, {
  //     $addToSet: { tasks: taskIdList }
  //   } as any);
  // }
  async submitTask(task: Task): Promise<void> {

    await this.taskEntity.updateOne(
      { _id: task.id },
      {
        status: TaskStatus.COMPLETED, updatedBy: this.getUserId()
      });
    const stage =  await this.stageEntity.findById(task.stage);
    //check if the user has the stage recorded in the table
    const currentUser = this.getUserId();
    const userStage = await this.userStageEntity.findOne({user:currentUser, stage:stage.id})
    //if no, insert it
    if (!userStage){
      if (stage.taskCount > 1){
        this.userStageEntity.create({user: currentUser, stage : stage.id, track : task.track, taskRemaining : stage.taskCount - 1})
      }
      else{
        this.userStageEntity.create({user: currentUser, stage : stage.id, track: task.track, taskRemaining : 0, isCompleted : true})
      }
    }

    //else if the user has the stage in the table reduce their taskremaining by 1
    else if (userStage.taskRemaining > 1){

      await this.userStageEntity.updateOne(
        {_id: userStage.id},
          {
            $inc : {taskRemaining : -1}
          }
        );
    }
    else if (userStage.taskRemaining <= 1){
      //user has completed the stage
      await this.userStageEntity.updateOne(
        {_id: userStage.id},
          {
            $set : {taskRemaining : 0}
          }, 
          {
            $set : {isCompleted : true}
          }
        );
    }
  
  }

}
