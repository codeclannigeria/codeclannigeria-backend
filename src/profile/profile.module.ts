import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [UsersModule],
  providers: [UsersService, ProfileService],
  controllers: [ProfileController],
  exports: [ProfileService]
})
export class ProfileModule { }
