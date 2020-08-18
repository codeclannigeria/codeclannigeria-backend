import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { UsersModule } from '../users/users.module';
import { MentorController } from './mentor.controller';
import { MentorService } from './mentor.service';
import { MentorMentee } from './models/mento-mentee.entity';

export const MentorMenteeModel = MongooseModule.forFeature([
  { name: MentorMentee.modelName, schema: MentorMentee.schema }
]);

@Module({
  imports: [MentorMenteeModel, UsersModule],
  controllers: [MentorController],
  providers: [MentorService],
  exports: [MentorService]
})
export class MentorModule { }
