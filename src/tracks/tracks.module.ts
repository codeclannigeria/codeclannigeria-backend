import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { SharedModule } from '../shared/shared.module';
import { Track } from './models/track.entity';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

const TrackModel = MongooseModule.forFeature([
  { name: Track.modelName, schema: Track.schema }
]);
@Module({
  imports: [TrackModel, SharedModule],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [TrackModel, TracksService]
})
export class TracksModule {}
