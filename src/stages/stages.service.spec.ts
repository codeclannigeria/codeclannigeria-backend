import { Test, TestingModule } from '@nestjs/testing';

import { DbTest } from '../../test/helpers/db-test.module';
import { StagesModule } from './stages.module';
import { StagesService } from './stages.service';

describe('StagesService', () => {
  let service: StagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StagesModule, DbTest]
    }).compile();

    service = await module.resolve<StagesService>(StagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
