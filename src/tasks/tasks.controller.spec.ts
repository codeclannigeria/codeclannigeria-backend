import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BaseService } from '~shared/services';
import { DbTest } from '~test/helpers/db-test.module';

import { StagesService } from '../stages/stages.service';
import { TracksService } from '../tracks/tracks.service';
import { UsersService } from '../users/users.service';
import { AssignTasksDto } from './models/dtos/assign-tasks.dto';
import { CreateTaskDto } from './models/dtos/create-task.dto';
import { TasksController } from './tasks.controller';
import { TasksModule } from './tasks.module';
import { TasksService } from './tasks.service';

describe('Tasks Controller', () => {
  let controller: TasksController;
  const taskService: any = { findOneAsync: () => null };
  const trackService = { findByIdAsync: () => null };
  const userService: any = { findByIdAsync: () => null };
  const stageService = { findByIdAsync: () => null };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [TasksModule, DbTest]
    })
      .overrideProvider(BaseService)
      .useValue(taskService)
      .overrideProvider(TasksService)
      .useValue(taskService)
      .overrideProvider(UsersService)
      .useValue(userService)
      .overrideProvider(StagesService)
      .useValue(stageService)
      .overrideProvider(TracksService)
      .useValue(trackService)
      .compile();

    controller = await module.resolve<TasksController>(TasksController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create Tasks', () => {
    const input: CreateTaskDto = {
      title: 'Title',
      description: 'Description',
      stage: 'stage',
      track: 'track'
    };
    it(`should throw ${NotFoundException.name} for non-existing "Stage"`, async () => {
      await expect(controller.create(input)).rejects.toThrowError(
        NotFoundException
      );
    });
    it(`should throw ${NotFoundException.name} for non-existing "Track"`, async () => {
      trackService.findByIdAsync = jest.fn().mockResolvedValueOnce(null);
      await expect(controller.create(input)).rejects.toThrowError(
        NotFoundException
      );
    });
    it('should create task and return 201', async () => {
      stageService.findByIdAsync = jest.fn().mockResolvedValue(input);
      trackService.findByIdAsync = jest.fn().mockResolvedValue(input);
      taskService.createEntity = jest.fn().mockReturnValue(input);
      taskService.insertAsync = jest.fn();
      expect(await controller.create(input)).toMatchObject(input);
    });
    it(`should return ${ConflictException.name} for existing task title`, async () => {
      taskService.findOneAsync = jest
        .fn()
        .mockRejectedValue(new ConflictException());
      await expect(controller.create(input)).rejects.toThrowError(
        ConflictException
      );
    });
  });
  describe('Task Assignment', () => {
    const input: AssignTasksDto = {
      taskIdList: ['task1', 'task2'],
      userId: 'userId'
    };
    it(`should throw ${NotFoundException.name} if user does not exist`, async () => {
      taskService.assignTasks = jest.fn().mockResolvedValue(null);
      await expect(controller.assignTasks(input)).rejects.toThrowError(
        NotFoundException
      );
    });
    it(`should throw ${NotFoundException.name} if one or more tasks do not exist out of the list`, async () => {
      userService.findByIdAsync = jest.fn().mockResolvedValue('user');
      taskService.countAsync = jest.fn().mockResolvedValue(1);
      await expect(controller.assignTasks(input)).rejects.toThrowError(
        NotFoundException
      );
    });
    it('should assign task successfully', async () => {
      taskService.countAsync = jest.fn().mockResolvedValue(2);
      await controller.assignTasks(input);
    });
  });

  describe('Submit Task', () => {
    it(`should throw ${NotFoundException.name} for non-assigned task`, async () => {
      taskService.getAssignedTasks = jest.fn().mockResolvedValue([{ id: "task" }])
      await expect(controller.submitTask('taskId')).rejects.toThrowError(NotFoundException);
    });
    it(`should throw ${NotFoundException.name} for non-assigned task`, async () => {
      taskService.getAssignedTasks = jest.fn().mockResolvedValue([{ id: "taskId", complete: jest.fn() }])
      taskService.submitTask = jest.fn()
      taskService.updateAsync = jest.fn()
      await controller.submitTask('taskId')
    });
  });
});
