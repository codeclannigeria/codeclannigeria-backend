import { Test, TestingModule } from '@nestjs/testing';
import { DbTest } from '~test/helpers/db-test.module';

import { MentorController } from './mentor.controller';
import { MentorModule } from './mentor.module';

describe('Mentor Controller', () => {
  let controller: MentorController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MentorModule, DbTest],
    }).compile();

    controller = module.get<MentorController>(MentorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
