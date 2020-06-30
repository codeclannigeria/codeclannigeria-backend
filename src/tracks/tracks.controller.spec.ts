import { Test, TestingModule } from '@nestjs/testing';

import { DbTest } from '../../test/helpers/db-test.module';
import { TracksController } from './tracks.controller';
import { TracksModule } from './tracks.module';

jest.mock('~shared/services');
describe('Tracks Controller', () => {
  let controller: TracksController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TracksModule, DbTest]
    }).compile();

    controller = module.get<TracksController>(TracksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
