import { INestApplication } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as request from 'supertest';

import { AppModule } from '../src/app.module';

jest.mock('~shared/services/base.service');

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', async () => {
    const result = await request(app.getHttpServer()).get('/').expect(200);
    expect(result.text).toBe('Welcome to CCN!');
  });
  afterAll(async () => {
    await app.close();
  });
});
