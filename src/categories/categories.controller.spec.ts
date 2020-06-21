import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { Category } from './models/category.entity';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { BaseService } from '~shared/services';

jest.mock('~shared/services');
const mongod = new MongoMemoryServer();

const dbFactory = MongooseModule.forRootAsync({
  useFactory: async () => {
    const uri = await mongod.getUri();

    return {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
      uri
    };
  }
});
describe('Categories Controller', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: Category.modelName, schema: Category.schema }
        ]),
        dbFactory
      ],
      controllers: [CategoriesController],
      providers: [CategoriesService, BaseService]
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
