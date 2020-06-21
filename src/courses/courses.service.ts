import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { Course } from './models/course.entity';

export class CoursesService extends BaseService<Course> {
  constructor(
    @InjectModel(Course.modelName)
    protected readonly entity: ReturnModelType<typeof Course>
  ) {
    super(entity);
  }
}
