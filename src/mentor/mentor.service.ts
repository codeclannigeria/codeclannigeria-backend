import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';
import * as fs from 'fs';
import configuration from '~shared/config/configuration';
import { MailService } from '~shared/mail/mail.service';

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
    private SubmissionModel: ReturnModelType<typeof Submission>,
    private mailService: MailService
  ) {}

  async assignMentor(
    menteeId: string,
    mentorId: string,
    trackId: string
  ): Promise<void> {
    const result = await this.mentorMenteeModel.findOne({
      mentee: menteeId,
      mentor: mentorId
    });
    if (result) return;
    await this.mentorMenteeModel.create({
      mentor: mentorId,
      mentee: menteeId,
      track: trackId
    });
  }
  async reassignMentee(input: {
    trackId: string;
    menteeId: string;
    fromMentorId: string;
    toMentorId: string;
    adminId: any;
  }): Promise<void> {
    let mentorMentee = await this.mentorMenteeModel.findOne({
      mentor: input.fromMentorId,
      mentee: input.menteeId
    });
    mentorMentee.delete();
    mentorMentee = await this.mentorMenteeModel.findOne({
      mentor: input.toMentorId,
      mentee: input.menteeId
    });
    if (mentorMentee) return;
    await this.mentorMenteeModel.create({
      mentor: input.toMentorId,
      mentee: input.menteeId,
      track: input.trackId
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
  async notifyMenteeOfGrading(submissionId: string): Promise<void> {
    const submission = await this.SubmissionModel.findById(submissionId);
    await submission
      .populate('mentee task mentor', 'firstName lastName title email')
      .execPopulate();
    const { mentor, mentee, task }: any = submission;
    let html = await fs.promises.readFile(
      './src/templates/mentor-task-grade-notif.html',
      { encoding: 'utf8' }
    );
    html = html
      .replace('%mentorName%', `${mentor.firstName} ${mentor.lastName}`)
      .replace('%taskTitle%', task.title);

    this.mailService.sendMailAsync({
      from: configuration().appEmail,
      to: mentee.email,
      html,
      date: new Date(Date.now()),
      subject: 'Your Task Has Been Graded'
    });
  }
}
