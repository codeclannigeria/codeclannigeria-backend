import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { ProfileController } from './profile.controller';
import { ProfileService } from './profile.service';

@Module({
  imports: [UsersModule],
  providers: [ProfileService],
  controllers: [ProfileController],
})
export class ProfileModule {}
