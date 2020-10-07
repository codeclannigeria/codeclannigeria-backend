import {
  ExecutionContext,
  HttpStatus,
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
import * as uploader from '~shared/utils/upload-img.util';

import { JwtAuthGuard } from '../src/auth/guards';
import { JwtPayload } from '../src/auth/models/jwt-payload';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';
import { MentorMentee } from '../src/mentor/models/mentor-mentee.entity';
import { CreateStageDto } from '../src/stages/models/dtos/create-stage.dto';
import { Stage } from '../src/stages/models/stage.entity';
import {
  CreateTrackDto,
  MentorInput
} from '../src/tracks/models/dto/create-track.dto';
import { Track } from '../src/tracks/models/track.entity';
import { TracksModule } from '../src/tracks/tracks.module';
import { TracksService } from '../src/tracks/tracks.service';
import { User, UserRole } from '../src/users/models/user.entity';
import { UserStage } from '../src/userstage/models/userstage.entity';
import { DbTest, inMemoryDb } from './helpers/db-test.module';

describe('TracksController (e2e)', () => {
  let app: INestApplication;
  let route: request.SuperTest<request.Test>;
  let service: TracksService;
  let mongo: typeof mongoose;
  const validEmail = 'email@gmail.com';
  const validPass = 'pass@45Pdd';
  let mentor: User;
  let currentUser: JwtPayload;
  let TrackModel: ReturnModelType<typeof Track>;
  let UserModel: ReturnModelType<typeof User>;
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
      imports: [TracksModule, DbTest],
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
    service = await module.resolve<TracksService>(TracksService, contextId);

    const { uri } = await inMemoryDb.runningInstance;
    mongoose.Promise = Promise;
    mongo = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });

    UserModel = getModelForClass(User, { existingMongoose: mongo });
    TrackModel = getModelForClass(Track, { existingMongoose: mongo });

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
    let stageId: string;
    it('should return 201 if user role is permitted', async () => {
      currentUser.role = UserRole.ADMIN;
      const { body } = await route.post('/tracks').send(input).expect(201);
      track = await service.findById(body.id);
      expect(track.createdBy.toString()).toBe(currentUser.userId);

      StageModel = getModelForClass(Stage, { existingMongoose: mongo });
      const stage: CreateStageDto = {
        description: 'description',
        title: 'title',
        track: track.id,
        level: 0
      };
      stageId = await (await StageModel.create({ ...stage })).id;
    });
    it('should create track with a thumbnail', async () => {
      currentUser.role = UserRole.MENTOR;
      const thumbnailUrl = 'https://www.securePhtotUrl.com';
      jest.spyOn(uploader, 'uploadFileToCloud').mockResolvedValue(thumbnailUrl);
      const { body } = await route
        .post('/tracks/create_with_thumbnail')
        .set('Content-Type', 'multipart/form-data')
        .attach('thumbnail', './docs/images/compodoc-vectorise.png')
        .field({
          description: 'desc',
          title: 'title'
        })
        .expect(HttpStatus.CREATED);

      expect(body.thumbnailUrl).toBe(thumbnailUrl);
    });
    it('should return user stages via track ID', async () => {
      const UserStageModel = getModelForClass(UserStage, {
        existingMongoose: mongo
      });
      await UserStageModel.create({
        user: currentUser.userId,
        stage: stageId,
        track: track.id
      });
      currentUser.role = UserRole.MENTEE;
      const { body } = await route
        .get(`/tracks/${track.id}/my_stages`)
        .expect(200);
      expect(body.items.length).toBeGreaterThan(0);
      expect(body.items[0].stage.id).toBe(stageId);
    });
    it('should return user stages via track ID', async () => {
      currentUser.role = UserRole.MENTEE;
      const { body } = await route
        .get(`/tracks/${track.id}/stages`)
        .expect(200);

      expect(body.items.length).toBeGreaterThan(0);
      expect(body.items[0].track.id).toBe(track.id);
    });

    it('should create mentors of a track', async () => {
      currentUser.role = UserRole.ADMIN;
      const user = await UserModel.create({
        email: 'mentor@gmail.com',
        firstName: 'Mentor',
        lastName: 'Mentor',
        password: validPass,
        role: UserRole.MENTOR,
        technologies: ['node'],
        description: 'description'
      });
      const input: MentorInput = {
        mentorId: user.id
      };
      await route.post(`/tracks/${track.id}/mentors`).send(input).expect(200);

      mentor = user;
    });
    it('should return mentors of a track', async () => {
      const { body } = await route
        .get(`/tracks/${track.id}/mentors`)
        .expect(200);

      expect(body.items[0].id).toBe(mentor.id);
    });
    it('should enroll to a track', async () => {
      const input: MentorInput = {
        mentorId: mentor.id
      };
      await route.post(`/tracks/${track.id}/enroll`).send(input).expect(200);

      const MentorMenteeModel = getModelForClass(MentorMentee);
      const mentorMentee = await MentorMenteeModel.findOne({
        mentor: mentor.id
      });

      expect(mentorMentee).toBeDefined();
      expect((mentorMentee.mentee as any).id).toBe(currentUser.userId);
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
      await route.delete(`/tracks/${track.id}`).send(input).expect(403);
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

    // await mongo.disconnect();
    // await inMemoryDb.stop();
    await app.close();
  });
});
