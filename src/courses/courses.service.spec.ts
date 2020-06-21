import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { CoursesService } from './courses.service';
import { Course } from './models/course.entity';
import { DbTest } from '../../test/db-test.module';

describe('CoursesService', () => {
  let service: CoursesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DbTest,
        MongooseModule.forFeature([
          { name: Course.modelName, schema: Course.schema }
        ])
      ],
      providers: [CoursesService]
    }).compile();

    service = await module.resolve<CoursesService>(CoursesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
