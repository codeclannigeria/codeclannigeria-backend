import { Module } from '@nestjs/common';

import { UsersModule } from '../users/users.module';
import { UsersService } from './../users/users.service';
import { ProfileController } from './profile.controller';

@Module({
  imports: [UsersModule],
  providers: [UsersService],
  controllers: [ProfileController],
  exports: [UsersService]
})
export class ProfileModule {}
