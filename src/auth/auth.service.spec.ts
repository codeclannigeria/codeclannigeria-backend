import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { TemporaryToken } from '~shared/models/temporary-token.entity';

import { DbTest } from '../../test/db-test.module';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { TempTokensService } from './temp-token.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DbTest,
        MongooseModule.forFeature([
          { name: TemporaryToken.modelName, schema: TemporaryToken.schema }
        ]),
        UsersModule
      ],
      providers: [AuthService, TempTokensService]
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
