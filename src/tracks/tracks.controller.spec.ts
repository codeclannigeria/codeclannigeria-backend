import { Test, TestingModule } from '@nestjs/testing';
import { BaseService } from '~shared/services';

import { TracksController } from './tracks.controller';

jest.mock('~shared/services');
describe('Tracks Controller', () => {
  let controller: TracksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TracksController],
      providers: [BaseService]
    }).compile();

    controller = module.get<TracksController>(TracksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
