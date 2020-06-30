import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { DbTest } from '../../test/helpers/db-test.module';
import { CategoriesService } from './categories.service';
import { Category } from './models/category.entity';

describe('CategoriesService', () => {
  let service: CategoriesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DbTest,
        MongooseModule.forFeature([
          { name: Category.modelName, schema: Category.schema }
        ])
      ],
      providers: [CategoriesService]
    }).compile();

    service = await module.resolve<CategoriesService>(CategoriesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
