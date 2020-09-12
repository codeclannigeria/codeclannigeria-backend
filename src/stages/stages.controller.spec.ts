import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { BaseService } from '~shared/services';
import { DbTest } from '~test/helpers/db-test.module';

import { TasksService } from '../tasks/tasks.service';
import { TracksService } from '../tracks/tracks.service';
import { CreateStageDto } from './models/dtos/create-stage.dto';
import { StagesController } from './stages.controller';
import { StagesModule } from './stages.module';
import { StagesService } from './stages.service';

describe('Stages Controller', () => {
  let controller: StagesController;
  const trackService: any = {
    findByIdAsync: () => Promise.resolve()
  };
  const taskService: any = {
    findByIdAsync: () => Promise.resolve()
  };
  const stageService = {
    createEntity: () => 'track',
    findOneAsync: () => null,
    insertAsync: () => ({ id: 'id' }),
    findByIdAsync: jest.fn()
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [StagesModule, DbTest]
    })
      .overrideProvider(BaseService)
      .useValue(stageService)
      .overrideProvider(StagesService)
      .useValue(stageService)
      .overrideProvider(TracksService)
      .useValue(trackService)
      .overrideProvider(TasksService)
      .useValue(taskService)
      .compile();

    controller = module.get<StagesController>(StagesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('Create Stage', () => {
    const input: CreateStageDto = {
      title: 'title',
      description: 'description',
      taskCount: 1,
      track: 'trackId',
      level: 0
    };
    it(`should throw ${NotFoundException.name} for non-existing Track`, async () => {
      await expect(controller.create(input)).rejects.toThrowError(
        NotFoundException
      );
    });
    it(`should create new stage`, async () => {
      trackService.findByIdAsync = jest
        .fn()
        .mockResolvedValue({ stages: [], updateOne: jest.fn() });
      stageService.createEntity = jest.fn().mockReturnValue(input);
      const result = await controller.create(input);
      const inputCopy = { ...input };
      delete inputCopy.track;
      expect(result).toMatchObject(inputCopy);
    });
    it(`should throw ${ConflictException.name} for existing Stage`, async () => {
      stageService.findOneAsync = jest.fn().mockResolvedValue(input);
      await expect(controller.create(input)).rejects.toThrowError(
        ConflictException
      );
    });
  });
  it(`should throw ${NotFoundException.name} for non-existing Stage`, async () => {
    return expect(
      controller.getStages('trackId', { limit: 1 })
    ).rejects.toThrowError(NotFoundException);
  });
  it('should get stages', async () => {
    stageService.findByIdAsync = jest.fn(() => Promise.resolve({ stages: [] }));
    taskService.findAll = jest.fn();
    taskService.countAsync = jest.fn();
    await controller.getStages('stageId', { limit: 10 });
  });
});
