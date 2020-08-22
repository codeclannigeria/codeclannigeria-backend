import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Submission } from '../tasks/models/submission.entity';
import { TrackMentor } from '../tracks/models/track-mentor.entity';
import { UsersModule } from '../users/users.module';
import { MentorController } from './mentor.controller';
import { MentorService } from './mentor.service';
import { MentorMentee } from './models/mento-mentee.entity';

export const MentorMenteeModel = MongooseModule.forFeature([
  { name: MentorMentee.modelName, schema: MentorMentee.schema }
]);
const TrackMentorModel = MongooseModule.forFeature([
  { name: TrackMentor.modelName, schema: TrackMentor.schema }
]);
const SubmissionModel = MongooseModule.forFeature([
  { name: Submission.modelName, schema: Submission.schema }
]);
@Module({
  imports: [MentorMenteeModel, TrackMentorModel, SubmissionModel, UsersModule],
  controllers: [MentorController],
  providers: [MentorService],
  exports: [MentorService, TrackMentorModel]
})
export class MentorModule { }
