import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { UsersService } from '../users/users.service';
import { Task, TaskStatus } from './models/task.entity';

@Injectable({ scope: Scope.REQUEST })
export class TasksService extends BaseService<Task> {
  constructor(
    @InjectModel(Task.modelName)
    protected readonly taskEntity: ReturnModelType<typeof Task>,
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
  }

}
