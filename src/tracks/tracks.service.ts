import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { Track } from './models/track.entity';

@Injectable({ scope: Scope.REQUEST })
export class TracksService extends BaseService<Track> {
  constructor(
    @InjectModel(Track.modelName)
    protected readonly entity: ReturnModelType<typeof Track>
  ) {
    super(entity);
  }
}
