import { Test, TestingModule } from '@nestjs/testing';
import { DbTest } from '~test/helpers/db-test.module';

import { MentorMenteeController } from './mentor-mentee.controller';
import { MentorMenteeModule } from './mentor-mentee.module';

describe('MentorMenteeController', () => {
  let controller: MentorMenteeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MentorMenteeModule, DbTest]
    }).compile();

    controller = module.get<MentorMenteeController>(MentorMenteeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
