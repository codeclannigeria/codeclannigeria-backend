import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MailService } from '~shared/mail/mail.service';
import { BaseService } from '~shared/services';

import { CoursesModule } from '../courses/courses.module';
import { StagesModule } from '../stages/stages.module';
import { TrackMentor } from '../tracks/models/track-mentor.entity';
import { TracksModule } from '../tracks/tracks.module';
import { UsersModule } from '../users/users.module';
import { UserStage } from '../userstage/models/userstage.entity';
import { Submission } from './models/submission.entity';
import { Task } from './models/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

const TaskModel = MongooseModule.forFeature([
  { name: Task.modelName, schema: Task.schema }
]);
const TrackMentorModel = MongooseModule.forFeature([
  { name: TrackMentor.modelName, schema: TrackMentor.schema }
]);
const UserStageModel = MongooseModule.forFeature([
  { name: UserStage.modelName, schema: UserStage.schema }
]);
const SubmissionModel = MongooseModule.forFeature([
  { name: Submission.modelName, schema: Submission.schema }
]);
const baseService = { provide: BaseService, useClass: TasksService };
@Module({
  imports: [
    TaskModel,
    StagesModule,
    CoursesModule,
    TrackMentorModel,
    SubmissionModel,
    TracksModule,
    UsersModule,
    UserStageModel
  ],
  providers: [TasksService, MailService, baseService],
  controllers: [TasksController],
  exports: [TaskModel, TasksService, baseService]
})
export class TasksModule {}
