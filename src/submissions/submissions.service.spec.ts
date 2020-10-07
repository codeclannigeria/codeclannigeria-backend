import { Test, TestingModule } from '@nestjs/testing';
import { DbTest } from '~test/helpers/db-test.module';

import { SubmissionsModule } from './submissions.module';
import { SubmissionsService } from './submissions.service';

describe('SubmissionsService', () => {
  let service: SubmissionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SubmissionsModule, DbTest]
    }).compile();

    service = await module.resolve<SubmissionsService>(SubmissionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
