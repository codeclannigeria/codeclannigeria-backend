import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { DbTest } from '../../test/db-test.module';
import { CategoriesController } from './categories.controller';
import { CategoriesModule } from './categories.module';

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
      imports: [CategoriesModule, DbTest]
    }).compile();

    controller = module.get<CategoriesController>(CategoriesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
