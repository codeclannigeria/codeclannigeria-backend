import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BaseService } from '~shared/services';

import { User } from './models/user.entity';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

const UserModel = MongooseModule.forFeature([
  { name: User.modelName, schema: User.schema }
]);
@Module({
  imports: [UserModel],
  providers: [UsersService, { provide: BaseService, useClass: UsersService }],
  controllers: [UsersController],
  exports: [UsersService, UserModel]
})
export class UsersModule {}
