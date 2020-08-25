import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { Course } from './models/course.entity';

@Injectable({ scope: Scope.REQUEST })
export class CoursesService extends BaseService<Course> {
  constructor(
    @InjectModel(Course.modelName)
    protected readonly EntityModel: ReturnModelType<typeof Course>
  ) {
    super(EntityModel);
  }
}
