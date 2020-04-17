import { BaseService } from '../shared/base.service';
import { User } from './models/user.entity';
import { ReturnModelType } from '@typegoose/typegoose';
export declare class UsersService extends BaseService<User> {
    private readonly userEntity;
    constructor(userEntity: ReturnModelType<typeof User>);
}
