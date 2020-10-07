import { Test, TestingModule } from '@nestjs/testing';
import { DbTest } from '~test/helpers/db-test.module';

import { SubmissionsController } from './submissions.controller';
import { SubmissionsModule } from './submissions.module';

describe('SubmissionsController', () => {
  let controller: SubmissionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [SubmissionsModule, DbTest]
    }).compile();

    controller = await module.resolve<SubmissionsController>(
      SubmissionsController
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
