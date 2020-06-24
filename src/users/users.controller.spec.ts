import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { MongoMemoryServer } from 'mongodb-memory-server';

import { User } from './models/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { BaseService } from '~shared/services';

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

describe('Users Controller', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        MongooseModule.forFeature([
          { name: User.modelName, schema: User.schema }
        ]),
        dbFactory
      ],
      controllers: [UsersController],
      providers: [
        UsersService,
        { provide: BaseService, useClass: UsersService }
      ]
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
