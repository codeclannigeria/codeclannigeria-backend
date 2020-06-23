import { Track } from './../src/tracks/models/track.entity';
import { JwtPayload } from './../src/auth/models/jwt-payload';
import { RolesGuard } from '../src/auth/guards/roles.guard';
import {
  ExecutionContext,
  INestApplication,
  ValidationPipe,
  UnauthorizedException,
  BadGatewayException,
  BadRequestException,
  ForbiddenException
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
  let currentUser: JwtPayload;
  let TrackModel: ReturnModelType<typeof Track>;
  const jwtGuard = {
    canActivate: (context: ExecutionContext): boolean => {
      throw new UnauthorizedException();
    }
  };
  const rolesGuard = {
    canActivate: (context: ExecutionContext): boolean => {
      throw new ForbiddenException();
    }
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TracksModule, DbTest],
      providers: [JwtStrategy]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(jwtGuard)
      // .overrideGuard(RolesGuard)
      // .useValue(rolesGuard)
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
    currentUser = {
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
    it('should return 401 if user not logged in', () => {
      return route.post('/tracks').send(input).expect(401);
    });
    it('should return 403 if user role is neither ADMIN nor MENTOR', async () => {
      jest
        .spyOn(jwtGuard, 'canActivate')
        .mockImplementation((context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = currentUser;
          return true;
        });
      return route.post('/tracks').send(input).expect(403);
    });
    let track: Track;
    it('should return 201 if user role is permitted', async () => {
      currentUser.role = UserRole.ADMIN;
      const { body } = await route.post('/tracks').send(input).expect(201);
      track = await service.findById(body.id);
      expect(track.createdBy.toString()).toBe(currentUser.userId);
    });
    it('should return 409 for existing track title', async () => {
      return route.post('/tracks').send(input).expect(409);
    });
    it('should return 200 when track is updated', async () => {
      const newTitle = 'NEW_TITLE';
      const { body } = await route
        .put(`/tracks/${track.id}`)
        .send({ ...input, title: newTitle })
        .expect(200);

      const { updatedBy } = await service.findById(body.id);
      expect(body.title).toBe(newTitle);
      expect(updatedBy.toString()).toBe(currentUser.userId);
    });
    it('should return 403 for non-permitted user trying to UPDATE track', async () => {
      currentUser.role = UserRole.MENTEE;
      return route.put(`/tracks/${track.id}`).send(input).expect(403);
    });
    it('should return 403 for non-permitted user trying to DELETE track', async () => {
      return route.delete(`/tracks/${track.id}`).send(input).expect(403);
    });
    it('should soft delete track', async () => {
      currentUser.role = UserRole.ADMIN;

      await route.delete(`/tracks/${track.id}`).send(input).expect(200);

      const { deletedBy, isDeleted } = await TrackModel.findById(track.id);
      const res = await service.findById(track.id);

      expect(deletedBy.toString()).toBe(currentUser.userId);
      expect(isDeleted).toBe(true);
      expect(res).toBeFalsy();
    });
  });
  afterAll(async () => {
    const { collections } = mongoose.connection;

    Object.keys(collections).forEach(
      async (k) => await collections[`${k}`].deleteMany({})
    );

    await mongo.disconnect();
    await inMemoryDb.stop();
    await app.close();
  });
});
