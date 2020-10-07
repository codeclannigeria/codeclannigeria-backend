import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MentorMentee } from '~/mentor/models/mentor-mentee.entity';
import { BaseService } from '~shared/services';
import { MentorMenteeController } from './mentor-mentee.controller';
import { MentorMenteeService } from './mentor-mentee.service';
const MentorMenteeModel = MongooseModule.forFeature([
  { name: MentorMentee.modelName, schema: MentorMentee.schema }
]);
const baseService = { provide: BaseService, useClass: MentorMenteeService };

@Module({
  imports: [MentorMenteeModel],
  controllers: [MentorMenteeController],
  providers: [MentorMenteeService, baseService],
  exports: [MentorMenteeService, MentorMenteeModel, baseService]
})
export class MentorMenteeModule {}
