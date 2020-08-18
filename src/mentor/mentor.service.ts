import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { User } from '../users/models/user.entity';
import { TrackMentor } from './../tracks/models/track-mentor.entity';
import { MentorMentee } from './models/mento-mentee.entity';

@Injectable()
export class MentorService {


    constructor(
        @InjectModel(MentorMentee.modelName) private mentorMentee: ReturnModelType<typeof MentorMentee>,
        @InjectModel(TrackMentor.modelName) private trackMentorModel: ReturnModelType<typeof TrackMentor>) {
    }

    async assignMentor(menteeId: string, mentor: User,): Promise<void> {
        await this.mentorMentee.create({ mentor: mentor.id, mentee: menteeId });
    }
    async assignMentorToTrack(trackId: string, mentorId: string, currentUserId: string): Promise<void> {
        await this.trackMentorModel.create({ track: trackId, mentor: mentorId, createdBy: currentUserId })
    }
}
