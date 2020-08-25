import { ExecutionContext, INestApplication, UnauthorizedException, ValidationPipe, HttpStatus } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelForClass, mongoose } from '@typegoose/typegoose';
import * as request from 'supertest';

import { JwtAuthGuard } from '../src/auth/guards';
import { JwtPayload } from '../src/auth/models/jwt-payload';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';
import { CoursesModule } from '../src/courses/courses.module';
import { CoursesService } from '../src/courses/courses.service';
import { CreateCourseDto } from '../src/courses/models/dtos/create-course.dto';
import { User, UserRole } from '../src/users/models/user.entity';
import { DbTest, inMemoryDb } from './helpers/db-test.module';

describe('Courses Controller (e2e)', () => {
    let currentUser: JwtPayload;
    let app: INestApplication;
    let mongo: typeof mongoose;
    let coursesService: CoursesService
    let input: CreateCourseDto
    let route: request.SuperTest<request.Test>;
    const validEmail = 'email@gmail.com';
    const validPass = 'pass@45Pdd';

    const jwtGuard = {
        canActivate: (context: ExecutionContext): boolean => {
            const req = context.switchToHttp().getRequest();
            req.user = currentUser;
            throw new UnauthorizedException();
        }
    };
    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            imports: [CoursesModule, DbTest],
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
        coursesService = await module.resolve<CoursesService>(CoursesService);

        const { uri } = await inMemoryDb.runningInstance;
        mongoose.Promise = Promise;
        mongo = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        const UserModel = getModelForClass(User, { existingMongoose: mongo });
        const user = await UserModel.create({
            email: validEmail,
            firstName: 'firstName',
            lastName: 'lastName',
            password: validPass,
            role: UserRole.ADMIN
        });

        currentUser = {
            email: user.email,
            userId: user.id,
            role: user.role
        };
        route = request(app.getHttpServer());
    });
    it('should create course', async () => {
        jest
            .spyOn(jwtGuard, 'canActivate')
            .mockImplementation((context: ExecutionContext) => {
                const req = context.switchToHttp().getRequest();
                req.user = currentUser;
                return true;
            });
        input = {
            description: 'description',
            title: 'title',
            playlistUrl: 'www.url.com'
        }
        const { body } = await route.post('/courses').send(input).expect(201);
        const { createdBy } = await coursesService.findByIdAsync(body.id);

        expect(createdBy.toString()).toBe(currentUser.userId);
    });
    it('should return conflict for same title', async () => {
        await route.post('/courses').send(input).expect(HttpStatus.CONFLICT);
    });
    it('should throw forbidden if user is not admin', async () => {
        currentUser.role = UserRole.MENTOR;
        return route.post('/courses').send(input).expect(HttpStatus.FORBIDDEN);
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
