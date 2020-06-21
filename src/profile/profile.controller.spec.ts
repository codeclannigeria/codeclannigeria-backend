import { Test, TestingModule } from '@nestjs/testing';

import { UsersService } from './../users/users.service';
import { ProfileController } from './profile.controller';

describe('Profile Controller', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProfileController],
      providers: [UsersService]
    })
      .overrideProvider(UsersService)
      .useValue({})
      .compile();

    controller = module.get<ProfileController>(ProfileController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
