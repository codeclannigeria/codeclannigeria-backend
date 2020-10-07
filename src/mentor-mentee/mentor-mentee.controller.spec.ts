import { Test, TestingModule } from '@nestjs/testing';
import { MentorMenteeController } from './mentor-mentee.controller';

describe('MentorMenteeController', () => {
  let controller: MentorMenteeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MentorMenteeController],
    }).compile();

    controller = module.get<MentorMenteeController>(MentorMenteeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
