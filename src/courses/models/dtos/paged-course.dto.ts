import { PagedOutputDto } from '~shared/models/dto/paged-out.dto';

import { CourseDto } from './course.dto';

export class PagedCourseResDto extends PagedOutputDto(CourseDto) {}
