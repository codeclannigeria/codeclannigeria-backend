import { Test, TestingModule } from '@nestjs/testing';
import { DbTest } from '~test/helpers/db-test.module';

import { MentorModule } from './mentor.module';
import { MentorService } from './mentor.service';

describe('MentorService', () => {
  let service: MentorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MentorModule, DbTest],
    }).compile();

    service = module.get<MentorService>(MentorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
