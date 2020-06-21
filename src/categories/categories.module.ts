import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Category } from './models/category.entity';

const CategoryModel = MongooseModule.forFeature([
  { name: Category.modelName, schema: Category.schema }
]);
@Module({
  imports: [CategoryModel],
  controllers: [CategoriesController],
  providers: [CategoriesService],
  exports: [CategoriesService, CategoryModel]
})
export class CategoriesModule {}
