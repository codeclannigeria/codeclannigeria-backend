import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import * as fs from 'fs';
import configuration from '~shared/config/configuration';
import { MailService } from '~shared/mail/mail.service';
import { BaseService } from '~shared/services';

import { MentorMentee } from '../mentor/models/mentor-mentee.entity';
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
    protected readonly StageModel: ReturnModelType<typeof Stage>,
    @InjectModel(MentorMentee.modelName)
    protected readonly MentorMenteeModel: ReturnModelType<typeof MentorMentee>,
    protected readonly mailService: MailService
  ) {
    super(TaskModel);
  }
  async getUserSubmissions(taskId: string): Promise<Submission[]> {
    return this.SubmissionModel.find({
      task: taskId,
      createdBy: this.getUserId()
    }).populate('mentee', 'firstName lastName');
  }
  async submitTask(
    input: CreateSubmissionDto,
    task: Task
  ): Promise<Submission> {
    const createdBy = this.getUserId();
    let submission = await this.SubmissionModel.findOne({
      task: task.id,
      createdBy
    });
    if (submission) {
      submission = await this.SubmissionModel.updateOne(
        { _id: submission.id },
        { ...input, updatedBy: createdBy } as any
      );
      return submission;
    }
    const mentorMentee = await this.MentorMenteeModel.findOne({
      mentee: createdBy,
      track: task.track
    });
    const trackMentor = await this.TrackMentorModel.findOne({
      track: task.track,
      mentor: mentorMentee.mentor
    });
    submission = await (
      await this.SubmissionModel.create({
        ...input,
        createdBy,
        task: task.id,
        mentee: createdBy,
        mentor: trackMentor.mentor
      })
    )
      .populate('mentee task mentor', 'firstName lastName title taskUrl email')
      .execPopulate();
    this.notifyMentorOfSubmission(submission);

    /** move user to next stage */
    await this.moveToNextStage(createdBy, task);
    return submission;
  }
  private async notifyMentorOfSubmission(submission: Submission) {
    const { mentor, mentee, task }: any = submission;
    let html = await fs.promises.readFile(
      './src/templates/mentee-task-submission-notif.html',
      { encoding: 'utf8' }
    );
    html = html
      .replace('%menteeName%', `${mentee.firstName} ${mentee.lastName}`)
      .replace('%taskTitle%', task.title)
      .replace('%taskUrl%', task.taskUrl);

    this.mailService.sendMailAsync({
      from: configuration().appEmail,
      to: mentor.email,
      html,
      date: new Date(Date.now()),
      subject: 'Mentee Task Submission'
    });
  }

  private async moveToNextStage(createdBy: string, task: Task): Promise<void> {
    const stage = await this.StageModel.findById(task.stage);
    const userStage = await this.UserStageModel.findOne({
      user: createdBy,
      stage: stage.id,
      createdBy
    });

    if (!userStage) {
      // user has completed first task in this stage
      let doc = {
        user: createdBy,
        stage: stage.id,
        track: task.track,
        createdBy
      } as any;
      if (stage.taskCount > 0) {
        doc = { ...doc, taskRemaining: stage.taskCount - 1 };
      } else {
        doc = { ...doc, taskRemaining: 0, isCompleted: true };
      }
      await this.UserStageModel.create(doc);
      return;
    }
    if (userStage.taskRemaining > 1) {
      // user has completed next task in this stage
      await this.UserStageModel.updateOne(
        { _id: userStage.id },
        {
          $inc: { taskRemaining: -1 }
        }
      );
    } else if (userStage.taskRemaining <= 1) {
      // user has completed all tasks in this stage
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
