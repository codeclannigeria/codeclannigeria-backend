import { User, UserRole } from '../users/models/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

import { UsersService } from '../users/users.service';
import { MentorMentee } from './models/mento-mentee.entity';

@Injectable()
export class MentorService {

    constructor(
        @InjectModel(MentorMentee.modelName) private mentorMentee: ReturnModelType<typeof MentorMentee>,
        @InjectModel(User.modelName) private userModel: ReturnModelType<typeof User>) {
    }

    async assignMentor(menteeId: string, mentor: User): Promise<void> {
        await this.mentorMentee.create({ mentor: mentor.id, mentee: menteeId });
    }
}
