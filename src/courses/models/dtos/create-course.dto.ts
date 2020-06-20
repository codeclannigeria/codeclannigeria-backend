import { PickType } from '@nestjs/swagger';

import { CourseDto } from './course.dto';

export class CreateCourseDto extends PickType(CourseDto, [
  'title',
  'description',
  'playlistUrl'
]) {}
