import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseService } from '~shared/services';

import { StagesModule } from '../stages/stages.module';
import { TracksModule } from '../tracks/tracks.module';
import { UsersModule } from '../users/users.module';
import { UserStage } from '../userstage/models/userstage.entity';
import { Submission } from './models/submission.dto';
import { Task } from './models/task.entity';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';

const TaskModel = MongooseModule.forFeature([
  { name: Task.modelName, schema: Task.schema }
]);
const UserStageModel = MongooseModule.forFeature([
  { name: UserStage.modelName, schema: UserStage.schema }
]);
const SubmissionModel = MongooseModule.forFeature([
  { name: Submission.modelName, schema: Submission.schema }
]);
const baseService = { provide: BaseService, useClass: TasksService };
@Module({
  imports: [TaskModel, StagesModule, SubmissionModel, TracksModule, UsersModule, UserStageModel],
  providers: [TasksService, baseService],
  controllers: [TasksController],
  exports: [TaskModel, TasksService, baseService]
})
export class TasksModule { }
