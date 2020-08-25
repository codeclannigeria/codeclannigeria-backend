import {
  ExecutionContext,
  INestApplication,
  UnauthorizedException,
  ValidationPipe
} from '@nestjs/common';
import { ContextIdFactory } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import {
  getModelForClass,
  mongoose,
  ReturnModelType
} from '@typegoose/typegoose';
import * as request from 'supertest';

import { JwtAuthGuard } from '../src/auth/guards/jwt-auth.guard';
import { JwtPayload } from '../src/auth/models/jwt-payload';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';
import { CreateStageDto } from '../src/stages/models/dtos/create-stage.dto';
import { Stage } from '../src/stages/models/stage.entity';
import { StagesModule } from '../src/stages/stages.module';
import { StagesService } from '../src/stages/stages.service';
import { Track } from '../src/tracks/models/track.entity';
import { TracksService } from '../src/tracks/tracks.service';
import { User, UserRole } from '../src/users/models/user.entity';
import { DbTest, inMemoryDb } from './helpers/db-test.module';

describe('StagesController (e2e)', () => {
  let app: INestApplication;
  let route: request.SuperTest<request.Test>;
  let trackService: TracksService;
  let stageService: StagesService;

  let mongo: typeof mongoose;
  const validEmail = 'email@gmail.com';
  const validPass = 'pass@45Pdd';
  let currentUser: JwtPayload;
  let TrackModel: ReturnModelType<typeof Track>;
  let StageModel: ReturnModelType<typeof Stage>;
  const jwtGuard = {
    canActivate: (context: ExecutionContext): boolean => {
      const req = context.switchToHttp().getRequest();
      req.user = currentUser;
      throw new UnauthorizedException();
    }
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StagesModule, DbTest],
      providers: [JwtStrategy]
    })
      .overrideGuard(JwtAuthGuard)
      .useValue(jwtGuard)
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
    stageService = await module.resolve<StagesService>(
      StagesService,
      contextId
    );
    trackService = await module.resolve<TracksService>(
      TracksService,
      contextId
    );
    const { uri } = await inMemoryDb.runningInstance;
    mongoose.Promise = Promise;
    mongo = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    TrackModel = getModelForClass(Track, { existingMongoose: mongo });
    StageModel = getModelForClass(Stage, { existingMongoose: mongo });

    const UserModel = getModelForClass(User, { existingMongoose: mongo });
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

  describe('/stages (POST)', () => {
    const input: CreateStageDto = {
      title: 'Stage1',
      description: 'Description',
      track: '',
      taskCount: 1
    };
    it('should return 401 if user not logged in', () => {
      return route.post('/stages').send(input).expect(401);
    });
    it('should return 403 if user role is neither ADMIN nor MENTOR', async () => {
      jest
        .spyOn(jwtGuard, 'canActivate')
        .mockImplementation((context: ExecutionContext) => {
          const req = context.switchToHttp().getRequest();
          req.user = currentUser;
          return true;
        });
      return route.post('/stages').send(input).expect(403);
    });
    let stage: Stage;
    let track: Track;
    it('should return 201 if user role is permitted', async () => {
      const trackModel = await TrackModel.create({
        title: 'title',
        description: 'description'
      });
      input.track = trackModel.id;
      currentUser.role = UserRole.ADMIN;
      const { body } = await route.post('/stages').send(input).expect(201);
      stage = await stageService.findByIdAsync(body.id);
      track = await trackService.findByIdAsync(trackModel.id);

      expect(stage.createdBy.toString()).toBe(currentUser.userId);
      expect(track.stages.includes(stage.id as any)).toBe(true);
      expect(body.track.id).toBe(trackModel.id)
    });
    it('should return 409 for existing stage title', async () => {
      return route.post('/stages').send(input).expect(409);
    });
    it('should return 200 when stage is updated', async () => {
      const newTitle = 'NEW_TITLE';
      const { body } = await route
        .put(`/stages/${stage.id}`)
        .send({ ...input, title: newTitle })
        .expect(200);
      const { updatedBy } = await stageService.findById(body.id);
      expect(body.title).toBe(newTitle);
      expect(updatedBy.toString()).toBe(currentUser.userId);
    });

    it('should return a stage with its associated track', async () => {
      const { body } = await route.get(`/stages/${stage.id}`).expect(200);
      expect(track.id.toString()).toBe(body.track.id);
    });
    it('should return stages with their associated tracks', async () => {
      const { body } = await route.get('/stages').expect(200);
      expect(body.items[0].track.id).toBe(track.id.toString());
    });

    it('should return 403 for non-permitted user trying to UPDATE stage', async () => {
      currentUser.role = UserRole.MENTEE;
      return route.put(`/stages/${stage.id}`).send(input).expect(403);
    });
    it('should return 403 for non-permitted user trying to DELETE stage', async () => {
      return route.delete(`/stages/${stage.id}`).send(input).expect(403);
    });
    it('should soft delete stage', async () => {
      currentUser.role = UserRole.ADMIN;

      await route.delete(`/stages/${stage.id}`).send(input).expect(200);

      const { deletedBy, isDeleted } = await StageModel.findById(stage.id);
      const res = await stageService.findByIdAsync(stage.id);

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
