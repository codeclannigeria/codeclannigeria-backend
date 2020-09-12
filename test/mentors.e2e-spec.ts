import {
  ExecutionContext,
  HttpStatus,
  INestApplication,
  UnauthorizedException,
  ValidationPipe
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import * as request from 'supertest';

import { JwtAuthGuard } from '../src/auth/guards';
import { JwtPayload } from '../src/auth/models/jwt-payload';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';
import { MentorModule } from '../src/mentor/mentor.module';
import { GradeSubmissionDto } from '../src/tasks/models/dtos/grade-submission.dto';
import { Submission } from '../src/tasks/models/submission.entity';
import { User, UserRole } from '../src/users/models/user.entity';
import { DbTest, inMemoryDb } from './helpers/db-test.module';

describe('Courses Controller (e2e)', () => {
  let currentUser: JwtPayload;
  let app: INestApplication;
  let mongo: typeof mongoose;
  let submission: Submission;
  let route: request.SuperTest<request.Test>;

  const jwtGuard = {
    canActivate: (context: ExecutionContext): boolean => {
      const req = context.switchToHttp().getRequest();
      req.user = currentUser;
      throw new UnauthorizedException();
    }
  };
  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MentorModule, DbTest],
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

    const { uri } = await inMemoryDb.runningInstance;
    mongoose.Promise = Promise;
    mongo = await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    });
    const UserModel = getModelForClass(User, { existingMongoose: mongo });

    const validPass = 'pass@45Pdd';
    const user = await UserModel.create({
      email: 'mentor@gmail.com',
      firstName: 'firstName',
      lastName: 'lastName',
      password: validPass,
      role: UserRole.MENTOR
    });
    // const mentee = await UserModel.create({
    //   email: 'mentee@gmail.com',
    //   firstName: 'Mentee',
    //   lastName: 'Mentee',
    //   password: validPass,
    //   role: UserRole.MENTEE
    // });

    const SubmissionModel = getModelForClass(Submission, {
      existingMongoose: mongo
    });
    const menteeId = mongo.Types.ObjectId().toHexString();
    submission = await SubmissionModel.create({
      taskUrl: 'www.google.com',
      task: mongo.Types.ObjectId().toHexString(),
      mentor: user.id,
      createdBy: menteeId,
      mentee: menteeId
    });
    await SubmissionModel.create({
      taskUrl: 'www.google.com',
      task: mongo.Types.ObjectId().toHexString(),
      mentor: user.id,
      createdBy: menteeId,
      mentee: menteeId
    });
    await SubmissionModel.create({
      taskUrl: 'www.google.com',
      task: mongo.Types.ObjectId().toHexString(),
      mentor: mongo.Types.ObjectId().toHexString(),
      createdBy: menteeId,
      mentee: menteeId
    });

    currentUser = {
      email: user.email,
      userId: user.id,
      role: user.role
    };
    route = request(app.getHttpServer());
  });
  it('should get submissions', async () => {
    jest
      .spyOn(jwtGuard, 'canActivate')
      .mockImplementation((context: ExecutionContext) => {
        const req = context.switchToHttp().getRequest();
        req.user = currentUser;
        return true;
      });

    const { body } = await route
      .get('/mentors/submissions')
      .expect(HttpStatus.OK);

    expect(body.items.length).toBe(2);
    expect(body.items[0].id).toBeDefined();
  });
  it('should grade task', async () => {
    const input: GradeSubmissionDto = {
      gradePercentage: 23,
      mentorComment: 'Great'
    };
    return route
      .post(`/mentors/grade/${submission.id}`)
      .send(input)
      .expect(HttpStatus.OK);
  });

  afterAll(async () => {
    const { collections } = mongoose.connection;
    Object.keys(collections).forEach(async (k) =>
      collections[`${k}`].deleteMany({})
    );

    // await mongo.disconnect();
    // await inMemoryDb.stop();
    await app.close();
  });
});
