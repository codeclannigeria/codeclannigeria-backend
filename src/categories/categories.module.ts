import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { Category } from './models/category.entity';
import { CategoriesController } from './categories.controller';
import { CategoryService } from './categories.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Category.modelName, schema: Category.schema },
    ]),
  ],
  controllers: [CategoriesController],
  providers: [CategoryService],
})
export class CategoriesModule {}
