import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { Track } from './models/track.entity';
import { TracksService } from './tracks.service';
import { MongoMemoryServer } from 'mongodb-memory-server';

const mongod = new MongoMemoryServer();

const dbFactory = MongooseModule.forRootAsync({
  useFactory: async () => {
    const uri = await mongod.getUri();

    return {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      uri
    };
  }
});

describe('TracksService', () => {
  let service: TracksService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: Track.modelName, schema: Track.schema }
        ]),
        dbFactory
      ],
      providers: [TracksService]
    }).compile();

    service = await module.resolve<TracksService>(TracksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
