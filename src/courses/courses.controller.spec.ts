import { BaseService } from '~shared/services';
import { Test, TestingModule } from '@nestjs/testing';
import { CoursesController } from './courses.controller';

describe('Courses Controller', () => {
  let controller: CoursesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CoursesController],
      providers: [BaseService]
    })
      .overrideProvider(BaseService)
      .useValue({})
      .compile();

    controller = module.get<CoursesController>(CoursesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
