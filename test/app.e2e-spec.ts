import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';
import { DbTest } from './db-test.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let route: request.SuperTest<request.Test>;
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, DbTest]
    }).compile();

    app = module.createNestApplication();
    await app.init();
    route = request(app.getHttpServer());
  });

  it('/ (GET)', () => {
    return route.get('/').expect(200);
  });
});
