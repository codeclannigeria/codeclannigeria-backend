import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BaseService } from '~shared/services';
import { DbTest } from '~test/helpers/db-test.module';

import { CreateUserDto } from './models/dto/create-user.dto';
import { UsersController } from './users.controller';
import { UsersModule } from './users.module';
import { UsersService } from './users.service';


describe('Users Controller', () => {
  let controller: UsersController;
  const userService: any = {
    findOneAsync: () => "exist"
  }
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, DbTest]
    }).overrideProvider(BaseService)
      .useValue(userService)
      .overrideProvider(UsersService)
      .useValue(userService)
      .compile();

    controller = module.get<UsersController>(UsersController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
  let input: CreateUserDto;
  it('should throw conflict error', async () => {
    input = {
      email: 'email@gmail.com',
      firstName: 'firstName',
      lastName: 'lastName',
    }
    await expect(controller.create(input)).rejects.toThrowError(ConflictException)
  });
  it('should create new user', async () => {
    userService.findOneAsync = () => null;
    userService.createEntity = () => input
    userService.insertAsync = () => Promise.resolve();
    const result = await controller.create(input);
    expect(result).toMatchObject(input)
  });
});
