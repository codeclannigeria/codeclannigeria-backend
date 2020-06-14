import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '@shared/services';
import { ReturnModelType } from '@typegoose/typegoose';

import { Category } from './models/category.entity';

@Injectable({ scope: Scope.REQUEST })
export class CategoryService extends BaseService<Category> {
  constructor(
    @InjectModel(Category.modelName)
    protected readonly categoryEntity: ReturnModelType<typeof Category>,
  ) {
    super(categoryEntity);
  }
  async InsertCategory(categoryname: string){
    const newCat = new this.categoryEntity({category:categoryname});
   var result = await newCat.save();
   return result.id;
  }

  async GetAllCategories(){
   const categories = await this.categoryEntity.find({isDeleted:false}).exec();
   return categories.map(cat => ({id:cat.id, name : cat.name}));
  }
}
