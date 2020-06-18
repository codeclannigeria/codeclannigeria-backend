import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Track } from './models/track.entity';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

const trackModelConfig = MongooseModule.forFeature([
  { name: Track.modelName, schema: Track.schema }
]);
@Module({
  imports: [trackModelConfig],
  controllers: [TracksController],
  providers: [TracksService],
  exports: [trackModelConfig]
})
export class TracksModule {}
