import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { UserStage } from '../userstage/models/userstage.entity';
import { Stage } from '../stages/models/stage.entity';
import { SubmissionDto } from './models/dtos/submission.dto';
import { Submission } from './models/submission.entity';
import { Task } from './models/task.entity';

@Injectable({ scope: Scope.REQUEST })
export class TasksService extends BaseService<Task> {
  constructor(
    @InjectModel(Task.modelName)
    protected readonly taskModel: ReturnModelType<typeof Task>,
    @InjectModel(Submission.modelName)
    protected readonly submissionModel: ReturnModelType<typeof Submission>,
    @InjectModel(UserStage.modelName)
    protected readonly userStageModel: ReturnModelType<typeof UserStage>,
    @InjectModel(Stage.modelName)
    protected readonly stageModel: ReturnModelType<typeof Stage>
  ) {
    super(taskModel);
  }

  async submitTask(input: SubmissionDto, task: Task): Promise<void> {
    const createdBy = this.getUserId();
    const submission = await this.submissionModel.findOne({ task: task.id, createdBy });
    if (submission) {
      await this.submissionModel.updateOne({ _id: submission.id }, { ...input, task: task.id, updatedBy: createdBy } as any)
      return;
    }
    await this.submissionModel.create({ ...input, createdBy, task: task.id })


    const stage = await this.stageModel.findById(task.stage);
    const userStage = await this.userStageModel.findOne({ user: createdBy, stage: stage.id, createdBy })

    if (!userStage) {
      let doc = { user: createdBy, stage: stage.id, track: task.track, createdBy } as any;
      if (stage.taskCount > 0) {
        doc = { ...doc, taskRemaining: stage.taskCount - 1 };
      }
      else {
        doc = { ...doc, taskRemaining: 0, isCompleted: true };
      }
      this.userStageModel.create(doc)
      return;
    }

    //user has the stage in the table, decrement their pending tasks by 1
    if (userStage.taskRemaining > 1) {
      await this.userStageModel.updateOne(
        { _id: userStage.id },
        {
          $inc: { taskRemaining: -1 }
        }
      );
    }
    else if (userStage.taskRemaining <= 1) {
      //user has completed the stage
      await this.userStageModel.updateOne(
        { _id: userStage.id },
        {
          $set: { taskRemaining: 0 }
        },
        {
          $set: { isCompleted: true }
        }
      );
    }

  }

}
