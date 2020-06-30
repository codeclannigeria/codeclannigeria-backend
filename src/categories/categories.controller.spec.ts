import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BaseService } from '~shared/services';

import { DbTest } from '../../test/helpers/db-test.module';
import { CategoriesController } from './categories.controller';
import { CategoriesModule } from './categories.module';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './models/dtos/create-category.dto';



describe('Categories Controller', () => {
  let controller: CategoriesController;
  const categoryService: any = {
    findOneAsync: () => "exist"
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [CategoriesModule, DbTest]
    }).overrideProvider(BaseService)
      .useValue(categoryService).
      overrideProvider(CategoriesService)
      .useValue(categoryService)
      .compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  let input: CreateCategoryDto;
  it('should throw conflict error', async () => {
    input = { description: 'description', name: 'name' }
    await expect(controller.create(input)).rejects.toThrowError(ConflictException)
  });
  it('should create new category', async () => {
    categoryService.findOneAsync = () => null;
    categoryService.createEntity = () => input
    categoryService.insertAsync = () => Promise.resolve();
    const result = await controller.create(input);
    expect(result).toMatchObject(input)
  });
});
