import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { TrackMentor } from '../tracks/models/track-mentor.entity';
import { User } from '../users/models/user.entity';
import { MentorMentee } from './models/mento-mentee.entity';

@Injectable()
export class MentorService {
    constructor(
        @InjectModel(MentorMentee.modelName) private mentorMenteeModel: ReturnModelType<typeof MentorMentee>,
        @InjectModel(TrackMentor.modelName) private trackMentorModel: ReturnModelType<typeof TrackMentor>) {
    }

    async assignMentor(menteeId: string, mentorId: string,): Promise<void> {
        const mentor = await this.mentorMenteeModel.findOne({ mentee: menteeId, mentor: mentorId });
        if (mentor) return;
        await this.mentorMenteeModel.create({ mentor: mentorId, mentee: menteeId });
    }
    async assignMentorToTrack(trackId: string, mentorId: string, currentUserId: string): Promise<void> {
        const trackMentor = await this.trackMentorModel.findOne({ track: trackId, mentor: mentorId });
        if (trackMentor) return;
        await this.trackMentorModel.create({ track: trackId, mentor: mentorId, createdBy: currentUserId })
    }
    async getMentors(menteeId: string): Promise<User[]> {
        const mentors = await this.mentorMenteeModel.find({ mentee: menteeId }).populate("mentor");
        return mentors.map(x => x.mentor) as unknown as User[];
    }
    async getMentees(mentorId: string): Promise<User[]> {
        const mentors = await this.mentorMenteeModel.find({ mentor: mentorId }).populate("mentee");
        return mentors.map(x => x.mentor) as unknown as User[];
    }
}
