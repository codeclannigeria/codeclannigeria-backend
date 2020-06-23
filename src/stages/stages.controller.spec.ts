import { DbTest } from '../../test/db-test.module';
import { Test, TestingModule } from '@nestjs/testing';

import { StagesController } from './stages.controller';
import { StagesModule } from './stages.module';

describe('Stages Controller', () => {
  let controller: StagesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StagesModule, DbTest]
    }).compile();

    controller = module.get<StagesController>(StagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
