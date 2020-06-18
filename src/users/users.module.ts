import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { User } from './models/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.modelName, schema: User.schema }])
  ],
  providers: [UsersService],
  controllers: [UsersController],
  exports: [
    UsersService,
    MongooseModule.forFeature([{ name: User.modelName, schema: User.schema }])
  ]
})
export class UsersModule {}
