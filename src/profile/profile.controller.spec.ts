import { Test, TestingModule } from '@nestjs/testing';
import { DbTest } from '~test/helpers/db-test.module';

import { UsersService } from '../users/users.service';
import { ProfileController } from './profile.controller';
import { ProfileModule } from './profile.module';

describe('Profile Controller', () => {
  let controller: ProfileController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ProfileModule, DbTest]
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
