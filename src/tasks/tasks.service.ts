import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { Task } from './models/task.entity';

@Injectable({ scope: Scope.REQUEST })
export class TasksService extends BaseService<Task> {
  constructor(
    @InjectModel(Task.modelName)
    protected readonly taskEntity: ReturnModelType<typeof Task>
  ) {
    super(taskEntity);
  }
}
