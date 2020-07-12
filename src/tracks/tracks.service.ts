import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { Stage } from '../stages/models/stage.entity.ts';
import { UsersService } from './../users/users.service';
import { Track } from './models/track.entity';

@Injectable({ scope: Scope.REQUEST })
export class TracksService extends BaseService<Track> {



  constructor(
    @InjectModel(Track.modelName)
    protected readonly entity: ReturnModelType<typeof Track>,
    protected readonly userService: UsersService

  ) {
    super(entity);
  }

  // async getAssignedTracks(userId?: string): Promise<Track[]> {
  //   const user = await this.userService.findById(userId || this.getUserId());
  //   await user.populate('tracks').execPopulate()
  //   return user.tracks as Track[];
  // }
  // async enroll(trackId: string): Promise<User> {
  //   return this.userService.updateAsync(this.getUserId(), {
  //     $addToSet: { tracks: trackId }
  //   } as any);
  // }

  async enroll(trackId: string): Promise<void> {
    const userId = this.getUserId();
    await this.userService.updateAsync(userId, { $addToSet: { tracks: trackId }, updatedBy: userId } as any)
  }

  async getStages(trackId: string): Promise<Stage[]> {
    const track = await (await this.entity.findById(trackId).populate("stages")).execPopulate();

    return track.stages as Stage[];
  }
}
