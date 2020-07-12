import { Test, TestingModule } from '@nestjs/testing';
import { DbTest } from '~test/helpers/db-test.module';

import { TracksModule } from './tracks.module';
import { TracksService } from './tracks.service';



describe('TracksService', () => {
  let service: TracksService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TracksModule, DbTest],
    }).compile();

    service = await module.resolve<TracksService>(TracksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
