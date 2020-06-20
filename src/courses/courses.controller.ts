import { CreateCourseDto } from './models/dtos/create-course.dto';
import { CourseDto } from './models/dtos/course.dto';
import { Controller } from '@nestjs/common';
import { AbstractController } from '~shared/controllers';
import { Course } from './models/course.entity';

@Controller('courses')
export class CoursesController extends AbstractController<
  Course,
  CourseDto,
  CreateCourseDto
>({
  model: Course,
  modelCreate: CreateCourseDto,
  modelVm: CourseDto,
  auth: {
    find: true
  }
}) {}
