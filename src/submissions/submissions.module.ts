import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Submission } from '~/tasks/models/submission.entity';
import { BaseService } from '~shared/services';

import { SubmissionsController } from './submissions.controller';
import { SubmissionsService } from './submissions.service';

const SubmissionModel = MongooseModule.forFeature([
  { name: Submission.modelName, schema: Submission.schema }
]);
const baseService = { provide: BaseService, useClass: SubmissionsService };

@Module({
  imports: [SubmissionModel],
  controllers: [SubmissionsController],
  providers: [SubmissionsService, baseService],
  exports: [SubmissionModel, SubmissionsService, baseService]
})
export class SubmissionsModule {}
