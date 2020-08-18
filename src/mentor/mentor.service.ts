import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { TrackMentor } from '../tracks/models/track-mentor.entity';
import { User } from '../users/models/user.entity';
import { MentorMentee } from './models/mento-mentee.entity';

@Injectable()
export class MentorService {
    constructor(
        @InjectModel(MentorMentee.modelName) private mentorMentee: ReturnModelType<typeof MentorMentee>,
        @InjectModel(TrackMentor.modelName) private trackMentorModel: ReturnModelType<typeof TrackMentor>) {
    }

    async assignMentor(menteeId: string, mentorId: string,): Promise<void> {
        const mentor = await this.mentorMentee.findOne({ mentee: menteeId, mentor: mentorId });
        if (mentor) return;
        await this.mentorMentee.create({ mentor: mentorId, mentee: menteeId });
    }
    async assignMentorToTrack(trackId: string, mentorId: string, currentUserId: string): Promise<void> {
        await this.trackMentorModel.create({ track: trackId, mentor: mentorId, createdBy: currentUserId })
    }
    async getMentors(menteeId: string): Promise<User[]> {
        const mentors = await this.mentorMentee.find({ mentee: menteeId }).populate("mentor");
        return mentors.map(x => x.mentor) as unknown as User[];
    }
    async getMentees(mentorId: string): Promise<User[]> {
        const mentors = await this.mentorMentee.find({ mentor: mentorId }).populate("mentee");
        return mentors.map(x => x.mentor) as unknown as User[];
    }
}
