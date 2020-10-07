import { Test, TestingModule } from '@nestjs/testing';
import { DbTest } from '~test/helpers/db-test.module';

import { MentorMenteeModule } from './mentor-mentee.module';
import { MentorMenteeService } from './mentor-mentee.service';

describe('MentorMenteeService', () => {
  let service: MentorMenteeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MentorMenteeModule, DbTest]
    }).compile();

    service = await module.resolve<MentorMenteeService>(MentorMenteeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
