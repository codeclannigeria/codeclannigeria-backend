import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';
import { Request } from 'express';

import { Track } from './models/track.entity';
import { Injectable, Scope, Optional, Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
@Injectable({ scope: Scope.REQUEST })
export class TracksService extends BaseService<Track> {
  @Optional()
  @Inject(REQUEST)
  protected readonly req: Request;
  constructor(
    @InjectModel(Track.modelName)
    protected readonly entity: ReturnModelType<typeof Track>
  ) {
    super(entity);
  }
}
