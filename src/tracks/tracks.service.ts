import { Injectable, Scope } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import { BaseService } from '~shared/services';

import { Stage } from '../stages/models/stage.entity';
import { User } from '../users/models/user.entity';
import { UsersService } from './../users/users.service';
import { TrackMentor } from './models/track-mentor.entity';
import { Track } from './models/track.entity';

@Injectable({ scope: Scope.REQUEST })
export class TracksService extends BaseService<Track> {

  constructor(
    @InjectModel(Track.modelName)
    protected readonly entity: ReturnModelType<typeof Track>,
    @InjectModel(TrackMentor.modelName)
    protected readonly trackMentorModel: ReturnModelType<typeof TrackMentor>,
    protected readonly userService: UsersService

  ) {
    super(entity);
  }

  // async getAssignedTracks(userId?: string): Promise<Track[]> {
  //   const user = await this.userService.findById(userId || this.getUserId());
  //   await user.populate('tracks').execPopulate()
  //   return user.tracks as Track[];
  // }
  async getMentors(trackId: string): Promise<User[]> {
    const mentors = await this.trackMentorModel.find({ track: trackId }, { mentor: 1 }).populate("mentor");
    return mentors.map(x => x.mentor) as unknown as User[];
  }

  async enroll(trackId: string): Promise<User> {
    const userId = this.getUserId();
    return this.userService.updateAsync(userId, { $addToSet: { tracks: trackId }, updatedBy: userId } as any)
  }

  async getStages(trackId: string): Promise<Stage[]> {
    const track = await (await this.entity.findById(trackId).populate("stages")).execPopulate();

    return track.stages as Stage[];
  }
}
