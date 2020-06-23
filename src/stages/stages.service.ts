import { Injectable, Scope } from '@nestjs/common';
import { BaseService } from '~shared/services';
import { Stage } from './models/stage.entity.ts';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable({ scope: Scope.REQUEST })
export class StagesService extends BaseService<Stage> {
  constructor(
    @InjectModel(Stage.modelName)
    protected readonly entity: ReturnModelType<typeof Stage>
  ) {
    super(entity);
  }
}
