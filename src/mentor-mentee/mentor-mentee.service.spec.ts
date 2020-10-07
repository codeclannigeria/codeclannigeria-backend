import { Test, TestingModule } from '@nestjs/testing';
import { MentorMenteeService } from './mentor-mentee.service';

describe('MentorMenteeService', () => {
  let service: MentorMenteeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MentorMenteeService],
    }).compile();

    service = module.get<MentorMenteeService>(MentorMenteeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
