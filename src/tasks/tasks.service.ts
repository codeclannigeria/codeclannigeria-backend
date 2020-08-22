import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { Stage } from '../stages/models/stage.entity';
import { TrackMentor } from '../tracks/models/track-mentor.entity';
import { UserStage } from '../userstage/models/userstage.entity';
import { CreateSubmissionDto } from './models/dtos/create-subission.dto';
import { Submission } from './models/submission.entity';
import { Task } from './models/task.entity';

@Injectable({ scope: Scope.REQUEST })
export class TasksService extends BaseService<Task> {

  constructor(
    @InjectModel(Task.modelName)
    protected readonly TaskModel: ReturnModelType<typeof Task>,
    @InjectModel(TrackMentor.modelName)
    protected readonly TrackMentorModel: ReturnModelType<typeof TrackMentor>,
    @InjectModel(Submission.modelName)
    protected readonly SubmissionModel: ReturnModelType<typeof Submission>,
    @InjectModel(UserStage.modelName)
    protected readonly UserStageModel: ReturnModelType<typeof UserStage>,
    @InjectModel(Stage.modelName)
    protected readonly StageModel: ReturnModelType<typeof Stage>
  ) {
    super(TaskModel);
  }
  async getUserSubmissions(taskId: string): Promise<Submission[]> {
    return this.SubmissionModel.find({ task: taskId, createdBy: this.getUserId() });
  }
  async submitTask(input: CreateSubmissionDto, task: Task): Promise<void> {
    const createdBy = this.getUserId();
    const submission = await this.SubmissionModel.findOne({ task: task.id, createdBy });
    if (submission) {
      await this.SubmissionModel.updateOne({ _id: submission.id }, { ...input, task: task.id, updatedBy: createdBy } as any)
      return;
    }

    const trackMentor = await this.TrackMentorModel.findOne({ track: task.track });
    await this.SubmissionModel.create({ ...input, createdBy, task: task.id, mentor: trackMentor.mentor })

    /** move user to next stage */
    await this.moveToNextStage(createdBy, task);

  }

  private async moveToNextStage(createdBy: string, task: Task): Promise<void> {
    const stage = await this.StageModel.findById(task.stage);
    const userStage = await this.UserStageModel.findOne({ user: createdBy, stage: stage.id, createdBy })


    if (!userStage) { // user has completed first task in this stage
      let doc = { user: createdBy, stage: stage.id, track: task.track, createdBy } as any;
      if (stage.taskCount > 0) {
        doc = { ...doc, taskRemaining: stage.taskCount - 1 };
      }
      else {
        doc = { ...doc, taskRemaining: 0, isCompleted: true };
      }
      await this.UserStageModel.create(doc);
      return;
    }
    if (userStage.taskRemaining > 1) { // user has completed next task in this stage
      await this.UserStageModel.updateOne(
        { _id: userStage.id },
        {
          $inc: { taskRemaining: -1 }
        }
      );
    }
    else if (userStage.taskRemaining <= 1) { // user has completed all tasks in this stage
      await this.UserStageModel.updateOne(
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
