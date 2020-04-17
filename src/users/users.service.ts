import { Injectable } from '@nestjs/common';
import { BaseService } from '../shared/base.service';
import { User } from './models/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { ReturnModelType } from '@typegoose/typegoose';

@Injectable()
export class UsersService extends BaseService<User> {
  constructor(
    @InjectModel(User.modelName)
    private readonly userEntity: ReturnModelType<typeof User>,
  ) {
    super(userEntity);
  }
}
