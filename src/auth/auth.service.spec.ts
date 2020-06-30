import { MongooseModule } from '@nestjs/mongoose';
import { Test } from '@nestjs/testing';

import { DbTest } from '../../test/helpers/db-test.module';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { TemporaryToken } from './models/temporary-token.entity';
import { TempTokensService } from './temp-token.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
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
