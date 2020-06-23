import { Track } from './../src/tracks/models/track.entity';
import { JwtPayload } from './../src/auth/models/jwt-payload';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
  UnauthorizedException
} from '@nestjs/common';
import { ContextIdFactory } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import {
  getModelForClass,
  mongoose,
  ReturnModelType
} from '@typegoose/typegoose';
import * as request from 'supertest';

import { JwtAuthGuard } from '../src/auth/guards';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';
import { CreateTrackDto } from '../src/tracks/models/dto/create-track.dto';
import { TracksModule } from '../src/tracks/tracks.module';
import { TracksService } from '../src/tracks/tracks.service';
import { User, UserRole } from '../src/users/models/user.entity';
import { DbTest, inMemoryDb } from './db-test.module';

describe('TracksController (e2e)', () => {
  let app: INestApplication;
  let route: request.SuperTest<request.Test>;
  let service: TracksService;
  let mongo: typeof mongoose;
  const validEmail = 'email@gmail.com';
  const validPass = 'pass@45Pdd';
  let jwtPayload: JwtPayload;
  let TrackModel: ReturnModelType<typeof Track>;
  const jwtGuard = {
    canActivate: (context: ExecutionContext): boolean => {
      throw new UnauthorizedException();
    }
  };
  const rolesGuard = {
    // canActivate: (context: ExecutionContext) => {
    //   // const req = context.switchToHttp().getRequest();
    //   // req.user = 'user';
    //   return false;
    // }
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TracksModule, DbTest],
      providers: [JwtStrategy]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(jwtGuard)
      .overrideGuard(RolesGuard)
      .useValue(rolesGuard)
      .compile();

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
    const contextId = ContextIdFactory.getByRequest(request);
    service = await module.resolve<TracksService>(TracksService, contextId);

    const { uri } = await inMemoryDb.runningInstance;
    mongoose.Promise = Promise;
    mongo = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    TrackModel = getModelForClass(Track, { existingMongoose: mongo });
    const UserModel = getModelForClass(User);

    const user = await UserModel.create({
      email: validEmail,
      firstName: 'firstName',
      lastName: 'lastName',
      password: validPass
    });
    jwtPayload = {
      email: user.email,
      userId: user.id,
      role: user.role
    };
    route = request(app.getHttpServer());
  });

  describe('/tracks (POST)', () => {
    const input: CreateTrackDto = {
      title: 'Track1',
      description: 'Description'
    };
    it('should 401 if user not logged in', () => {
      return route.post('/tracks').send(input).expect(401);
    });
    it('should create track and return 201', async () => {
      jest
        .spyOn(jwtGuard, 'canActivate')
        .mockImplementation((context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = jwtPayload;
          return true;
        });
      const { body } = await route.post('/tracks').send(input).expect(201);
      const tracks = await TrackModel.find();
      console.log(body);
    });
  });
  afterAll(async () => {
    const { collections } = mongoose.connection;

    Object.keys(collections).forEach(async (k) => {
      console.log(k);
      const { result } = await collections[`${k}`].deleteMany({});
      console.log(result);
    });

    await mongo.disconnect();
    await inMemoryDb.stop();
    await app.close();
  });
});
