import { Test, TestingModule } from '@nestjs/testing';
import { DbTest } from '~test/db-test.module';

import { TasksModule } from './tasks.module';
import { TasksService } from './tasks.service';

describe('TasksService', () => {
  let service: TasksService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TasksModule, DbTest]
    }).compile();

    service = await module.resolve<TasksService>(TasksService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
