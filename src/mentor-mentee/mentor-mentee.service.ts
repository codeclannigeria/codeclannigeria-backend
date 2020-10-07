import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { MentorMentee } from '~/mentor/models/mentor-mentee.entity';
import { BaseService } from '~shared/services';

@Injectable({ scope: Scope.REQUEST })
export class MentorMenteeService extends BaseService<MentorMentee> {
  constructor(
    @InjectModel(MentorMentee.modelName)
    protected readonly EntityModel: ReturnModelType<typeof MentorMentee>
  ) {
    super(EntityModel);
  }
}
