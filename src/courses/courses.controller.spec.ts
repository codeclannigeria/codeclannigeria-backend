import { Test, TestingModule } from '@nestjs/testing';

import { DbTest } from '../../test/db-test.module';
import { CoursesController } from './courses.controller';
import { CoursesModule } from './courses.module';

describe('Courses Controller', () => {
  let controller: CoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CoursesModule, DbTest]
    }).compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
