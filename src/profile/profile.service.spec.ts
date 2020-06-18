import { Test, TestingModule } from '@nestjs/testing';

import { DbTest } from '../../test/db-test.module';
import { UsersModule } from '../users/users.module';
import { ProfileService } from './profile.service';

describe('ProfileService', () => {
  let service: ProfileService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [UsersModule, DbTest],
      providers: [ProfileService]
    }).compile();

    service = module.get<ProfileService>(ProfileService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
