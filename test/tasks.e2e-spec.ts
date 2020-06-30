import { ExecutionContext, INestApplication, UnauthorizedException, ValidationPipe } from '@nestjs/common';
import { ContextIdFactory } from '@nestjs/core';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelForClass, mongoose, ReturnModelType } from '@typegoose/typegoose';
import * as request from 'supertest';

import { JwtAuthGuard } from '../src/auth/guards';
import { JwtPayload } from '../src/auth/models/jwt-payload';
import { JwtStrategy } from '../src/auth/strategies/jwt.strategy';
import { Stage } from '../src/stages/models/stage.entity.ts';
import { AssignTasksDto } from '../src/tasks/models/dtos/assign-tasks.dto';
import { CreateTaskDto } from '../src/tasks/models/dtos/create-task.dto';
import { Task } from '../src/tasks/models/task.entity';
import { TasksModule } from '../src/tasks/tasks.module';
import { TasksService } from '../src/tasks/tasks.service';
import { Track } from '../src/tracks/models/track.entity';
import { User, UserRole } from '../src/users/models/user.entity';
import { TaskStatus } from './../src/tasks/models/task.entity';
import { DbTest, inMemoryDb } from './helpers/db-test.module';

describe('TasksController (e2e)', () => {
    let app: INestApplication;
    let route: request.SuperTest<request.Test>;
    let service: TasksService;
    let mongo: typeof mongoose;
    const validEmail = 'email@gmail.com';
    const validPass = 'pass@45Pdd';
    let currentUser: JwtPayload;
    let TaskModel: ReturnModelType<typeof Task>;
    let UserModel: ReturnModelType<typeof User>;
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
            imports: [TasksModule, DbTest],
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
        service = await module.resolve<TasksService>(TasksService, contextId);

        const { uri } = await inMemoryDb.runningInstance;
        mongoose.Promise = Promise;
        mongo = await mongoose.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false
        });
        TaskModel = getModelForClass(Task, { existingMongoose: mongo });
        StageModel = getModelForClass(Stage, { existingMongoose: mongo });
        TrackModel = getModelForClass(Track, { existingMongoose: mongo });

        UserModel = getModelForClass(User, { existingMongoose: mongo });

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

    describe('/tasks (POST)', () => {
        const input: CreateTaskDto = {
            title: 'Task1',
            description: 'Description',
            stage: "",
            track: ""
        };
        it('should return 401 if user not logged in', () => {
            return route.post('/tasks').send(input).expect(401);
        });
        it('should return 403 if user role is neither ADMIN nor MENTOR', async () => {
            jest
                .spyOn(jwtGuard, 'canActivate')
                .mockImplementation((context: ExecutionContext) => {
                    const req = context.switchToHttp().getRequest();
                    req.user = currentUser;
                    return true;
                });
            return route.post('/tasks').send(input).expect(403);
        });
        let task: Task;
        it('should return 201 if user role is permitted', async () => {
            const newTrack = await TrackModel.create({
                title: 'title',
                description: 'description'
            })
            const newStage = await StageModel.create({
                title: 'title',
                description: 'description',
                track: newTrack.id
            })
            input.stage = newStage.id;
            input.track = newTrack.id;

            currentUser.role = UserRole.ADMIN;
            const { body } = await route.post('/tasks').send(input).expect(201);
            task = await service.findById(body.id);
            expect(task.createdBy.toString()).toBe(currentUser.userId);
        });
        it('should return 409 for existing task title', async () => {
            return route.post('/tasks').send(input).expect(409);
        });
        it('should return 200 when task is updated', async () => {
            const newTitle = 'NEW_TITLE';
            const { body } = await route
                .put(`/tasks/${task.id}`)
                .send({ ...input, title: newTitle })
                .expect(200);

            const { updatedBy } = await service.findById(body.id);
            expect(body.title).toBe(newTitle);
            expect(updatedBy.toString()).toBe(currentUser.userId);
        });
        it('should return 403 for non-permitted user trying to UPDATE track', async () => {
            currentUser.role = UserRole.MENTEE;
            return route.put(`/tasks/${task.id}`).send(input).expect(403);
        });
        it('should return 403 for non-permitted user trying to DELETE track', async () => {
            return route.delete(`/tasks/${task.id}`).send(input).expect(403);
        });

        let user: User;
        describe('/tasks/assign', () => {
            let input: AssignTasksDto;
            it('should assign task to user', async () => {
                currentUser.role = UserRole.ADMIN;
                user = await UserModel.create({
                    firstName: 'firstName',
                    lastName: 'lastName',
                    email: 'email@new.com',
                    password: 'pass1#Word'
                });
                input = {
                    userId: user.id,
                    taskIdList: [task.id]
                }
                await route.post('/tasks/assign').send(input).expect(200)
                user = await UserModel.findById(user.id);
                expect(user.tasks[0].toString()).toBe(task.id)
            });
            it('should assign task to user', async () => {
                input = {
                    userId: user.id,
                    taskIdList: [task.id, task.id]
                }
                return route.post('/tasks/assign').send(input).expect(404)
            });
        });
        describe('/tasks/:taskId/submit', () => {
            it('should submit task', async () => {
                currentUser.role = UserRole.MENTEE;
                currentUser.userId = user.id;
                await route.post(`/tasks/${task.id}/submit`).send(input).expect(200)
                const dbTask = await TaskModel.findById(task.id);
                expect(dbTask.status).toBe(TaskStatus.COMPLETED)
                expect(dbTask.updatedBy.toString()).toBe(currentUser.userId)
            });
        });

        it('should soft delete track', async () => {
            currentUser.role = UserRole.ADMIN;

            await route.delete(`/tasks/${task.id}`).send(input).expect(200);

            const { deletedBy, isDeleted } = await TaskModel.findById(task.id);
            const res = await service.findById(task.id);

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
