import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { UsersService } from '../users/users.service';
import { SubmissionDto } from './models/dtos/submission.dto';
import { Submission } from './models/submission.dto';
import { Task } from './models/task.entity';

@Injectable({ scope: Scope.REQUEST })
export class TasksService extends BaseService<Task> {
  constructor(
    @InjectModel(Task.modelName)
    protected readonly taskModel: ReturnModelType<typeof Task>,
    @InjectModel(Submission.modelName)
    protected readonly SubmissionModel: ReturnModelType<typeof Submission>,
    protected readonly userService: UsersService
  ) {
    super(taskModel);
  }

  async submitTask(input: SubmissionDto): Promise<void> {
    const createdBy = this.getUserId();
    const submission = await this.SubmissionModel.findOne({ task: input.taskId, createdBy });
    if (submission) {
      await this.SubmissionModel.updateOne({ _id: submission.id }, { ...input, task: input.taskId, updatedBy: createdBy } as any)
      return;
    }
    await this.SubmissionModel.create({ ...input, createdBy, task: input.taskId })
  }

}
