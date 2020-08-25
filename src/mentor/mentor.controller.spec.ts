import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { mongoose } from '@typegoose/typegoose';
import { DbTest } from '~test/helpers/db-test.module';

import { SubmissionDto } from '../tasks/models/dtos/submission.dto';
import { Submission } from '../tasks/models/submission.entity';
import { GradeSubmissionDto } from '../tasks/models/dtos/grade-submission.dto';
import { MentorController } from './mentor.controller';
import { MentorModule } from './mentor.module';
import { NotFoundException } from '@nestjs/common';

describe('Mentor Controller', () => {
  let controller: MentorController;
  const submissionModel = {
    find: () => ({ limit: () => ({ skip: jest.fn() }) }),
    countDocuments: jest.fn(),
    findById: jest.fn(),
    updateOne: jest.fn()
  }
  const req = { user: 'userId' } as any;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [MentorModule, DbTest],
    }).overrideProvider(getModelToken(Submission.modelName)).useValue(submissionModel).compile();

    controller = module.get<MentorController>(MentorController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should get submissions', async () => {
    const submissionDto: SubmissionDto = {
      id: mongoose.Types.ObjectId().toHexString(),
      gradePercentage: 10,
      createdAt: new Date(),
      updatedAt: new Date(),
      taskUrl: 'www.google.com',
      menteeComment: null,
      mentorComment: null
    };
    jest.spyOn(submissionModel, "find").mockImplementation(() =>
      ({ limit: () => ({ skip: jest.fn(() => Promise.resolve([submissionDto])) }) }));
    jest.spyOn(submissionModel, "countDocuments").mockResolvedValue(1)

    const result = await controller.getSubmissions({ limit: 10 }, req);
    expect(result.totalCount).toBe(1);
    expect(result.items).toContainEqual(submissionDto)
  });

  describe('grad submission', () => {
    const input: GradeSubmissionDto = {
      gradePercentage: 10,
      mentorComment: 'poor'
    }
    it(`should throw ${NotFoundException.name} exception`, async () => {
      await (expect(controller.gradeTask("submissionId", input, req))
        .rejects.toThrowError(NotFoundException));

    });
    it('should grade task submission', async () => {
      const input: GradeSubmissionDto = {
        gradePercentage: 10,
        mentorComment: 'poor'
      }
      jest.spyOn(submissionModel, "findById").mockReturnValue({});
      return controller.gradeTask("submissionId", input, req);
    });
  });


});
