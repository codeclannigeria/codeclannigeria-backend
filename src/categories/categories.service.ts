import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { Category } from './models/category.entity';

export class CategoriesService extends BaseService<Category> {
  constructor(
    @InjectModel(Category.modelName)
    protected readonly entity: ReturnModelType<typeof Category>
  ) {
    super(entity);
  }
}
