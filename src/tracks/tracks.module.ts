import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseService } from '~shared/services';

import { Track } from './models/track.entity';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

const TrackModel = MongooseModule.forFeature([
  { name: Track.modelName, schema: Track.schema }
]);
@Module({
  imports: [TrackModel],
  providers: [TracksService, { provide: BaseService, useClass: TracksService }],
  controllers: [TracksController],
  exports: [TrackModel, TracksService]
})
export class TracksModule {}
