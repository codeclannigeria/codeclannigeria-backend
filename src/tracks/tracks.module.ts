import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Track } from './models/track.entity';
import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Track.modelName, schema: Track.schema },
    ]),
  ],
  controllers: [TracksController],
  providers: [TracksService],
})
export class TracksModule {}
