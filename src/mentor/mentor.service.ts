import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { Submission } from '../tasks/models/submission.entity';
import { TrackMentor } from '../tracks/models/track-mentor.entity';
import { User } from '../users/models/user.entity';
import { MentorMentee } from './models/mentor-mentee.entity';

@Injectable()
export class MentorService {
  constructor(
    @InjectModel(MentorMentee.modelName)
    private mentorMenteeModel: ReturnModelType<typeof MentorMentee>,
    @InjectModel(TrackMentor.modelName)
    private trackMentorModel: ReturnModelType<typeof TrackMentor>,
    @InjectModel(Submission.modelName)
    private SubmissionModel: ReturnModelType<typeof Submission>
  ) {}

  async assignMentor(
    menteeId: string,
    mentorId: string,
    trackId: string
  ): Promise<void> {
    const mentor = await this.mentorMenteeModel.findOne({
      mentee: menteeId,
      mentor: mentorId
    });
    if (mentor) return;
    await this.mentorMenteeModel.create({
      mentor: mentorId,
      mentee: menteeId,
      track: trackId
    });
  }
  async assignMentorToTrack(
    trackId: string,
    mentorId: string,
    currentUserId: string
  ): Promise<void> {
    const trackMentor = await this.trackMentorModel.findOne({
      track: trackId,
      mentor: mentorId
    });
    if (trackMentor) return;
    await this.trackMentorModel.create({
      track: trackId,
      mentor: mentorId,
      createdBy: currentUserId
    });
  }
  async getMentors(input: {
    menteeId: string;
    limit: number;
    skip: number;
    conditions?: any;
    options?: any;
  }): Promise<{ totalCount: number; mentors: User[] }> {
    const mentors = await this.mentorMenteeModel
      .find({ ...input.conditions, mentee: input.menteeId }, input.options)
      .populate({ path: 'mentor' })
      .limit(input.limit)
      .skip(input.skip);
    const totalCount = await this.mentorMenteeModel
      .find({ mentee: input.menteeId })
      .countDocuments();
    const users = (mentors.map((x) => x.mentor) as unknown) as User[];
    return { totalCount, mentors: users };
  }
  async getMentees(input: {
    mentorId: string;
    limit: number;
    skip: number;
    conditions?: any;
    options?: any;
  }): Promise<{ totalCount: number; mentees: User[] }> {
    const mentees = await this.mentorMenteeModel
      .find({ ...input.conditions, mentor: input.mentorId }, input.options)
      .populate({ path: 'mentee', populate: { path: 'tracks' } })
      .limit(input.limit)
      .skip(input.skip);

    const totalCount = await this.mentorMenteeModel
      .find({ mentor: input.mentorId })
      .countDocuments();
    const users = (mentees.map((x) => x.mentee) as unknown) as User[];
    return { totalCount, mentees: users };
  }
  async countSubmissions(mentorId: string): Promise<number> {
    return this.SubmissionModel.find({
      mentor: mentorId
    }).countDocuments();
  }
}
