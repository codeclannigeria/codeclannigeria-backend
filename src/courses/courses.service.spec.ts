import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { DbTest } from '../../test/db-test.module';
import { CoursesService } from './courses.service';
import { Course } from './models/course.entity';

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
