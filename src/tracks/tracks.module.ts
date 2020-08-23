import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseService } from '~shared/services';

import { MentorModule } from '../mentor/mentor.module';
import { UsersModule } from '../users/users.module';
import { Track } from './models/track.entity';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';
import { UserStage } from '../userstage/models/userstage.entity';
import { UserStageService } from '../userstage/userstage.service';

const TrackModel = MongooseModule.forFeature([
  { name: Track.modelName, schema: Track.schema }
]);
const UserStageModel = MongooseModule.forFeature([
  { name: UserStage.modelName, schema: UserStage.schema }
]);

const baseService = { provide: BaseService, useClass: TracksService };
@Module({
  imports: [TrackModel, UsersModule, MentorModule,UserStageModel],
  providers: [TracksService, baseService, UserStageService],
  controllers: [TracksController],
  exports: [TrackModel, TracksService, baseService]
})
export class TracksModule { }
