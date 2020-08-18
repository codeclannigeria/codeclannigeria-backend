import { Module } from '@nestjs/common';

import { MentorModule } from '../mentor/mentor.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [UsersModule, MentorModule],
  providers: [UsersService, ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService]
})
export class ProfileModule { }
