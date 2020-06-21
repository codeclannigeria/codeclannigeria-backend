import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';

import { CreateTrackDto } from '../src/tracks/models/dto/create-track.dto';
import { TracksModule } from '../src/tracks/tracks.module';
import { DbTest } from './db-test.module';

// process.env.API_AUTH_ENABLED = 'true';

describe('TracksController (e2e)', () => {
  let app: INestApplication;
  let route: request.SuperTest<request.Test>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TracksModule, DbTest]
    }).compile();

    app = module.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidUnknownValues: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
          enableImplicitConversion: true
        }
      })
    );

    await app.init();
    route = request(app.getHttpServer());
  });

  describe('/tracks (POST)', () => {
    const input: CreateTrackDto = {
      title: 'Track1',
      description: 'Description'
    };
    it('should create track and return 201', () => {
      return route.post('/tracks').send(input).expect(201);
    });
  });
  afterAll(async () => {
    await app.close();
  });
});
