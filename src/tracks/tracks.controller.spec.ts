import { Test, TestingModule } from '@nestjs/testing';

import { TracksController } from './tracks.controller';
import { TracksService } from './tracks.service';

describe('Tracks Controller', () => {
  let controller: TracksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TracksController],
      providers: [TracksService]
    })
      .overrideProvider(TracksService)
      .useValue({})
      .compile();

    controller = module.get<TracksController>(TracksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
