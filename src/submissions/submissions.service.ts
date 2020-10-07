import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { Submission } from '~/tasks/models/submission.entity';
import { BaseService } from '~shared/services';

@Injectable({ scope: Scope.REQUEST })
export class SubmissionsService extends BaseService<Submission> {
  constructor(
    @InjectModel(Submission.modelName)
    protected readonly EntityModel: ReturnModelType<typeof Submission>
  ) {
    super(EntityModel);
  }
}
