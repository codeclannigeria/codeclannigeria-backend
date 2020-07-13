import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { DocumentType, ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { Track } from '../tracks/models/track.entity';
import { Stage } from './models/stage.entity';

@Injectable({ scope: Scope.REQUEST })
export class StagesService extends BaseService<Stage> {
  constructor(
    @InjectModel(Stage.modelName)
    protected readonly entity: ReturnModelType<typeof Stage>,
    @InjectModel(Track.modelName)
    protected readonly track: ReturnModelType<typeof Track>
  ) {
    super(entity);
  }

  async insert(stage: Stage): Promise<DocumentType<Stage>> {
    const newStage = await super.insert(stage);
    const track = newStage.track as any;

    await this.track.findByIdAndUpdate(track.id, {
      $addToSet: { stages: newStage.id },
      updatedBy: this.getUserId()
    });

    return newStage;
  }
}
