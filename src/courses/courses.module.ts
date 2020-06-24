import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseService } from '~shared/services';

import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './models/course.entity';

const CourseModel = MongooseModule.forFeature([
  { name: Course.modelName, schema: Course.schema }
]);
@Module({
  imports: [CourseModel],
  providers: [
    CoursesService,
    { provide: BaseService, useClass: CoursesService }
  ],
  controllers: [CoursesController],
  exports: [CoursesService, CourseModel]
})
export class CoursesModule {}
