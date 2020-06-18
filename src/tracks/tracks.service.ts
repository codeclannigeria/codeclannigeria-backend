import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { BaseService } from '~shared/services';
import { ReturnModelType } from '@typegoose/typegoose';

import { Track } from './models/track.entity';

@Injectable({ scope: Scope.REQUEST })
export class TracksService extends BaseService<Track> {
  constructor(
    @InjectModel(Track.modelName)
    protected readonly userEntity: ReturnModelType<typeof Track>
  ) {
    super(userEntity);
  }
}
