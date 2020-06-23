import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseService } from '~shared/services';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './models/category.entity';

const CategoryModel = MongooseModule.forFeature([
  { name: Category.modelName, schema: Category.schema }
]);
@Module({
  imports: [CategoryModel],
  providers: [
    CategoriesService,
    { provide: BaseService, useClass: CategoriesService }
  ],
  controllers: [CategoriesController],
  exports: [CategoriesService, CategoryModel]
})
export class CategoriesModule {}
